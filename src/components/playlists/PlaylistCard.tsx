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
  Typography,
  CardActions,
  Collapse,
  Badge,
  Tooltip,
} from '@material-ui/core';
import { useState } from 'react';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import clsx from 'clsx';
import { Playlist } from '../../models/playlist';
import styles from './playlists.module.css';
import useDuplicates from '../../hooks/useDuplicates';
import { Track } from '../../models/track';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';

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
};

type DeleteRequest = {
  tracks: DeleteTrackRequest[];
};

type DeleteTrackRequest = {
  uri: string;
  positions: Number[];
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
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      marginRight: '12px',
    },
  })
);

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { duplicates, tracks } = useDuplicates(playlist.tracks.href);
  const [cleaned, setCleaned] = useState(false);
  const [error, setError] = useState('');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onDeleteDuplicatesClick = () => {
    if (!duplicates) return;
    if (!tracks || tracks.length === 0) return;

    const deleteRequest: DeleteRequest = {
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

    axios
      .delete(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        data: deleteRequest,
      })
      .then((_) => setCleaned(true))
      .catch((error) => {
        if (error.response.status === 403) {
          setError(
            'You do not have permission to delete tracks from this playlist.'
          );
        } else {
          setError(
            'Something went wrong when trying to delete duplicate tracks from this playlist'
          );
        }
      });
  };

  if (!duplicates || duplicates.duplicates === 0 || cleaned) {
    return null;
  }

  return (
    <div className={styles.playlistCard}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Badge
              badgeContent={duplicates.duplicates}
              color="error"
              className={classes.avatar}
            >
              <QueueMusicIcon />
            </Badge>
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
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {Object.keys(duplicates.tracksCount).map((key) => {
              if (duplicates.tracksCount[key] > 1) {
                return (
                  <Typography key={key}>
                    {
                      tracks.filter((track: Track) => track.id === key)[0]
                        .artists[0].name
                    }{' '}
                    -{' '}
                    {tracks.filter((track: Track) => track.id === key)[0].name}
                  </Typography>
                );
              }
              return null;
            })}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default PlaylistCard;
