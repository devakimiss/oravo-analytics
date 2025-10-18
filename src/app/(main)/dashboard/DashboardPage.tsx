'use client';
import { Icon, Icons, Loading, Text } from 'react-basics';
import PageHeader from '@/components/layout/PageHeader';
import Pager from '@/components/common/Pager';
import WebsiteChartList from '../websites/[websiteId]/WebsiteChartList';
import DashboardSettingsButton from '@/app/(main)/dashboard/DashboardSettingsButton';
import DashboardEdit from '@/app/(main)/dashboard/DashboardEdit';
import EmptyPlaceholder from '@/components/common/EmptyPlaceholder';
import { useMessages, useLocale, useTeamUrl, useWebsites, useLogin } from '@/components/hooks';
import useDashboard from '@/store/dashboard';
import LinkButton from '@/components/common/LinkButton';
import Link from 'next/link';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { formatMessage, labels, messages } = useMessages();
  const { teamId, renderTeamUrl } = useTeamUrl();
  const { showCharts, editing, isEdited } = useDashboard();
  const { dir } = useLocale();
  const { user } = useLogin();
  const pageSize = isEdited ? 200 : 10;

  const { result, query, params, setParams } = useWebsites({ teamId }, { pageSize });
  const { page } = params;
  const hasData = !!result?.data?.length;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️';
    if (hour < 18) return '👋';
    return '🌙';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (query.isLoading) {
    return <Loading />;
  }

  return (
    <section style={{ marginBottom: 60 }}>
      {/* Enhanced Welcome Section */}
      {!editing && (
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeEmoji}>{getGreetingEmoji()}</div>
            <div className={styles.welcomeInfo}>
              <h1 className={styles.welcomeTitle}>
                {getGreeting()}, {user?.username || 'there'}!
              </h1>
              <p className={styles.welcomeSubtitle}>
                Welcome to your Oravo analytics dashboard. Track your website performance in real-time.
              </p>
            </div>
            <div className={styles.welcomeTime}>
              <div className={styles.timeDisplay}>{formatTime(currentTime)}</div>
              <div className={styles.dateDisplay}>{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - shown when no websites */}
      {!hasData && !editing && (
        <div className={styles.quickActions}>
          <Link href={renderTeamUrl('/settings/websites')} className={styles.actionCard}>
            <div className={styles.actionIcon}>🌐</div>
            <div className={styles.actionTitle}>Add Website</div>
            <div className={styles.actionDescription}>Start tracking your first site</div>
          </Link>

          <Link href={renderTeamUrl('/settings/teams')} className={styles.actionCard}>
            <div className={styles.actionIcon}>👥</div>
            <div className={styles.actionTitle}>Invite Team</div>
            <div className={styles.actionDescription}>Collaborate together</div>
          </Link>

          <Link href="/profile" className={styles.actionCard}>
            <div className={styles.actionIcon}>⚙️</div>
            <div className={styles.actionTitle}>Settings</div>
            <div className={styles.actionDescription}>Customize your account</div>
          </Link>
        </div>
      )}

      <PageHeader title={formatMessage(labels.dashboard)}>
        {!editing && hasData && <DashboardSettingsButton />}
      </PageHeader>
      {!hasData && (
        <EmptyPlaceholder message={formatMessage(messages.noWebsitesConfigured)}>
          <LinkButton href={renderTeamUrl('/settings')}>
            <Icon rotate={dir === 'rtl' ? 180 : 0}>
              <Icons.ArrowRight />
            </Icon>
            <Text>{formatMessage(messages.goToSettings)}</Text>
          </LinkButton>
        </EmptyPlaceholder>
      )}
      {hasData && (
        <>
          {editing && <DashboardEdit teamId={teamId} />}
          {!editing && (
            <>
              <WebsiteChartList
                websites={result?.data as any}
                showCharts={showCharts}
                limit={pageSize}
              />
              <Pager
                page={page}
                pageSize={pageSize}
                count={result?.count}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}

export default DashboardPage;
