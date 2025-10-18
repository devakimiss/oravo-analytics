import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Button, Form, FormRow, FormInput, TextField } from 'react-basics';
import { useApi, useLogin } from '@/components/hooks';
import Logo from '@/assets/logo.svg';
import styles from './OnboardingFlow.module.css';

export function OnboardingFlow() {
  const router = useRouter();
  const { user } = useLogin();
  const { post } = useApi();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: '',
    companyName: '',
    websiteName: '',
    websiteDomain: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    try {
      // Update user profile
      if (formData.displayName) {
        await post(`/users/${user?.id}`, {
          displayName: formData.displayName,
        });
      }

      // Create first website if provided
      if (formData.websiteName && formData.websiteDomain) {
        await post('/websites', {
          name: formData.websiteName,
          domain: formData.websiteDomain,
        });
      }

      // Mark onboarding as completed
      await post(`/users/${user?.id}`, {
        onboardingCompleted: true,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.onboarding}>
      <Icon className={styles.icon} size="xl">
        <Logo />
      </Icon>
      <div className={styles.title}>Welcome to Oravo! 🎉</div>
      
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>Step {step} of 3</div>
      </div>

      {step === 1 && (
        <div className={styles.step}>
          <h2>Tell us about yourself</h2>
          <p className={styles.subtitle}>This helps us personalize your experience</p>
          <Form className={styles.form}>
            <FormRow label="Display Name">
              <FormInput name="displayName">
                <TextField
                  value={formData.displayName}
                  onChange={(e: any) => handleInputChange('displayName', e.target.value)}
                  placeholder="John Doe"
                />
              </FormInput>
            </FormRow>
            <FormRow label="Company Name (optional)">
              <FormInput name="companyName">
                <TextField
                  value={formData.companyName}
                  onChange={(e: any) => handleInputChange('companyName', e.target.value)}
                  placeholder="Acme Inc."
                />
              </FormInput>
            </FormRow>
          </Form>
          <div className={styles.actions}>
            <Button className={styles.button} variant="primary" onClick={handleNext}>
              Continue
            </Button>
            <Button variant="quiet" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.step}>
          <h2>Add your first website</h2>
          <p className={styles.subtitle}>Start tracking your website analytics</p>
          <Form className={styles.form}>
            <FormRow label="Website Name">
              <FormInput name="websiteName">
                <TextField
                  value={formData.websiteName}
                  onChange={(e: any) => handleInputChange('websiteName', e.target.value)}
                  placeholder="My Awesome Website"
                />
              </FormInput>
            </FormRow>
            <FormRow label="Website Domain">
              <FormInput name="websiteDomain">
                <TextField
                  value={formData.websiteDomain}
                  onChange={(e: any) => handleInputChange('websiteDomain', e.target.value)}
                  placeholder="example.com"
                />
              </FormInput>
            </FormRow>
          </Form>
          <div className={styles.actions}>
            <Button variant="quiet" onClick={handleBack}>
              Back
            </Button>
            <Button className={styles.button} variant="primary" onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.step}>
          <h2>You're all set! 🚀</h2>
          <p className={styles.subtitle}>Here's what you can do with Oravo:</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Real-time Analytics</h3>
              <p>Monitor your website traffic in real-time</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Privacy-focused</h3>
              <p>GDPR compliant with no cookies required</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Custom Reports</h3>
              <p>Create detailed reports and insights</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Team Collaboration</h3>
              <p>Work together with your team</p>
            </div>
          </div>
          <div className={styles.actions}>
            <Button variant="quiet" onClick={handleBack}>
              Back
            </Button>
            <Button className={styles.button} variant="primary" onClick={handleComplete}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnboardingFlow;
