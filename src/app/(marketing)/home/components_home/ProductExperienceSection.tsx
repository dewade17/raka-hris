import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

type ProductChecklistItem = {
  label: string;
};

const productChecklistItems: ProductChecklistItem[] = [
  { label: 'Role-based access experience' },
  { label: 'Clear approval status' },
  { label: 'Organized employee records' },
  { label: 'Faster operational reporting' },
  { label: 'Cleaner payroll preparation data' },
];

export function ProductExperienceSection() {
  return (
    <section className='bg-white px-5 py-24 sm:px-6 lg:px-8'>
      <div className='mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]'>
        <div className='rounded-[2rem] border border-slate-200 bg-[#f8fafc] p-3 shadow-2xl shadow-raka-blue/10'>
          <div className='overflow-hidden rounded-[1.5rem] bg-white'>
            <div className='flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3'>
              <div className='flex items-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-red-400' />
                <span className='h-3 w-3 rounded-full bg-amber-400' />
                <span className='h-3 w-3 rounded-full bg-green-400' />
              </div>
              <span className='rounded-full bg-raka-blue/10 px-3 py-1 text-xs font-semibold text-raka-blue'>Product preview</span>
            </div>
            <Image
              src='/Kelola karyawan dengan RAKA HRIS.png'
              alt='RAKA HRIS product dashboard preview'
              width={1536}
              height={1024}
              className='h-auto w-full object-cover'
            />
          </div>
        </div>

        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-accent'>Product experience</p>
          <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>Built for clarity across HR, managers, and employees.</h2>
          <p className='mt-5 text-base leading-8 text-slate-600'>Give every role a cleaner way to complete daily HR tasks, review requests, and access the information they need.</p>

          <div className='mt-8 grid gap-3'>
            {productChecklistItems.map((item) => (
              <div
                key={item.label}
                className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
              >
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700'>
                  <CheckCircle2
                    size={18}
                    aria-hidden='true'
                  />
                </span>
                <span className='text-sm font-semibold text-raka-dark'>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
