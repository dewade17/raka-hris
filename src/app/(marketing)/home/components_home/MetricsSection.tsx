type MarketingMetric = {
  value: string;
  label: string;
};

const marketingMetrics: MarketingMetric[] = [
  {
    value: '4x',
    label: 'faster HR administration',
  },
  {
    value: '98%',
    label: 'attendance visibility',
  },
  {
    value: '24/7',
    label: 'employee access',
  },
  {
    value: '1',
    label: 'source of truth',
  },
];

export function MetricsSection() {
  return (
    <section
      aria-label='RAKA HRIS metrics'
      className='relative z-10 -mt-16 px-5 sm:px-6 lg:px-8'
    >
      <div className='mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-raka-blue/10 backdrop-blur md:grid-cols-4'>
        {marketingMetrics.map((metric) => (
          <div
            key={metric.label}
            className='rounded-[1.5rem] bg-[#f8fafc] p-6 text-center'
          >
            <p className='text-4xl font-semibold tracking-[-0.04em] text-raka-primary'>{metric.value}</p>
            <p className='mt-2 text-sm font-medium text-slate-500'>{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
