export interface Playlist {
  id: string;
  name: string;
  owner: Owner;
  tracks: Tracks;
  collaborative: boolean;
  images: Image[];
}

export interface Image {
  width: string;
  height: string;
  url: string;
}

export interface Tracks {
  href: string;
  total: number;
}

export interface Owner {
  id: string;
}

export interface PlaylistResponse {
  items: Playlist[];
  next: string;
}
