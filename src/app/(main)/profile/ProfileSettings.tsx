import { Form, FormRow } from 'react-basics';
import TimezoneSetting from '@/app/(main)/profile/TimezoneSetting';
import DateRangeSetting from '@/app/(main)/profile/DateRangeSetting';
import LanguageSetting from '@/app/(main)/profile/LanguageSetting';
import ThemeSetting from '@/app/(main)/profile/ThemeSetting';
import PasswordChangeButton from './PasswordChangeButton';
import { useLogin, useMessages } from '@/components/hooks';
import { ROLES } from '@/lib/constants';
import styles from './ProfileSettings.module.css';

export function ProfileSettings() {
  const { user } = useLogin();
  const { formatMessage, labels } = useMessages();

  if (!user) {
    return null;
  }

  const { username, role, id, createdAt } = user;

  const getInitials = (username: string) => {
    return username?.substring(0, 2).toUpperCase() || 'OR';
  };

  const renderRole = (value: string) => {
    if (value === ROLES.user) {
      return formatMessage(labels.user);
    }
    if (value === ROLES.admin) {
      return formatMessage(labels.admin);
    }
    if (value === ROLES.viewOnly) {
      return formatMessage(labels.viewOnly);
    }

    return formatMessage(labels.unknown);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.profile}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatar}>{getInitials(username)}</div>
          <div className={styles.headerInfo}>
            <div className={styles.username}>{username}</div>
            <span className={styles.role}>{renderRole(role)}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Account Information */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👤</span>
              {formatMessage(labels.profile) || 'Account Information'}
            </div>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{formatMessage(labels.username)}</div>
              <div className={styles.infoValue}>{username}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{formatMessage(labels.role)}</div>
              <div className={styles.infoValue}>{renderRole(role)}</div>
            </div>
            {id && (
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>User ID</div>
                <div className={styles.infoValue}>{id.substring(0, 8)}...</div>
              </div>
            )}
            {createdAt && (
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Account Created</div>
                <div className={styles.infoValue}>{formatDate(createdAt)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚙️</span>
              {formatMessage(labels.settings) || 'Preferences'}
            </div>
          </div>
          <Form>
            <FormRow label={formatMessage(labels.defaultDateRange)}>
              <DateRangeSetting />
            </FormRow>
            <FormRow label={formatMessage(labels.language)}>
              <LanguageSetting />
            </FormRow>
            <FormRow label={formatMessage(labels.timezone)}>
              <TimezoneSetting />
            </FormRow>
            <FormRow label={formatMessage(labels.theme)}>
              <ThemeSetting />
            </FormRow>
          </Form>
        </div>

        {/* Security Settings */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔒</span>
              {formatMessage(labels.security) || 'Security'}
            </div>
          </div>
          <Form>
            <FormRow label={formatMessage(labels.password)}>
              <PasswordChangeButton />
            </FormRow>
          </Form>
        </div>

        {/* Admin Stats */}
        {role === ROLES.admin && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📊</span>
                Account Overview
              </div>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>∞</div>
                <div className={styles.statLabel}>Websites</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>∞</div>
                <div className={styles.statLabel}>Teams</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>Full</div>
                <div className={styles.statLabel}>Access</div>
              </div>
            </div>
            <div className={styles.badge}>⭐ Administrator Privileges</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;
