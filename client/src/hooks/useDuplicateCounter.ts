import { useEffect, useState } from 'react';
import { Track } from '../spotify';

export type Duplicates = {
  tracksCount: { [id: string]: number };
  duplicates: number;
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

const useDuplicateCounter = (tracks: Track[]) => {
  const [trackCount, setTrackCount] = useState<Duplicates>();
  useEffect(() => {
    if (tracks) {
      setTrackCount(countDuplicates(tracks));
    }
  }, [tracks]);

  return trackCount;
};

export default useDuplicateCounter;
