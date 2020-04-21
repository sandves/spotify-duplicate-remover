import React from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  Card,
  CardHeader,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
  Badge,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { useState } from 'react';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import { Duplicates } from '../../hooks/useDuplicateCounter';
import { Playlist, Track, DeleteTracksRequest } from '../../spotify';
import { useSpotify } from '../../context/SpotifyContext';

const getTrackPositions = (trackId: string, tracks: Track[]): Number[] => {
  const positions = [];
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].id === trackId) {
      positions.push(i);
    }
  }
  return positions;
};

export type PlaylistCardProps = {
  playlist: Playlist;
  duplicates: Duplicates;
  tracks: Track[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      minWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    avatar: {
      marginRight: theme.spacing(1.5),
    },
    tracks: {
      marginLeft: 'auto',
    },
    playlistCard: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  duplicates,
  tracks,
}) => {
  const classes = useStyles();
  const { api } = useSpotify();
  const [cleaned, setCleaned] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const onDeleteDuplicatesClick = () => {
    if (!duplicates) return;
    if (!tracks || tracks.length === 0) return;

    const deleteRequest: DeleteTracksRequest = {
      playlistId: playlist.id,
      tracks: [],
    };

    Object.keys(duplicates.tracksCount).forEach((key) => {
      if (duplicates.tracksCount[key] > 1) {
        const positions = getTrackPositions(key, tracks);
        const track = tracks.find((track) => track.id === key);
        if (track && positions.length >= 2) {
          positions.pop();
          deleteRequest.tracks.push({
            uri: track.linked_from ? track.linked_from.uri : track.uri,
            positions: positions,
          });
        }
      }
    });

    api
      .deleteTracks(deleteRequest)
      .then((_) => setCleaned(true))
      .catch((error) => {
        setError(error);
      });
  };

  if (!duplicates || duplicates.duplicates === 0 || cleaned) {
    return null;
  }

  return (
    <div className={classes.playlistCard}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Tooltip title="{duplicates.duplicates} duplicates">
              <Badge
                badgeContent={duplicates.duplicates}
                color="error"
                className={classes.avatar}
              >
                <QueueMusicIcon />
              </Badge>
            </Tooltip>
          }
          title={playlist.name}
          subheader={playlist.owner.id}
        />
        {playlist.images.length > 0 && (
          <CardMedia
            className={classes.media}
            image={playlist.images[0].url}
            title={playlist.name}
          />
        )}
        {error && (
          <CardContent>
            <Alert
              variant="filled"
              severity="error"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </CardContent>
        )}
        <CardActions disableSpacing>
          <Tooltip title="Delete duplicates">
            <IconButton
              aria-label="Delete duplicates"
              onClick={onDeleteDuplicatesClick}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
          <Button
            className={classes.tracks}
            onClick={() => setDialogOpen(true)}
          >
            Duplicates
          </Button>
        </CardActions>
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="simple-dialog-title">Duplicate tracks</DialogTitle>
        <DialogContent>
          <div style={{ marginLeft: '-12px' }}>
            <List dense={false}>
              {Object.keys(duplicates.tracksCount).map((key) => {
                if (duplicates.tracksCount[key] > 1) {
                  return (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <MusicNoteIcon />
                      </ListItemIcon>
                      <div style={{ marginRight: '24px' }}>
                        <ListItemText
                          primary={
                            tracks.filter((track: Track) => track.id === key)[0]
                              .name
                          }
                          secondary={
                            tracks.filter((track: Track) => track.id === key)[0]
                              .artists[0].name
                          }
                        />
                      </div>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                }
                return null;
              })}
            </List>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="default">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaylistCard;
