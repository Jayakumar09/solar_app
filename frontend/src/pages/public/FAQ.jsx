import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How long does solar panel installation take?', a: 'For residential projects, typical installation takes 2-3 days after site inspection. Commercial projects may take 1-2 weeks depending on system size.' },
  { q: 'What government subsidies are available?', a: 'The PM Surya Ghar scheme offers up to 40% subsidy for residential rooftop solar up to 3kW, and 20% for systems between 3-10kW. We help with complete documentation.' },
  { q: 'Do you provide warranty?', a: 'Yes! All our installations come with comprehensive warranties: panels (25 years), inverters (5-10 years), and workmanship (2-5 years depending on plan).' },
  { q: 'What maintenance is required?', a: 'Solar panels require minimal maintenance - occasional cleaning (once a month) and annual inspection. Our AMC plans cover all this for worry-free ownership.' },
  { q: 'Can I monitor my system remotely?', a: 'Yes! All our systems come with smart monitoring via mobile app. You can track energy generation, consumption, savings, and system health in real-time.' },
  { q: 'What happens on cloudy days?', a: 'Solar panels still generate electricity on cloudy days, typically at 10-25% of their peak capacity. Battery backup ensures uninterrupted power during low generation periods.' },
  { q: 'How much roof space do I need?', a: 'Approximately 100 sq ft per kW of solar capacity. A 3kW system needs about 300 sq ft of shadow-free roof space.' },
  { q: 'What is the payback period?', a: 'Most residential systems pay for themselves in 4-6 years through electricity savings and subsidies. With rising electricity costs, savings accelerate after payback.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently Asked <span className="text-primary-600">Questions</span></h1>
            <p className="text-lg text-gray-600">Everything you need to know about solar energy solutions</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={q} className="bg-white rounded-2xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">{q}</h3>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-primary-600 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600">{a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
