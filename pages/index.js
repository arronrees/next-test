import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import { useEffect } from 'react';

import { useSession, signIn, signOut } from 'next-auth/client';

export default function Home() {
  const [session] = useSession();

  console.log('Session ---- ', session);

  return (
    <div>
      <button onClick={signIn}>Sign in</button>
      <br />
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
