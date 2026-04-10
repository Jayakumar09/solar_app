import { motion } from 'framer-motion';
import { Shield, Award, Clock, Users, CheckCircle, Star, ThumbsUp, Zap, Phone } from 'lucide-react';
import { officeContact } from '../../config/siteContent';

const reasons = [
  { icon: Award, title: 'Certified Experts', desc: 'Our team consists of NABCEP-certified engineers with extensive experience in solar and wind installations.' },
  { icon: Shield, title: 'Quality Assurance', desc: 'We use only TÜV-certified panels and inverters from tier-1 manufacturers with up to 25-year warranties.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'We respect your time. Our projects are completed on schedule with transparent progress updates.' },
  { icon: Users, title: 'Happy Customers', desc: '350+ satisfied customers with 98% satisfaction rate. See what our customers say about us.' },
  { icon: Zap, title: 'Best-in-Class Technology', desc: 'Latest bifacial panels, hybrid inverters, and smart monitoring systems for maximum efficiency.' },
  { icon: ThumbsUp, title: 'Transparent Pricing', desc: 'No hidden costs, clear quotations, and help with government subsidy documentation.' },
  { icon: CheckCircle, title: 'Complete AMC Support', desc: 'Regular maintenance visits, 24/7 helpline, and rapid response for any issues.' },
  { icon: Star, title: '5-Star Reviews', desc: 'Consistently rated 4.8+ stars on Google and social media platforms.' },
];

const stats = [
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '350+', label: 'Installations Completed' },
  { value: '25+', label: 'Cities Served' },
  { value: '4.8★', label: 'Google Rating' },
];

export default function WhyChooseUs() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose <span className="text-primary-600">Green Hybrid Power</span></h1>
            <p className="text-lg text-gray-600">What sets us apart from other renewable energy providers</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} className="text-center p-6 bg-white rounded-2xl shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl lg:text-4xl font-bold text-primary-700 mb-1">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 text-white text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-bold mb-4">Ready to Experience the Green Hybrid Difference?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">Get a free consultation and customized quotation from our experts. No obligations, just honest advice.</p>
            <a href={officeContact.phoneHref} className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors">
              <Phone className="w-5 h-5 mr-2" /> Call {officeContact.phone}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
