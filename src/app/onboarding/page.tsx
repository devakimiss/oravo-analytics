import { Metadata } from 'next';
import OnboardingPage from './OnboardingPage';

export default async function () {
  return <OnboardingPage />;
}

export const metadata: Metadata = {
  title: 'Welcome to Oravo',
};
