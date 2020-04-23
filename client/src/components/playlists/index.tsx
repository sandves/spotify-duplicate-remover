import React from 'react';
import PlaylistCard from './PlaylistCard';
import useDuplicates, { DuplicatesWithTracks } from '../../hooks/useDuplicates';
import { Duplicates } from '../../hooks/useDuplicateCounter';
import {
  LinearProgress,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      marginTop: theme.spacing(1.5),
    },
    progressBar: {
      marginTop: theme.spacing(1),
    },
    playlistsContainer: {
      padding: theme.spacing(1, 1),
    },
    playlistGrid: {
      display: 'grid',
      gridGap: theme.spacing(2),
      gridTemplateColumns: 'repeat(auto-fill, 345px)',
      justifyContent: 'center',
    },
  })
);

const Playlists: React.FC = () => {
  const classes = useStyles();
  const { duplicates, progress, loading } = useDuplicates();

  if (!loading && duplicates.every((d) => d.duplicates?.duplicates === 0)) {
    return (
      <div className={classes.alert}>
        <Alert variant="filled" severity="success">
          {'All looks good!'}
        </Alert>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={classes.progressBar}>
          <LinearProgress variant="determinate" value={progress} />
        </div>
      )}
      <div className={classes.playlistsContainer}>
        <div className={classes.playlistGrid}>
          {duplicates
            .filter((d: DuplicatesWithTracks) => d.duplicates.duplicates > 0)
            .map((d: DuplicatesWithTracks) => {
              return (
                <PlaylistCard
                  key={d.playlist.id}
                  playlist={d.playlist}
                  duplicates={d.duplicates as Duplicates}
                  tracks={d.tracks}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Playlists;
