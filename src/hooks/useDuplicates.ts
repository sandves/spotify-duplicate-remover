import useAllTracks from './useAllTracks';
import useDuplicateCounter, { Duplicates } from './useDuplicateCounter';
import { Track } from '../models/track';

export type DuplicatesWithTracks = {
  duplicates: Duplicates | undefined;
  tracks: Track[];
};

const useDuplicates = (tracksUrl: string): DuplicatesWithTracks => {
  const { tracks } = useAllTracks(tracksUrl);
  const duplicates = useDuplicateCounter(tracks);
  return { duplicates, tracks };
};

export default useDuplicates;
