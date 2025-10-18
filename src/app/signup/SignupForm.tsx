import {
  Form,
  FormRow,
  FormInput,
  FormButtons,
  TextField,
  PasswordField,
  SubmitButton,
  Icon,
} from 'react-basics';
import { useRouter } from 'next/navigation';
import { useApi, useMessages } from '@/components/hooks';
import { setClientAuthToken } from '@/lib/client';
import Logo from '@/assets/logo.svg';
import styles from './SignupForm.module.css';
import Link from 'next/link';

export function SignupForm() {
  const router = useRouter();
  const { formatMessage, labels, getMessage } = useMessages();
  const { post, useMutation } = useApi();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: any) => post('/users', data),
  });

  const handleSubmit = async (data: any) => {
    const { username, password, email } = data;

    // Create the user and auto-login
    mutate(
      { username, password, email, role: 'user' },
      {
        onSuccess: async () => {
          // Account created! Now login and go to onboarding
          try {
            const loginRes = await post('/auth/login', { username, password });
            if (loginRes?.token && loginRes?.user) {
              // Set auth
              setClientAuthToken(loginRes.token);
              // Wait a moment for auth to be set
              await new Promise(resolve => setTimeout(resolve, 200));
              // Go directly to onboarding
              router.push('/onboarding');
            } else {
              // If login fails, show message and redirect to login
              alert('Account created! Please login to continue.');
              router.push('/login');
            }
          } catch (err) {
            console.error('Auto-login error:', err);
            alert('Account created! Please login to continue.');
            router.push('/login');
          }
        },
      },
    );
  };

  return (
    <div className={styles.signup}>
      <Icon className={styles.icon} size="xl">
        <Logo />
      </Icon>
      <div className={styles.title}>Join Oravo</div>
      <div className={styles.subtitle}>Create your free analytics account</div>
      <Form className={styles.form} onSubmit={handleSubmit} error={getMessage(error)}>
        <FormRow label={formatMessage(labels.username)}>
          <FormInput name="username" rules={{ required: formatMessage(labels.required) }}>
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
                message: 'Invalid email address',
              },
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
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
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
              validate: (value, values) => value === values.password || 'Passwords do not match',
            }}
          >
            <PasswordField />
          </FormInput>
        </FormRow>
        <FormButtons>
          <SubmitButton className={styles.button} variant="primary" disabled={isPending}>
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
