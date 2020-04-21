import React from 'react';
import { useAuth } from './AuthContext';

const UserContext = React.createContext({});

const UserProvider = (props: any) => {
  const auth = useAuth();

  if (!auth) {
    throw new Error('Auth must be defined in UserProvider');
  }

  return <UserContext.Provider value={auth.data.user} {...props} />;
};

const useUser = (): any => React.useContext(UserContext);

export { UserProvider, useUser };
