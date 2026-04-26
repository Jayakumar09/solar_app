import { Link } from 'react-router-dom';
import { Sun, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, Zap, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { officeContact } from '../../config/siteContent';

export default function PublicFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-primary-900/50 to-gray-900 text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[150px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link to="/" className="flex items-center space-x-3 mb-5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <div className="flex items-center gap-0.5">
                  <Sun className="w-5 h-5 text-white" />
                  <Wind className="w-4 h-4 text-white/90" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl text-white group-hover:text-amber-300 transition-colors">Green Hybrid</span>
                <span className="block text-xs text-amber-300/80">Power Solutions</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">India&apos;s Smart Solar + Financing Platform. Zero upfront cost solar installation with SISFS financing.</p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <motion.a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center hover:bg-primary-600 transition-all hover:-translate-y-1" whileHover={{ scale: 1.1 }}>
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
            <h3 className="text-white font-bold mb-5 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/about', 'About Us'], ['/services', 'Services'], ['/vision', 'Vision & Mission'], ['/why-choose-us', 'Why Choose Us'], ['/contact', 'Contact'], ['/disclaimer', 'Disclaimer']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-amber-400 transition-colors flex items-center gap-2"><Zap className="w-3 h-3 text-primary-500" /> {label}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            <h3 className="text-white font-bold mb-5 text-lg">Our Solutions</h3>
            <ul className="space-y-3 text-sm">
              {['Basic Solar', 'Hybrid Solar + Wind', 'Battery Backup', 'Smart Monitoring', 'AMC Services'].map((label) => (
                <li key={label} className="flex items-center gap-2"><Zap className="w-3 h-3 text-amber-400" /> {label}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
            <h3 className="text-white font-bold mb-5 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">{officeContact.fullAddress}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={officeContact.phoneHref} className="text-gray-400 hover:text-amber-400 transition-colors">{officeContact.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">{officeContact.email}</span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/20">
              <p className="text-sm text-white font-medium">📞 Book Free Inspection</p>
              <Link to="/book-inspection" className="text-amber-300 text-sm hover:text-amber-200 transition-colors">Get Started →</Link>
            </div>
          </motion.div>
        </div>

        <motion.div className="border-t border-gray-800/50 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p>© 2024 Green Hybrid Power Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
