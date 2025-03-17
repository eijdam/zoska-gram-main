import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pridanie prispevku | RobertWeb'
};

export default function AddPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 