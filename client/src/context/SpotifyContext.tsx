import React, { createContext, useContext } from 'react';
import { ISpotifyApi, SpotifyApi } from '../spotify';

export interface ISpotifyContext {
  api: ISpotifyApi;
}

const SpotifyContext = createContext<ISpotifyContext>({
  api: new SpotifyApi(),
});

const SpotifyProvider: React.FC<any> = (props: any) => {
  return (
    <SpotifyContext.Provider value={{ api: new SpotifyApi() }} {...props} />
  );
};

const useSpotify = (): ISpotifyContext => useContext(SpotifyContext);

export { SpotifyProvider, useSpotify };
