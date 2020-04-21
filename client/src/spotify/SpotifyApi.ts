import { Playlist, PlaylistResponse } from './models/playlist';
import {
  Track,
  TracksResponse,
  TrackItem,
  DeleteTracksRequest,
} from './models/track';
import axios from 'axios';

export interface ISpotifyApi {
  getPlaylists(url: string): Promise<Playlist[]>;
  getTracks(url: string): Promise<Track[]>;
  deleteTracks(request: DeleteTracksRequest): Promise<void>;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class SpotifyApi implements ISpotifyApi {
  async getPlaylists(url: string): Promise<Playlist[]> {
    const response = await axios.get<PlaylistResponse>(url);
    if (response.data.next) {
      return [
        ...response.data.items,
        ...(await this.getPlaylists(response.data.next)),
      ];
    } else {
      return response.data.items;
    }
  }

  async getTracks(url: string): Promise<Track[]> {
    try {
      const response = await axios.get<TracksResponse>(url);
      if (response.data.next) {
        return [
          ...response.data.items
            .filter((trackItem: TrackItem) => trackItem.track)
            .map((trackItem: TrackItem) => trackItem.track),
          ...(await this.getTracks(response.data.next)),
        ];
      } else {
        return response.data.items
          .filter((trackItem: TrackItem) => trackItem.track)
          .map((trackItem: TrackItem) => trackItem.track);
      }
    } catch (error) {
      if (error.response.status === 429) {
        await delay(parseInt(error.response.headers['retry-after']) * 1000);
        return await this.getTracks(url);
      }
      throw error;
    }
  }
  async deleteTracks(request: DeleteTracksRequest): Promise<void> {
    try {
      await axios.delete(
        `https://api.spotify.com/v1/playlists/${request.playlistId}/tracks`,
        {
          data: request,
        }
      );
    } catch (error) {
      if (error.response.status === 403) {
        throw Error(
          'You do not have permission to delete tracks from this playlist.'
        );
      } else {
        console.error(error);
        throw Error(
          'Something went wrong when trying to delete duplicate tracks from this playlist'
        );
      }
    }
  }
}
