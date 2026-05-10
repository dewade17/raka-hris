import { Star } from 'lucide-react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote: 'RAKA HRIS helped our HR team reduce manual follow-ups and keep employee records easier to manage.',
    name: 'Nadia Putri',
    role: 'HR Manager',
  },
  {
    quote: 'The approval flow makes attendance and leave requests much easier to monitor.',
    name: 'Arief Santoso',
    role: 'Operations Lead',
  },
  {
    quote: 'We finally have a cleaner overview of employee data before payroll preparation.',
    name: 'Dewi Lestari',
    role: 'Finance & HR',
  },
];

export function TestimonialsSection() {
  return (
    <section className='bg-white px-5 py-24 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-raka-blue'>Social proof</p>
          <h2 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-raka-dark sm:text-5xl'>Trusted by growing teams that need cleaner HR operations.</h2>
        </div>

        <div className='mt-14 grid gap-5 lg:grid-cols-3'>
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className='rounded-[1.75rem] border border-slate-200 bg-[#f8fafc] p-7'
            >
              <div className='flex gap-1 text-raka-accent'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${testimonial.name}-${index}`}
                    size={18}
                    fill='currentColor'
                    aria-hidden='true'
                  />
                ))}
              </div>
              <p className='mt-6 text-base leading-8 text-raka-dark'>&ldquo;{testimonial.quote}&rdquo;</p>
              <div className='mt-7 border-t border-slate-200 pt-5'>
                <p className='font-semibold text-raka-dark'>{testimonial.name}</p>
                <p className='mt-1 text-sm text-slate-500'>{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
