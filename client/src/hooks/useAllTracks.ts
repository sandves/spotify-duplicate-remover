import { useState, useEffect } from 'react';
import { Track } from '../spotify';
import { useSpotify } from '../context/SpotifyContext';

const useAllTracks = (url: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const { api } = useSpotify();

  useEffect(() => {
    api.getTracks(url).then((tracks) => setTracks(tracks));
  }, [url]);

  return { tracks };
};

export default useAllTracks;
