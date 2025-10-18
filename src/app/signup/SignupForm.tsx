import {
  Form,
  FormRow,
  FormInput,
  FormButtons,
  TextField,
  PasswordField,
  SubmitButton,
  Button,
  Icon,
} from 'react-basics';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi, useMessages } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import Logo from '@/assets/logo.svg';
import styles from './SignupForm.module.css';
import Link from 'next/link';

export function SignupForm() {
  const { formatMessage, labels, getMessage } = useMessages();
  const router = useRouter();
  const { post, useMutation } = useApi();
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: any) => post('/users', data),
  });

  const handleSubmit = async (data: any) => {
    const { username, password, email } = data;
    
    // Create the user with default role and email
    mutate(
      { username, password, email, role: 'user' },
      {
        onSuccess: async () => {
          setUserEmail(email);
          setShowEmailSent(true);
        },
      }
    );
  };

  if (showEmailSent) {
    return (
      <div className={styles.signup}>
        <Icon className={styles.icon} size="xl">
          <Logo />
        </Icon>
        <div className={styles.title}>Check Your Email! 📧</div>
        <div className={styles.emailSentMessage}>
          <p>We've sent a verification email to:</p>
          <p className={styles.email}>{userEmail}</p>
          <p>Please check your inbox and click the verification link to activate your account.</p>
          <p className={styles.hint}>
            Didn't receive the email? Check your spam folder or{' '}
            <button
              className={styles.resendLink}
              onClick={async () => {
                await post('/auth/resend-verification', { email: userEmail });
                alert('Verification email resent!');
              }}
            >
              resend verification email
            </button>
          </p>
        </div>
        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signup}>
      <Icon className={styles.icon} size="xl">
        <Logo />
      </Icon>
      <div className={styles.title}>Join Oravo</div>
      <div className={styles.subtitle}>Create your free analytics account</div>
      <Form className={styles.form} onSubmit={handleSubmit} error={getMessage(error)}>
        <FormRow label={formatMessage(labels.username)}>
          <FormInput
            name="username"
            rules={{ required: formatMessage(labels.required) }}
          >
            <TextField autoComplete="off" />
          </FormInput>
        </FormRow>
        <FormRow label={formatMessage(labels.email) || 'Email'}>
          <FormInput
            name="email"
            rules={{ 
              required: formatMessage(labels.required),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
          >
            <TextField type="email" autoComplete="email" />
          </FormInput>
        </FormRow>
        <FormRow label={formatMessage(labels.password)}>
          <FormInput
            name="password"
            rules={{ 
              required: formatMessage(labels.required),
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            }}
          >
            <PasswordField />
          </FormInput>
        </FormRow>
        <FormRow label="Confirm Password">
          <FormInput
            name="confirmPassword"
            rules={{ 
              required: formatMessage(labels.required),
              validate: (value, values) => value === values.password || 'Passwords do not match'
            }}
          >
            <PasswordField />
          </FormInput>
        </FormRow>
        <FormButtons>
          <SubmitButton
            className={styles.button}
            variant="primary"
            disabled={isPending}
          >
            {formatMessage(labels.signup) || 'Sign Up'}
          </SubmitButton>
        </FormButtons>
      </Form>
      <div className={styles.footer}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
