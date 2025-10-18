import { Metadata } from 'next';
import TestConsole from '../TestConsole';

export default async function ({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;

  return <TestConsole websiteId={websiteId?.[0]} />;
}

export const metadata: Metadata = {
  title: 'Test Console',
};
