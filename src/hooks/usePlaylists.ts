import { Playlist, PlaylistResponse } from '../models/playlist';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

const usePlaylists = (): Playlist[] => {
  const user = useUser();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const getAllPlaylists = (url: string) => {
      axios
        .get<PlaylistResponse>(url)
        .then((response: AxiosResponse<PlaylistResponse>) => {
          setPlaylists((existingPlaylists: Playlist[]) => [
            ...response.data.items,
            ...existingPlaylists,
          ]);
          if (response.data.next) {
            getAllPlaylists(response.data.next);
          }
        });
    };

    getAllPlaylists('https://api.spotify.com/v1/me/playlists?limit=50');
  }, [user]);

  return playlists;
};

export default usePlaylists;
