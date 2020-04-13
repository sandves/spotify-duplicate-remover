import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';

function AppProviders({ children }: any) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
export default AppProviders;
