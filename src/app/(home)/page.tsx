// src/app/(home)/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/authOptions' ;
import AuthHomeView from '@/sections/AuthHomeView';
import NonAuthHomeView from '@/sections/NonAuthHomeView';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  
  return (
    <div>
      {session ? <AuthHomeView /> : <NonAuthHomeView />}
    </div>
  );
}
