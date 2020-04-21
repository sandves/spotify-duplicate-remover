export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  linked_from: LinkedFrom;
  uri: string;
}

export interface TrackItem {
  track: Track;
}

export interface TracksResponse {
  items: TrackItem[];
  next: string;
}

export interface Artist {
  name: string;
}

export interface LinkedFrom {
  uri: string;
}

export interface DeleteTracksRequest {
  playlistId: string;
  tracks: DeleteTrackRequest[];
}

interface DeleteTrackRequest {
  uri: string;
  positions: Number[];
}
