import { redirect } from 'next/navigation';
import { getCurrentAuthContext } from '@/server/auth';
import { dashboardCompanyUrl, dashboardPlatformUrl, resolvePostAuthRedirect } from '@/features/auth/post-auth-redirect';
import { RegisterBrandPanel } from './components_register/RegisterBrandPanel';
import { RegisterFormCard } from './components_register/RegisterFormCard';

type RegisterPageProps = {
  searchParams: Promise<{
    auth?: string | string[] | undefined;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { auth } = await searchParams;
  const isGoogleWorkspaceSetup = auth === 'google-workspace-required';
  let googleWorkspaceUser:
    | {
        name: string;
        email: string | null;
      }
    | undefined;

  if (isGoogleWorkspaceSetup) {
    const context = await getCurrentAuthContext();

    if (!context) {
      redirect('/login');
    }

    const redirectUrl = resolvePostAuthRedirect({
      platformRole: context.user.platformRole,
      hasActiveCompanyMembership: Boolean(context.membership),
    });

    if (redirectUrl === dashboardPlatformUrl || redirectUrl === dashboardCompanyUrl) {
      redirect(redirectUrl);
    }

    googleWorkspaceUser = {
      name: context.user.name,
      email: context.user.email,
    };
  }

  return (
    <section className='relative isolate px-5 py-6 sm:px-6 lg:px-8 lg:py-8'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(34,87,179,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(222,142,70,0.14),transparent_24%)]' />

      <div className='mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]'>
        <RegisterBrandPanel />
        <RegisterFormCard
          mode={isGoogleWorkspaceSetup ? 'googleWorkspaceSetup' : 'standard'}
          googleWorkspaceUser={googleWorkspaceUser}
        />
      </div>
    </section>
  );
}
