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
  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: any) => post('/users', data),
  });

  const handleSubmit = async (data: any) => {
    const { username, password } = data;
    
    // Create the user with default role
    mutate(
      { username, password, role: 'user' },
      {
        onSuccess: async () => {
          // After successful signup, login automatically
          const loginResponse = await post('/auth/login', { username, password });
          if (loginResponse?.token) {
            setClientAuthToken(loginResponse.token);
            setUser(loginResponse.user);
            router.push('/dashboard');
          }
        },
      }
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
          <FormInput
            name="username"
            rules={{ required: formatMessage(labels.required) }}
          >
            <TextField autoComplete="off" />
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
