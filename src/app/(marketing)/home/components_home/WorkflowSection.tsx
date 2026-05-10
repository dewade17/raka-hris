type WorkflowStep = {
  title: string;
  description: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    title: 'Collect',
    description: 'Employee, attendance, leave, and payroll support data enters one workspace.',
  },
  {
    title: 'Review',
    description: 'Managers and HR teams review requests, corrections, and documents.',
  },
  {
    title: 'Approve',
    description: 'Approval status stays clear for employees and decision makers.',
  },
  {
    title: 'Report',
    description: 'HR teams generate cleaner summaries for leadership and finance.',
  },
];

export function WorkflowSection() {
  return (
    <section
      id='workflow'
      className='scroll-mt-24 px-5 py-24 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-blue'>Workflow</p>
            <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>From request to report, every step stays visible.</h2>
          </div>
          <p className='max-w-2xl text-base leading-8 text-slate-600 lg:ml-auto'>Make routine HR work easier to follow with a connected flow for requests, reviews, approvals, and reporting.</p>
        </div>

        <div className='relative mt-14 grid gap-5 lg:grid-cols-4'>
          <div className='absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-raka-blue-light to-transparent lg:block' />
          {workflowSteps.map((step, index) => (
            <article
              key={step.title}
              className='relative rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm'
            >
              <span className='flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-raka-primary text-2xl font-semibold tracking-[-0.04em] text-white shadow-xl shadow-raka-primary/20'>{String(index + 1).padStart(2, '0')}</span>
              <h3 className='mt-7 text-xl font-semibold text-raka-dark'>{step.title}</h3>
              <p className='mt-3 text-sm leading-7 text-slate-600'>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
