import { BrandPanel } from './components_login/BrandPanel';
import { LoginFormCard } from './components_login/LoginFormCard';

export default function LoginPage() {
  return (
    <section className='relative isolate px-5 pb-8 pt-4 sm:px-6 lg:px-8'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(34,87,179,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(222,142,70,0.14),transparent_24%)]' />

      <div className='mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]'>
        <BrandPanel />
        <LoginFormCard />
      </div>
    </section>
  );
}
