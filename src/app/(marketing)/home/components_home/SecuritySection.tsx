import {
  BarChart3,
  FileText,
  LockKeyhole,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

type SecurityFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const securityFeatures: SecurityFeature[] = [
  {
    title: 'Role-aware workspace',
    description: 'Give each user the right workspace for their responsibility and access level.',
    icon: LockKeyhole,
  },
  {
    title: 'Organized employee documents',
    description: 'Keep contracts, request files, and employee records easier to locate.',
    icon: FileText,
  },
  {
    title: 'Approval traceability',
    description: 'Make every request easier to review with clear ownership and status.',
    icon: Network,
  },
  {
    title: 'Reliable HR reporting',
    description: 'Support better decisions with structured summaries for HR and leadership.',
    icon: BarChart3,
  },
];

export function SecuritySection() {
  return (
    <section
      id='security'
      className='scroll-mt-24 px-5 py-24 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[radial-gradient(circle_at_10%_10%,rgba(34,87,179,0.35),transparent_28%),linear-gradient(135deg,#050B27_0%,#051C50_56%,#08225f_100%)] p-6 text-white shadow-2xl shadow-raka-dark/20 sm:p-10 lg:p-12'>
        <div className='grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center'>
          <div>
            <span className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-raka-accent-soft'>
              <ShieldCheck
                size={28}
                aria-hidden='true'
              />
            </span>
            <p className='mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-raka-accent-soft'>Security & Governance</p>
            <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl'>Designed for sensitive employee data.</h2>
            <p className='mt-5 text-base leading-8 text-white/70'>RAKA HRIS supports cleaner HR governance with structured records, controlled access, and reliable operational visibility.</p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {securityFeatures.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className='rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur'
                >
                  <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-raka-accent-soft'>
                    <FeatureIcon
                      size={21}
                      aria-hidden='true'
                    />
                  </span>
                  <h3 className='mt-5 font-semibold text-white'>{feature.title}</h3>
                  <p className='mt-2 text-sm leading-7 text-white/60'>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
