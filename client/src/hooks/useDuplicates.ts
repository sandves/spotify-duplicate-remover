import { Duplicates } from './useDuplicateCounter';
import { Track, Playlist } from '../spotify';
import { useEffect, useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import usePlaylists from './usePlaylists';
import { useSpotify } from '../context/SpotifyContext';

export type DuplicatesWithTracks = {
  playlist: Playlist;
  duplicates: Duplicates | undefined;
  tracks: Track[];
};

const countDuplicates = (tracks: Track[]): Duplicates => {
  const count: { [id: string]: number } = {};
  let duplicates = 0;
  tracks.forEach(function (track: Track) {
    if (track && track.id) {
      count[track.id] = (count[track.id] || 0) + 1;
      if (count[track.id] > 1) {
        duplicates++;
      }
    }
  });
  return { tracksCount: count, duplicates: duplicates };
};

export type DuplicateProps = {
  duplicates: DuplicatesWithTracks[];
  progress: number;
  loading: boolean;
};

const useDuplicates = (): DuplicateProps => {
  const playlists = usePlaylists();
  const { api } = useSpotify();
  const [progress, setProgress] = useState(0);
  const user = useUser();
  const [duplicatesMap, setDuplicatesMap] = useState<DuplicatesWithTracks[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);

  const getDuplicatesMap = useCallback(async () => {
    if (!playlists || playlists.length === 0) return;
    setLoading(true);
    for (let playlist of playlists) {
      if (playlist.owner.id !== user.id && !playlist.collaborative) {
        continue;
      }

      if (duplicatesMap.some((x) => x.playlist.id === playlist.id)) {
        continue;
      }

      const tracks = await api.getTracks(playlist.tracks.href);
      const duplicates = {
        playlist: playlist,
        duplicates: countDuplicates(tracks),
        tracks,
      };
      setDuplicatesMap((existing) => [...existing, duplicates]);
    }
    setLoading(false);
  }, [playlists]);

  useEffect(() => {
    getDuplicatesMap();
  }, [getDuplicatesMap]);

  useEffect(() => {
    if (!duplicatesMap) {
      return;
    }
    setProgress((duplicatesMap.length / playlists.length) * 100);
  }, [duplicatesMap, playlists]);

  return { duplicates: duplicatesMap, progress, loading };
};

export default useDuplicates;
