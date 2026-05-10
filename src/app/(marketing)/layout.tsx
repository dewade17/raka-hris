import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Menu } from 'lucide-react';

type NavigationLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: NavigationLink[];
};

const navigationLinks: NavigationLink[] = [
  { label: 'Platform', href: '/home#platform' },
  { label: 'Features', href: '/home#features' },
  { label: 'Workflow', href: '/home#workflow' },
  { label: 'Security', href: '/home#security' },
  { label: 'FAQ', href: '/home#faq' },
];

const footerColumns: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Employee Database', href: '/home#platform' },
      { label: 'Attendance', href: '/home#features' },
      { label: 'Leave Management', href: '/home#workflow' },
      { label: 'Payroll Preparation', href: '/home#features' },
      { label: 'HR Reports', href: '/home#platform' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/home#platform' },
      { label: 'Contact', href: '/home#contact' },
      { label: 'Careers', href: '/home#contact' },
      { label: 'Blog', href: '/home#features' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/home#faq' },
      { label: 'Documentation', href: '/home#faq' },
      { label: 'Privacy Policy', href: '/home#security' },
      { label: 'Terms of Service', href: '/home#security' },
    ],
  },
];

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen overflow-hidden bg-[#f7f8fb] text-raka-dark'>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}

function MarketingHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-raka-dark/35 backdrop-blur-2xl'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-8'>
        <Link
          href='/home'
          aria-label='RAKA HRIS home'
          className='inline-flex items-center gap-3'
        >
          <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg shadow-raka-dark/10'>
            <Image
              src='/RAKA HRIS solutions logo.png'
              alt='RAKA HRIS logo'
              width={36}
              height={36}
              className='h-full w-full object-contain'
              priority
            />
          </span>
          <span className='text-base font-semibold tracking-tight text-white'>RAKA HRIS</span>
        </Link>

        <nav
          aria-label='Main navigation'
          className='hidden items-center gap-7 rounded-full border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-medium text-white/75 lg:flex'
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='transition hover:text-white'
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className='hidden items-center gap-3 lg:flex'>
          <Link
            href='/login'
            className='inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70'
          >
            Sign in
          </Link>
          <a
            href='/home#contact'
            className='inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-raka-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-raka-accent/20 transition hover:-translate-y-0.5 hover:bg-raka-accent-soft focus:outline-none focus:ring-2 focus:ring-raka-accent-soft focus:ring-offset-2 focus:ring-offset-raka-dark'
          >
            Request Demo
            <ArrowRight
              size={16}
              aria-hidden='true'
            />
          </a>
        </div>

        <details className='group relative lg:hidden'>
          <summary
            aria-label='Open navigation menu'
            className='flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 [&::-webkit-details-marker]:hidden'
          >
            <Menu
              size={21}
              aria-hidden='true'
            />
          </summary>
          <div className='absolute right-0 top-14 w-72 overflow-hidden rounded-3xl border border-white/15 bg-raka-dark/95 p-3 shadow-2xl shadow-raka-dark/40 backdrop-blur-2xl'>
            <nav
              aria-label='Mobile navigation'
              className='grid gap-1 text-sm font-medium text-white/80'
            >
              {navigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className='rounded-2xl px-4 py-3 transition hover:bg-white/10 hover:text-white'
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className='mt-3 grid gap-2 border-t border-white/10 pt-3'>
              <Link
                href='/login'
                className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white'
              >
                Sign in
              </Link>
              <a
                href='/home#contact'
                className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-raka-accent px-4 py-2 text-sm font-semibold text-white'
              >
                Request Demo
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className='bg-raka-dark px-5 py-14 text-white sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-10 lg:grid-cols-[1.2fr_1.6fr_0.8fr]'>
          <div>
            <Link
              href='/home'
              aria-label='RAKA HRIS home'
              className='inline-flex items-center gap-3'
            >
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5'>
                <Image
                  src='/RAKA HRIS solutions logo.png'
                  alt='RAKA HRIS logo'
                  width={38}
                  height={38}
                  className='h-full w-full object-contain'
                />
              </span>
              <span className='text-lg font-semibold'>RAKA HRIS</span>
            </Link>
            <p className='mt-5 max-w-sm text-sm leading-7 text-white/60'>RAKA HRIS is a modern HR platform for managing employee data, attendance, leave, approvals, and HR reporting.</p>
            <p className='mt-6 text-sm text-white/40'>&copy; 2026 RAKA HRIS. All rights reserved.</p>
          </div>

          <div className='grid gap-8 sm:grid-cols-3'>
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className='font-semibold text-white'>{column.title}</h3>
                <ul className='mt-4 grid gap-3 text-sm text-white/60'>
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <a
                        href={link.href}
                        className='transition hover:text-white'
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className='font-semibold text-white'>Contact</h3>
            <div className='mt-4 grid gap-3 text-sm text-white/60'>
              <a
                href='mailto:hello@rakahris.com'
                className='inline-flex items-center gap-2 transition hover:text-white'
              >
                <Mail
                  size={16}
                  aria-hidden='true'
                />
                hello@rakahris.com
              </a>
              <span className='inline-flex items-center gap-2'>
                <MapPin
                  size={16}
                  aria-hidden='true'
                />
                Indonesia
              </span>
            </div>
            <a
              href='mailto:hello@rakahris.com'
              className='mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-raka-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-raka-accent-soft'
            >
              Request Demo
              <ArrowRight
                size={16}
                aria-hidden='true'
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
