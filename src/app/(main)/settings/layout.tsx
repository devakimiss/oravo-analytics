import SettingsLayout from './SettingsLayout';
import { Metadata } from 'next';

export default function ({ children }) {
  return <SettingsLayout>{children}</SettingsLayout>;
}

export const metadata: Metadata = {
  title: {
    template: '%s | Settings | Oravo',
    default: 'Settings | Oravo',
  },
};
