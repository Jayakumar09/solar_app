import { motion } from 'framer-motion';
import { Target, Eye, Heart, Globe, Lightbulb, Users } from 'lucide-react';

const values = [
  { icon: Globe, title: 'Sustainability', desc: 'Committed to reducing carbon footprint and promoting clean energy for a greener tomorrow.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Continuously improving our technology and services to deliver cutting-edge solutions.' },
  { icon: Users, title: 'Customer First', desc: 'Every decision we make is guided by what is best for our customers and their needs.' },
  { icon: Heart, title: 'Integrity', desc: 'Transparent dealings, honest pricing, and genuine service are the foundations of our business.' },
];

export default function Vision() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Vision & <span className="text-primary-600">Mission</span></h1>
            <p className="text-lg text-gray-600">Driving the renewable energy revolution with purpose and passion</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 text-white" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-white/90 text-lg leading-relaxed">To become India's most trusted renewable energy company, powering 1 million homes with clean energy by 2035 and contributing significantly to the nation's target of 500 GW non-fossil fuel capacity.</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"><div className="text-2xl font-bold">1M+</div><div className="text-sm text-white/70">Homes by 2035</div></div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"><div className="text-2xl font-bold">500GW</div><div className="text-sm text-white/70">National Target</div></div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-primary-100" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">To make renewable energy accessible, affordable, and hassle-free for every Indian household and business through quality installations, transparent pricing, and exceptional after-sales service.</p>
              <ul className="space-y-3">
                {['Provide world-class solar solutions at competitive prices', 'Ensure 100% customer satisfaction through quality service', 'Promote sustainable practices and environmental awareness', 'Enable energy independence for homes and businesses'].map(item => (
                  <li key={item} className="flex items-start text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
