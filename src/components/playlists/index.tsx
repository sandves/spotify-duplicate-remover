import React from 'react';
import { useUser } from '../../context/UserContext';
import { Playlist } from '../../models/playlist';
import PlaylistCard from './PlaylistCard';
import styles from './playlists.module.css';
import usePlaylists from '../../hooks/usePlaylists';

const Playlists: React.FC = () => {
  const user = useUser();
  const playlists = usePlaylists();

  return (
    <div className={styles.playlistsContainer}>
      {playlists
        .filter((playlist: Playlist) => {
          if (playlist.owner.id !== user.id && !playlist.collaborative)
            return false;
          else return true;
        })
        .map((playlist: Playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
    </div>
  );
};

export default Playlists;
