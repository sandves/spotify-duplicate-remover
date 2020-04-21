import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';
import { SpotifyProvider } from '../context/SpotifyContext';

function AppProviders({ children }: any) {
  return (
    <AuthProvider>
      <UserProvider>
        <SpotifyProvider>{children}</SpotifyProvider>
      </UserProvider>
    </AuthProvider>
  );
}
export default AppProviders;
