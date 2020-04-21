import { Playlist } from '../spotify';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { useSpotify } from '../context/SpotifyContext';

const usePlaylists = (): Playlist[] => {
  const user = useUser();
  const { api } = useSpotify();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetch = async () => {
    const allPlaylists = await api.getPlaylists(
      'https://api.spotify.com/v1/me/playlists?limit=50'
    );
    setPlaylists(allPlaylists);
  };

  useEffect(() => {
    fetch();
  }, [user]);

  return playlists;
};

export default usePlaylists;
