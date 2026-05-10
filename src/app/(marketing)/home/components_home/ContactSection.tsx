import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ContactSection() {
  return (
    <section
      id='contact'
      className='scroll-mt-24 px-5 py-24 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(135deg,#2257B3_0%,#051C50_58%,#050B27_100%)] p-8 text-white shadow-2xl shadow-raka-blue/20 sm:p-12'>
        <div className='grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-accent-soft'>Ready to modernize HR?</p>
            <h2 className='mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl'>Give your HR team one reliable place to manage employees, attendance, leave, approvals, and reports.</h2>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row'>
            <a
              href='mailto:hello@rakahris.com'
              className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-raka-accent px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-raka-accent/20 transition hover:-translate-y-0.5 hover:bg-raka-accent-soft focus:outline-none focus:ring-2 focus:ring-raka-accent-soft focus:ring-offset-2 focus:ring-offset-raka-primary'
            >
              Request Demo
              <ArrowRight
                size={17}
                aria-hidden='true'
              />
            </a>
            <Link
              href='/login'
              className='inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-raka-primary'
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
