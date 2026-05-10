import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Sparkles,
} from 'lucide-react';

const trustIndicators = ['Employee self-service', 'Manager approvals', 'Payroll-ready records'] as const;

export function HeroSection() {
  return (
    <section className='relative isolate min-h-[calc(100vh-76px)] overflow-hidden bg-[radial-gradient(circle_at_16%_12%,rgba(98,153,210,0.35),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(242,140,40,0.2),transparent_26%),linear-gradient(135deg,#050B27_0%,#051C50_46%,#2257B3_100%)] text-white'>
      <div className='absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl' />
      <div className='absolute -right-24 bottom-24 -z-10 h-80 w-80 rounded-full bg-raka-accent/25 blur-3xl' />
      <div className='absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#f7f8fb] to-transparent' />

      <div className='mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:pb-32 lg:pt-24'>
        <div>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur'>
            <Sparkles
              size={16}
              aria-hidden='true'
            />
            Modern HR operations platform
          </div>

          <h1 className='max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl'>Simplify HR operations from employee data to payroll readiness.</h1>

          <p className='mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg'>RAKA HRIS helps companies manage employee records, attendance, leave requests, approval workflows, and HR reports in one reliable workspace.</p>

          <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
            <a
              href='#contact'
              className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-raka-accent px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-raka-accent/25 transition hover:-translate-y-0.5 hover:bg-raka-accent-soft focus:outline-none focus:ring-2 focus:ring-raka-accent-soft focus:ring-offset-2 focus:ring-offset-raka-dark'
            >
              Request Demo
              <ArrowRight
                size={17}
                aria-hidden='true'
              />
            </a>
            <a
              href='#platform'
              className='inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-raka-dark'
            >
              Explore Platform
            </a>
          </div>

          <div className='mt-8 flex flex-wrap gap-3'>
            {trustIndicators.map((item) => (
              <span
                key={item}
                className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur'
              >
                <BadgeCheck
                  size={16}
                  className='text-raka-accent-soft'
                  aria-hidden='true'
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className='relative'>
          <div className='absolute -left-4 top-10 z-10 hidden rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl lg:block'>
            <div className='flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700'>
                <CheckCircle2
                  size={22}
                  aria-hidden='true'
                />
              </span>
              <div>
                <p className='text-sm font-semibold'>Attendance synced</p>
                <p className='text-xs text-slate-500'>Today, 08:05 AM</p>
              </div>
            </div>
          </div>

          <div className='absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl md:block'>
            <div className='flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-raka-accent/10 text-raka-accent'>
                <Clock3
                  size={22}
                  aria-hidden='true'
                />
              </span>
              <div>
                <p className='text-sm font-semibold'>12 approvals pending</p>
                <p className='text-xs text-slate-500'>Ready to review</p>
              </div>
            </div>
          </div>

          <div className='absolute -bottom-5 left-10 z-10 hidden rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl sm:block'>
            <div className='flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-raka-blue/10 text-raka-blue'>
                <CircleDollarSign
                  size={22}
                  aria-hidden='true'
                />
              </span>
              <div>
                <p className='text-sm font-semibold'>Payroll data ready</p>
                <p className='text-xs text-slate-500'>98% cleaner visibility</p>
              </div>
            </div>
          </div>

          <div className='rounded-[2.1rem] border border-white/15 bg-white/[0.12] p-3 shadow-2xl shadow-raka-dark/35 backdrop-blur'>
            <div className='overflow-hidden rounded-[1.65rem] bg-white'>
              <div className='flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3'>
                <span className='h-3 w-3 rounded-full bg-red-400' />
                <span className='h-3 w-3 rounded-full bg-amber-400' />
                <span className='h-3 w-3 rounded-full bg-green-400' />
                <span className='ml-3 h-7 flex-1 rounded-full bg-white shadow-inner' />
              </div>
              <Image
                src='/Kelola karyawan dengan RAKA HRIS.png'
                alt='RAKA HRIS employee management dashboard preview'
                width={1536}
                height={1024}
                className='h-auto w-full object-cover'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
