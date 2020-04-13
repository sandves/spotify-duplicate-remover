import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { User } from '../models/user';

export type AuthData = {
  user: User;
  token: string;
};

export type AuthContext = {
  data: AuthData;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContext | null>(null);

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = '48e5a9cd2b0a481c940b2bf1c3ef9ee5';
const redirectUri = 'http://localhost:3000';
const scopes = [
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public'
];

const AuthProvider: React.FC<any> = (props: any) => {
  const [user, setUser] = useState<User>();

  const logout = () => {
    localStorage.removeItem('token');
  };

  let token = localStorage.getItem('token');
  if (!token) {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce(function(initial: { [id: string]: string }, item: string) {
        if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = '';

    if (hash.access_token) {
      localStorage.setItem('token', hash.access_token);
      token = hash.access_token;
    } else {
      window.location.assign(
        `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          '%20'
        )}&response_type=token&show_dialog=true`
      );
    }
  }

  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  axios.interceptors.response.use(
    function(response: AxiosResponse<any>) {
      return response;
    },
    function(error) {
      console.log(error);
      if (error.response.status === 401) {
        console.log('logging out');
        logout();
      }
      return Promise.reject(error);
    }
  );

  if (!user) {
    axios
      .get<User>('https://api.spotify.com/v1/me')
      .then((response: AxiosResponse<User>) => {
        setUser(response.data);
      });

    return <p>Loading</p>;
  }

  const data: AuthData = {
    user: user,
    token: token as string
  };

  return <AuthContext.Provider value={{ data, logout }} {...props} />;
};

const useAuth = (): AuthContext | null =>
  React.useContext<AuthContext | null>(AuthContext);

export { AuthProvider, useAuth };
