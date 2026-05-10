import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Users,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

type BrandFloatingCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type TrustIndicator = {
  label: string;
  icon: LucideIcon;
};

const brandFloatingCards: BrandFloatingCard[] = [
  {
    title: 'Attendance synced',
    description: 'Today, 08:05 AM',
    icon: CheckCircle2,
  },
  {
    title: 'Leave request approved',
    description: 'Manager reviewed',
    icon: CalendarCheck,
  },
  {
    title: 'Payroll data ready',
    description: 'Clean records prepared',
    icon: WalletCards,
  },
  {
    title: 'Secure HR access',
    description: 'Role-based permissions',
    icon: ShieldCheck,
  },
];

const trustIndicators: TrustIndicator[] = [
  {
    label: 'Role-based access',
    icon: ShieldCheck,
  },
  {
    label: 'Employee self-service',
    icon: Users,
  },
  {
    label: 'HR reporting',
    icon: BarChart3,
  },
];

export function BrandPanel() {
  return (
    <section
      aria-labelledby='brand-panel-title'
      className='order-2 overflow-hidden rounded-[2.25rem] bg-[radial-gradient(circle_at_18%_16%,rgba(98,153,210,0.38),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(222,142,70,0.2),transparent_26%),linear-gradient(135deg,#050B27_0%,#051C50_48%,#2257B3_100%)] p-5 text-white shadow-2xl shadow-raka-dark/20 sm:p-7 lg:order-1 lg:min-h-[calc(100vh-12rem)] lg:p-8'
    >
      <div className='relative flex h-full min-h-[32rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl sm:p-8'>
        <div className='absolute -right-24 top-16 h-72 w-72 rounded-full bg-raka-accent/20 blur-3xl' />
        <div className='absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-raka-blue-soft/20 blur-3xl' />

        <div className='relative z-10'>
          <Link
            href='/home'
            aria-label='RAKA HRIS home'
            className='inline-flex items-center gap-3'
          >
            <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg shadow-raka-dark/10'>
              <Image
                src='/RAKA HRIS solutions logo.png'
                alt='RAKA HRIS logo'
                width={38}
                height={38}
                className='h-full w-full object-contain'
                priority
              />
            </span>
            <span className='text-lg font-semibold tracking-tight'>RAKA HRIS</span>
          </Link>

          <div className='mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur'>
            <ShieldCheck
              size={16}
              aria-hidden='true'
            />
            Secure login
          </div>

          <h1
            id='brand-panel-title'
            className='mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl'
          >
            Welcome back to RAKA HRIS.
          </h1>

          <p className='mt-5 max-w-xl text-base leading-8 text-white/70'>Access your HR workspace to manage employees, attendance, approvals, payroll preparation, and reports.</p>

          <div className='mt-7 flex flex-wrap gap-3'>
            {trustIndicators.map((indicator) => {
              const IndicatorIcon = indicator.icon;

              return (
                <span
                  key={indicator.label}
                  className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur'
                >
                  <IndicatorIcon
                    size={16}
                    className='text-raka-accent-soft'
                    aria-hidden='true'
                  />
                  {indicator.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className='relative z-10 mt-10 hidden md:block'>
          <div className='absolute -left-2 top-8 z-10 rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl'>
            <BrandFloatingCardContent card={brandFloatingCards[0]} />
          </div>

          <div className='absolute -right-1 top-28 z-10 rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl'>
            <BrandFloatingCardContent card={brandFloatingCards[1]} />
          </div>

          <div className='absolute bottom-8 left-12 z-10 rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl'>
            <BrandFloatingCardContent card={brandFloatingCards[2]} />
          </div>

          <div className='absolute bottom-28 right-10 z-10 rounded-3xl border border-white/20 bg-white/90 p-4 text-raka-dark shadow-2xl shadow-raka-dark/25 backdrop-blur-xl'>
            <BrandFloatingCardContent card={brandFloatingCards[3]} />
          </div>

          <div className='rounded-[2rem] border border-white/15 bg-white/[0.12] p-3 shadow-2xl shadow-raka-dark/30 backdrop-blur'>
            <div className='overflow-hidden rounded-[1.5rem] bg-white'>
              <div className='flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3'>
                <span className='h-3 w-3 rounded-full bg-red-400' />
                <span className='h-3 w-3 rounded-full bg-amber-400' />
                <span className='h-3 w-3 rounded-full bg-green-400' />
                <span className='ml-3 h-7 flex-1 rounded-full bg-white shadow-inner' />
              </div>
              <Image
                src='/Kelola karyawan dengan RAKA HRIS.png'
                alt='RAKA HRIS dashboard preview'
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

function BrandFloatingCardContent({ card }: { card: BrandFloatingCard }) {
  const FloatingCardIcon = card.icon;

  return (
    <div className='flex items-center gap-3'>
      <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-raka-blue/10 text-raka-blue'>
        <FloatingCardIcon
          size={22}
          aria-hidden='true'
        />
      </span>
      <div>
        <p className='whitespace-nowrap text-sm font-semibold text-raka-dark'>{card.title}</p>
        <p className='mt-0.5 whitespace-nowrap text-xs text-slate-500'>{card.description}</p>
      </div>
    </div>
  );
}
