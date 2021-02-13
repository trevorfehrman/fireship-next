import * as React from 'react';
import '../styles/globals.css';

import { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  const { user, username } = useUserData();
  return (
    <>
      <UserContext.Provider value={{ user, username }}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
