import { Building2, MessageSquareText, UserCheck, type LucideIcon } from 'lucide-react';

type RoleBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const roleBenefits: RoleBenefit[] = [
  {
    title: 'For HR Teams',
    description: 'Reduce manual administration, organize employee data, and improve reporting.',
    icon: Building2,
  },
  {
    title: 'For Managers',
    description: 'Review requests, monitor team attendance, and approve actions faster.',
    icon: UserCheck,
  },
  {
    title: 'For Employees',
    description: 'Access personal information, submit requests, and follow approval progress.',
    icon: MessageSquareText,
  },
];

export function RoleBenefitsSection() {
  return (
    <section className='bg-white px-5 py-24 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-accent'>Role-based benefits</p>
          <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>Designed for every role in your organization.</h2>
        </div>

        <div className='mt-14 grid gap-5 lg:grid-cols-3'>
          {roleBenefits.map((benefit) => {
            const BenefitIcon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className='relative isolate min-h-72 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-raka-blue/10 p-8 shadow-sm'
              >
                <div className='absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-raka-blue/10 blur-2xl' />
                <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-raka-blue text-white shadow-lg shadow-raka-blue/20'>
                  <BenefitIcon
                    size={26}
                    aria-hidden='true'
                  />
                </span>
                <h3 className='mt-8 text-2xl font-semibold tracking-[-0.03em] text-raka-dark'>{benefit.title}</h3>
                <p className='mt-4 text-sm leading-7 text-slate-600'>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
