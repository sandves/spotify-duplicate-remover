import { useState, useEffect } from 'react';
import { Track, TracksResponse, TrackItem } from '../models/track';
import axios, { AxiosResponse } from 'axios';

const useAllTracks = (url: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const getAllTracks = (url: string) => {
      axios
        .get<TracksResponse>(url)
        .then((response: AxiosResponse<TracksResponse>) => {
          setTracks((existingTracks: Track[]) => [
            ...response.data.items
              .filter((trackItem: TrackItem) => trackItem.track)
              .map((trackItem: TrackItem) => trackItem.track),
            ...existingTracks,
          ]);
          if (response.data.next) {
            getAllTracks(response.data.next);
          }
        });
    };

    getAllTracks(url);
  }, [url]);

  return { tracks };
};

export default useAllTracks;
