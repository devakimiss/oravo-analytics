'use client';
import { OnboardingFlow } from './OnboardingFlow';
import styles from './OnboardingPage.module.css';

export function OnboardingPage() {
  return (
    <div className={styles.page}>
      <OnboardingFlow />
    </div>
  );
}

export default OnboardingPage;
