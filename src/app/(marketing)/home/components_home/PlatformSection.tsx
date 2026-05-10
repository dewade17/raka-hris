import {
  CalendarCheck,
  FileCheck2,
  Users,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

type PlatformFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const platformFeatures: PlatformFeature[] = [
  {
    title: 'Employee Database',
    description: 'Centralize employee profiles, contracts, positions, departments, and document history.',
    icon: Users,
  },
  {
    title: 'Attendance Management',
    description: 'Track attendance, shifts, late arrivals, corrections, and daily summaries.',
    icon: CalendarCheck,
  },
  {
    title: 'Leave & Approval Workflow',
    description: 'Manage leave requests, approvals, attendance corrections, and manager reviews.',
    icon: FileCheck2,
  },
  {
    title: 'Payroll Preparation',
    description: 'Prepare attendance, allowance, deduction, and employment data before payroll processing.',
    icon: WalletCards,
  },
];

export function PlatformSection() {
  return (
    <section
      id='platform'
      className='scroll-mt-24 px-5 py-24 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-blue'>Platform</p>
          <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>Everything HR teams need in one connected workspace.</h2>
          <p className='mt-5 text-base leading-8 text-slate-600'>RAKA HRIS brings core employee operations into a structured system so HR teams can reduce manual work and keep company data organized.</p>
        </div>

        <div
          id='features'
          className='mt-14 grid scroll-mt-24 gap-5 md:grid-cols-2 xl:grid-cols-4'
        >
          {platformFeatures.map((feature) => {
            const FeatureIcon = feature.icon;

            return (
              <article
                key={feature.title}
                className='group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-raka-blue-light hover:shadow-2xl hover:shadow-raka-blue/10'
              >
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-raka-blue/10 text-raka-blue transition group-hover:bg-raka-blue group-hover:text-white'>
                  <FeatureIcon
                    size={24}
                    aria-hidden='true'
                  />
                </span>
                <h3 className='mt-6 text-lg font-semibold text-raka-dark'>{feature.title}</h3>
                <p className='mt-3 text-sm leading-7 text-slate-600'>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
