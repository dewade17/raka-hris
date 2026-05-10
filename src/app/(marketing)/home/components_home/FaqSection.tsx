import { ChevronDown } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'What is RAKA HRIS?',
    answer: 'RAKA HRIS is a modern HR platform for managing employee data, attendance, leave, approvals, payroll preparation, and HR reporting in one workspace.',
  },
  {
    question: 'Who can use RAKA HRIS?',
    answer: 'RAKA HRIS is designed for HR teams, managers, employees, finance teams, and company leaders who need cleaner visibility into people operations.',
  },
  {
    question: 'Can employees submit requests through the system?',
    answer: 'Yes. Employees can use the platform to submit HR requests, view status updates, and access relevant personal information through a self-service experience.',
  },
  {
    question: 'Does RAKA HRIS support attendance and leave approval?',
    answer: 'Yes. The platform is designed to support attendance visibility, leave requests, manager reviews, corrections, and approval status tracking.',
  },
  {
    question: 'Is RAKA HRIS suitable for growing companies?',
    answer: 'Yes. RAKA HRIS helps growing organizations replace scattered spreadsheets with structured employee records, workflows, and reports.',
  },
];

export function FaqSection() {
  return (
    <section
      id='faq'
      className='scroll-mt-24 px-5 pb-24 sm:px-6 lg:px-8'
    >
      <div className='mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-blue'>FAQ</p>
          <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>Questions before your team gets started?</h2>
          <p className='mt-5 text-base leading-8 text-slate-600'>Here are quick answers about how RAKA HRIS supports daily HR operations.</p>
        </div>

        <div className='grid gap-4'>
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className='group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm'
              open={index === 0}
            >
              <summary className='flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-semibold text-raka-dark [&::-webkit-details-marker]:hidden'>
                {item.question}
                <ChevronDown
                  size={20}
                  className='shrink-0 transition group-open:rotate-180'
                  aria-hidden='true'
                />
              </summary>
              <p className='mt-4 text-sm leading-7 text-slate-600'>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
