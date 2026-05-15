import Link from 'next/link';
import { Building2, CalendarCheck, CheckCircle2, ClipboardCheck, ShieldCheck, Users, WalletCards, type LucideIcon } from 'lucide-react';

type RegisterBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type RegisterPreviewMetric = {
  label: string;
  value: string;
};

const registerBenefits: RegisterBenefit[] = [
  {
    title: 'Data karyawan tertata',
    description: 'Profil, dokumen, dan struktur organisasi siap dikelola dari satu tempat.',
    icon: Users,
  },
  {
    title: 'Absensi lebih transparan',
    description: 'Pantau kehadiran, shift, dan pengajuan cuti dengan alur yang jelas.',
    icon: CalendarCheck,
  },
  {
    title: 'Persiapan payroll rapi',
    description: 'Rekap kehadiran dan komponen penggajian lebih mudah diaudit.',
    icon: WalletCards,
  },
];

const registerPreviewMetrics: RegisterPreviewMetric[] = [
  {
    label: 'Karyawan aktif',
    value: '128',
  },
  {
    label: 'Approval selesai',
    value: '94%',
  },
  {
    label: 'Data aman',
    value: '24/7',
  },
];

export function RegisterBrandPanel() {
  return (
    <section
      aria-labelledby='register-brand-title'
      className='order-2 hidden overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_18%_16%,rgba(98,153,210,0.38),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(222,142,70,0.2),transparent_26%),linear-gradient(135deg,#050B27_0%,#051C50_48%,#2257B3_100%)] p-5 text-white shadow-2xl shadow-raka-dark/20 lg:order-1 lg:block lg:self-start lg:p-6 xl:p-7'
    >
      <div className='relative flex min-h-[38rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl xl:p-7'>
        <div className='absolute -right-24 top-16 h-72 w-72 rounded-full bg-raka-accent/20 blur-3xl' />
        <div className='absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-raka-blue-soft/20 blur-3xl' />

        <div className='relative z-10'>
          <Link
            href='/home'
            aria-label='Raka HRIS home'
            className='inline-flex items-center gap-3'
          >
            <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-base font-bold tracking-tight text-raka-primary shadow-lg shadow-raka-dark/10'>RH</span>
            <span className='text-lg font-semibold tracking-tight'>Raka HRIS</span>
          </Link>

          <div className='mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur'>
            <ShieldCheck
              size={16}
              aria-hidden='true'
            />
            Platform HR terpadu
          </div>

          <h1
            id='register-brand-title'
            className='mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-5xl xl:text-6xl'
          >
            Mulai kelola SDM dengan lebih rapi.
          </h1>

          <p className='mt-5 max-w-xl text-base leading-8 text-white/70'>Kelola SDM, absensi, payroll, dan administrasi karyawan dalam satu platform yang aman untuk perusahaan Anda.</p>

          <div className='mt-7 grid gap-3'>
            {registerBenefits.map((benefit) => {
              const BenefitIcon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className='flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur'
                >
                  <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.12] text-raka-accent-soft'>
                    <BenefitIcon
                      size={21}
                      aria-hidden='true'
                    />
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-white'>{benefit.title}</p>
                    <p className='mt-1 text-sm leading-6 text-white/70'>{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='relative z-10 mt-10'>
          <div className='rounded-[2rem] border border-white/15 bg-white/[0.12] p-4 shadow-2xl shadow-raka-dark/30 backdrop-blur'>
            <div className='rounded-[1.5rem] bg-white p-5 text-raka-dark'>
              <div className='flex items-center justify-between gap-4 border-b border-slate-200 pb-4'>
                <div>
                  <p className='text-sm font-semibold text-raka-dark'>Ringkasan perusahaan</p>
                  <p className='mt-1 text-xs text-slate-500'>Preview dashboard onboarding</p>
                </div>
                <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-raka-blue/10 text-raka-blue'>
                  <Building2
                    size={22}
                    aria-hidden='true'
                  />
                </span>
              </div>

              <div className='mt-5 grid grid-cols-3 gap-3'>
                {registerPreviewMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className='rounded-2xl border border-slate-200 bg-slate-50 p-3'
                  >
                    <p className='text-lg font-semibold tracking-tight text-raka-dark'>{metric.value}</p>
                    <p className='mt-1 text-[11px] leading-4 text-slate-500'>{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className='mt-5 space-y-3'>
                <RegisterWorkflowItem
                  icon={CheckCircle2}
                  title='Profil perusahaan dibuat'
                  description='Identitas dan kontak bisnis siap dipakai.'
                />
                <RegisterWorkflowItem
                  icon={ClipboardCheck}
                  title='Setup HR berikutnya'
                  description='Tambahkan departemen, karyawan, dan aturan absensi.'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RegisterWorkflowItem({ icon: WorkflowIcon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className='flex items-center gap-3 rounded-2xl bg-slate-50 p-3'>
      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raka-blue/10 text-raka-blue'>
        <WorkflowIcon
          size={19}
          aria-hidden='true'
        />
      </span>
      <div>
        <p className='text-sm font-semibold text-raka-dark'>{title}</p>
        <p className='mt-0.5 text-xs text-slate-500'>{description}</p>
      </div>
    </div>
  );
}
