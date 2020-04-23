import React from 'react';
import { Duplicates } from '../../hooks/useDuplicateCounter';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  DialogActions,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { Track } from '../../spotify';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DeleteIcon from '@material-ui/icons/Delete';

export interface DuplicatesDialogProps {
  open: boolean;
  onClose: () => void;
  duplicates: Duplicates;
  tracks: Track[];
  onDelete: (trackId: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      marginLeft: -theme.spacing(1.5),
    },
    listItemText: {
      marginRight: theme.spacing(3),
    },
  })
);

const DuplicatesDialog: React.FC<DuplicatesDialogProps> = ({
  open,
  onClose,
  onDelete,
  duplicates,
  tracks,
}) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="simple-dialog-title">Duplicate tracks</DialogTitle>
      <DialogContent>
        <div className={classes.dialogContent}>
          <List dense={false}>
            {Object.keys(duplicates.tracksCount).map((key) => {
              if (duplicates.tracksCount[key] > 1) {
                return (
                  <ListItem key={key}>
                    <ListItemIcon>
                      <MusicNoteIcon />
                    </ListItemIcon>
                    <div className={classes.listItemText}>
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
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDelete(key)}
                      >
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
        <Button onClick={onClose} color="default">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicatesDialog;
