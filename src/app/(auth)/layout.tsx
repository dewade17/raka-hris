import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen overflow-hidden bg-[#f7f8fb] text-raka-dark'>
      <AuthHeader />
      <main>{children}</main>
      <AuthFooter />
    </div>
  );
}

function AuthHeader() {
  return (
    <header className='relative z-20 px-5 py-5 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-5'>
        <Link
          href='/home'
          aria-label='RAKA HRIS home'
          className='inline-flex items-center gap-3'
        >
          <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200'>
            <Image
              src='/RAKA HRIS solutions logo.png'
              alt='RAKA HRIS logo'
              width={36}
              height={36}
              className='h-full w-full object-contain'
              priority
            />
          </span>
          <span className='text-base font-semibold tracking-tight text-raka-dark'>RAKA HRIS</span>
        </Link>

        <Link
          href='/home'
          className='inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-raka-primary shadow-sm transition hover:-translate-y-0.5 hover:border-raka-blue-light hover:text-raka-blue focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
        >
          Back to Home
        </Link>
      </div>
    </header>
  );
}

function AuthFooter() {
  return (
    <footer className='px-5 pb-8 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row'>
        <p>&copy; 2026 RAKA HRIS. All rights reserved.</p>
        <div className='flex items-center gap-5'>
          <a
            href='/privacy-policy'
            className='transition hover:text-raka-blue focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
          >
            Privacy Policy
          </a>
          <a
            href='/terms-of-service'
            className='transition hover:text-raka-blue focus:outline-none focus:ring-2 focus:ring-raka-blue focus:ring-offset-2'
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
