import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon, Button } from 'react-basics';
import { useApi } from '@/components/hooks';
import Logo from '@/assets/logo.svg';
import styles from './VerifyEmailForm.module.css';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { post } = useApi();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await post('/auth/verify-email', { token });

        if (response?.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response?.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token, post, router]);

  return (
    <div className={styles.verify}>
      <Icon className={styles.icon} size="xl">
        <Logo />
      </Icon>

      {status === 'verifying' && (
        <>
          <div className={styles.title}>Verifying Email...</div>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Please wait while we verify your email address.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className={styles.title}>✅ Email Verified!</div>
          <div className={styles.successMessage}>
            <p>{message}</p>
            <p>You will be redirected to the login page shortly.</p>
            <p>You can now sign in and start using all Oravo features!</p>
          </div>
          <Link href="/login">
            <Button className={styles.button} variant="primary">
              Go to Login
            </Button>
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className={styles.title}>❌ Verification Failed</div>
          <div className={styles.errorMessage}>
            <p>{message}</p>
            <p>The verification link may have expired or is invalid.</p>
          </div>
          <div className={styles.actions}>
            <Link href="/signup">
              <Button className={styles.button} variant="primary">
                Sign Up Again
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="quiet">Back to Login</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className={styles.verify}>
          <Icon className={styles.icon} size="xl">
            <Logo />
          </Icon>
          <div className={styles.title}>Loading...</div>
          <div className={styles.spinner}></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

export default VerifyEmailForm;
