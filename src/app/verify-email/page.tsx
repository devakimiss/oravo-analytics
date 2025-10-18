import { Metadata } from 'next';
import VerifyEmailPage from './VerifyEmailPage';

export default async function () {
  return <VerifyEmailPage />;
}

export const metadata: Metadata = {
  title: 'Verify Email',
};
