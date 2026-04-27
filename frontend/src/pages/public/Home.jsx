import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Shield, Zap, Award, Users, Clock, ArrowRight, CheckCircle, ChevronDown, FileText, Calculator, Building2, Home as HomeIcon, Phone, Star, Clock3, IndianRupee, ThumbsUp, Landmark, MapPin, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, Play, Leaf, Recycle, Timer, TrendingUp, Globe, BadgeCheck, Handshake, Heart } from 'lucide-react';

const trustLogos = [
  { name: 'MNRE', label: 'MNRE Approved' },
  { name: 'ISO', label: 'ISO 9001 Certified' },
  { name: 'ISI', label: 'ISI Mark' },
  { name: 'TEDA', label: 'TEDA Partner' },
  { name: 'NABCB', label: 'NABCB Accredited' },
];

const partnerLogos = [
  { name: 'Bank1', label: 'HDFC Bank' },
  { name: 'Bank2', label: 'SBI Solar' },
  { name: 'Bank3', label: 'ICICI Bank' },
  { name: 'Bank4', label: 'Axis Bank' },
  { name: 'Bank5', label: 'PNB' },
];

const trustMetrics = [
  { value: '500+', label: 'Installations', icon: HomeIcon },
  { value: '50L+', label: 'Savings Generated', icon: IndianRupee },
  { value: '95%', label: 'Customer Satisfaction', icon: ThumbsUp },
  { value: 'Govt', label: 'Approved Vendor', icon: Landmark },
];

const features = [
  { icon: IndianRupee, title: 'Smart Financing', desc: 'Zero upfront cost with SISFS platform. Easy EMI options starting ₹2,999/month', color: 'from-amber-400 to-amber-600' },
  { icon: Wind, title: 'Hybrid Energy', desc: 'Solar + Wind combined systems for higher energy needs and reliability', color: 'from-primary-400 to-primary-600' },
  { icon: Battery, title: 'Battery Backup', desc: 'Never face power cuts. Up to 8 hours backup with premium batteries', color: 'from-blue-400 to-blue-600' },
  { icon: Zap, title: 'Real-time Monitoring', desc: 'Track energy generation, savings, and system health via mobile app', color: 'from-purple-400 to-purple-600' },
];

const steps = [
  { num: '01', title: 'Submit Request', desc: 'Fill a simple form or call us', icon: FileText },
  { num: '02', title: 'Get Instant Quote', desc: 'Free site inspection + customized quote within 24hrs', icon: Calculator },
  { num: '03', title: 'Financing Approval', desc: 'SISFS platform processes your loan quickly', icon: Building2 },
  { num: '04', title: 'Installation', desc: 'Our certified team installs within 7 days', icon: HomeIcon },
  { num: '05', title: 'Monitor & Save', desc: 'Track savings on your app, sit back & relax', icon: Clock3 },
];

const plans = [
  { name: 'Basic Solar', price: '₹1,25,000', period: 'Starting', icon: Sun, features: ['3KW Rooftop System', '5KW Inverter', '25-Year Panel Warranty', 'Free Monitoring App', 'AMC Support'] },
  { name: 'Hybrid Power', price: '₹2,15,000', period: 'Starting', icon: Wind, features: ['5KW Solar + 1KW Wind', 'Hybrid Inverter', 'Battery Ready', 'Smart Monitoring', 'Priority Support'] },
  { name: 'Premium Suite', price: '₹3,50,000', period: 'Starting', icon: Battery, features: ['7.5KW Hybrid System', '10KWH Battery Backup', 'Real-time Monitoring', 'Smart Home Integration', 'Dedicated Account Manager'] },
];

const testimonials = [
  { name: 'Rajesh Sharma', location: 'Mumbai, Maharashtra', review: 'Saved ₹12,000 on electricity bills in just 6 months. Installation was smooth and team was very professional.', rating: 5 },
  { name: 'Priya Patel', location: 'Pune, Maharashtra', review: 'The SISFS financing option made solar affordable for us. No upfront cost and now we save ₹8,000 monthly.', rating: 5 },
  { name: 'Amit Kumar', location: 'Nashik, Maharashtra', review: 'Best investment for our factory. Hybrid system works flawlessly. Technical support is excellent.', rating: 5 },
];

const faqs = [
  { q: 'What is SISFS financing?', a: 'SISFS (Solar Installation Financial Services) is a smart financing platform that allows you to install solar with zero upfront cost. You pay through easy EMIs from your electricity savings.' },
  { q: 'How much can I save with solar?', a: 'Most homeowners save ₹8,000-₹15,000 per month on electricity bills. Your exact savings depend on system size and consumption. We provide detailed ROI calculations during consultation.' },
  { q: 'What government subsidies are available?', a: 'The central government offers up to 40% subsidy on solar installations under PM Surya Ghar scheme. We handle all documentation for you.' },
  { q: 'How long does installation take?', a: 'Typical residential installation takes 2-3 days. Commercial projects vary based on scope. We complete most projects within 7 days.' },
  { q: 'What warranty do you provide?', a: 'Panels come with 25-year warranty, inverters with 10 years, and battery systems with 5-7 years. We also offer comprehensive AMC packages.' },
];

const whyChooseUs = [
  { title: 'Massive Cost Savings', desc: 'Save up to 90% on your monthly electricity bills', icon: IndianRupee },
  { title: 'Fast ROI', desc: 'Payback period of 3-5 years, then free energy for 20+ years', icon: Clock },
  { title: 'Govt Subsidy Support', desc: 'We help you get up to 40% subsidy with zero paperwork', icon: Landmark },
];

const WaveDivider = ({ className = '' }) => (
  <div className={`relative w-full overflow-hidden ${className}`}>
    <svg className="absolute w-full h-16 md:h-24" viewBox="0 0 1440 100" preserveAspectRatio="none">
      <path fill="currentColor" d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,50 1440,50 L1440,100 L0,100 Z" />
    </svg>
  </div>
);

const GradientDivider = ({ from = 'from-primary-900', to = 'to-gray-50', height = 'h-16' }) => (
  <div className={`relative w-full ${height}`}>
    <div className={`absolute inset-0 bg-gradient-to-r ${from} ${to} opacity-20`} />
  </div>
);

const LightRays = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 bg-gradient-to-b from-amber-400/30 to-transparent"
        style={{
          left: `${20 + i * 15}%`,
          top: '-20%',
          height: '60%',
          transform: `rotate(${15 + i * 5}deg)`,
          transformOrigin: 'bottom center',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleY: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-amber-300/40"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          x: [0, Math.random() * 30 - 15, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const SlowZoomBg = () => (
  <motion.div 
    className="absolute inset-0"
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
  >
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80')] bg-cover bg-center opacity-25 mix-blend-overlay" />
  </motion.div>
);

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
        <div className="absolute inset-0">
          <SlowZoomBg />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-400 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-400 rounded-full blur-[150px]" />
        </div>
        <LightRays />
        <FloatingParticles />
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 relative z-10">
          <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-5 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by 500+ Families Across India
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              Power Your Future with <span className="text-amber-300 font-medium">Clean Energy</span>
            </h1>
            
            <motion.p className="text-lg md:text-xl text-white/85 mb-6 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Get solar installed with <span className="text-amber-300 font-semibold">ZERO upfront cost</span> using smart SISFS financing
            </motion.p>

            <motion.p className="text-amber-400 font-semibold text-lg mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Save up to ₹3,000/month on electricity bills
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-3 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Link to="/book-inspection" className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" /> Get Free Inspection
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link to="/quote-request" className="px-8 py-4 bg-white/10 text-white font-medium text-lg rounded-xl hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                Get Quote
              </Link>
              <Link to="/solar-calculator" className="px-8 py-4 bg-white/5 text-white font-medium text-lg rounded-xl hover:bg-white/10 backdrop-blur-md border-2 border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" /> Calculator
              </Link>
            </motion.div>

            <motion.div className="mt-10 flex flex-wrap justify-center gap-5 text-white/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /> <span className="text-sm font-medium">40% Govt Subsidy</span></div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-amber-400" /> <span className="text-sm font-medium">25-Year Warranty</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-amber-400" /> <span className="text-sm font-medium">Free Installation</span></div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider className="text-gray-50" />
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p className="text-center text-gray-500 text-sm font-medium uppercase tracking-widest mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Certified & Trusted By
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-10">
            <motion.div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}><Award className="w-7 h-7 text-primary-600" /><span className="text-base font-semibold text-gray-700">MNRE</span></motion.div>
            <motion.div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}><Shield className="w-7 h-7 text-primary-600" /><span className="text-base font-semibold text-gray-700">ISO 9001</span></motion.div>
            <motion.div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}><BadgeCheck className="w-7 h-7 text-primary-600" /><span className="text-base font-semibold text-gray-700">ISI Mark</span></motion.div>
            <motion.div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}><Globe className="w-7 h-7 text-primary-600" /><span className="text-base font-semibold text-gray-700">TEDA</span></motion.div>
            <motion.div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" whileHover={{ scale: 1.05 }}><CheckCircle className="w-7 h-7 text-primary-600" /><span className="text-base font-semibold text-gray-700">NABCB</span></motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {trustMetrics.map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} className="group text-center p-6 lg:p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-500 border border-gray-100 hover:-translate-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-inner">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold text-primary-700 mb-2">{value}</div>
                <div className="text-base text-gray-600 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        <WaveDivider className="text-white -mb-1" />
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em]">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">Premium Features</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-xl font-light">Everything you need for a seamless transition to clean energy</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} className="group relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-gray-100 hover:-translate-y-2 overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-25 transition-all duration-500`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-amber-700 font-semibold mb-4">🚀 Ready to start your solar journey?</p>
            <Link to="/book-inspection" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Get Free Site Inspection <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-primary-50">
        <WaveDivider className="text-primary-50 -mb-1" />
      </div>

      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-amber-300 font-bold text-sm uppercase tracking-[0.2em]">Simple Process</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-4 mb-6 tracking-tight">How SISFS Works</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-xl font-light">From request to savings in 5 simple steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            {steps.map(({ num, title, desc, icon: Icon }, i) => (
              <motion.div key={title} className="relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all duration-500 h-full group">
                  <div className="text-6xl font-black text-amber-400/30 mb-4 group-hover:text-amber-400/50 transition-colors">{num}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/70 text-base leading-relaxed">{desc}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-primary-900 to-gray-50">
        <WaveDivider className="text-gray-50 -mt-1" />
      </div>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em]">Our Solutions</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">Services & Plans</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-xl font-light">Choose the perfect solar solution for your needs</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {plans.map(({ name, price, period, icon: Icon, features: planFeatures }, i) => (
              <motion.div key={name} className={`relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border-2 ${i === 1 ? 'border-primary-500 ring-4 ring-primary-500/20 scale-105' : 'border-gray-100 hover:border-primary-200 hover:-translate-y-2'} group`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                {i === 1 && <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-full shadow-lg">Most Popular</div>}
                <div className={`w-16 h-16 rounded-2xl ${i === 1 ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-primary-100 to-primary-200'} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`w-8 h-8 ${i === 1 ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">{price}</span>
                  <span className="text-gray-500 ml-3 text-lg">/{period}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {planFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book-inspection" className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${i === 1 ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:-translate-y-1' : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:-translate-y-1'}`}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-50 to-emerald-50 border-y border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {partnerLogos.map(({ name, label }) => (
                <div key={name} className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Handshake className="w-8 h-8 text-primary-600" />
                  <span className="font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-primary-700 font-semibold mb-4">💰 Easy Finance Options Available</p>
            <Link to="/book-inspection" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Calculate Your Savings <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em]">Our Promise</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 mb-8 tracking-tight">Why Choose <span className="text-primary-600">Green Hybrid Power</span>?</h2>
              <p className="text-gray-500 text-xl mb-12 leading-relaxed font-light">We don&apos;t just install solar panels. We deliver complete energy independence with guaranteed savings and premium service.</p>
              <div className="space-y-6">
                {whyChooseUs.map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="flex items-start gap-5 p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xl mb-2">{title}</h4>
                      <p className="text-gray-500 font-light">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/why-choose-us" className="inline-flex items-center mt-12 px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                Learn More <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div className="relative" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-10 lg:p-12 shadow-2xl">
                <div className="bg-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                  <div className="text-amber-300 text-7xl font-black mb-3">95%</div>
                  <div className="text-white/90 text-xl font-medium">Customer Satisfaction Rate</div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <div className="text-white text-4xl font-bold">10+</div>
                    <div className="text-white/70 text-base mt-2">Years Experience</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <div className="text-white text-4xl font-bold">500+</div>
                    <div className="text-white/70 text-base mt-2">Installations</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <div className="text-white text-4xl font-bold">50+</div>
                    <div className="text-white/70 text-base mt-2">Expert Team</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <div className="text-white text-4xl font-bold">24/7</div>
                    <div className="text-white/70 text-base mt-2">Support Available</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        <WaveDivider className="text-white -mb-1" />
      </div>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em]">Testimonials</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">What Our Customers Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-xl font-light">Real stories from satisfied customers across India</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map(({ name, location, review, rating }, i) => (
              <motion.div key={name} className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-gray-100 hover:-translate-y-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(rating)].map((_, i) => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed text-lg mb-8 font-light">"{review}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">{name.charAt(0)}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{name}</div>
                    <div className="text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-gray-50">
        <WaveDivider className="text-gray-50 -mb-1" />
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-xl font-light">Everything you need to know about going solar</p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-gray-900 text-lg pr-4">{q}</span>
                  <ChevronDown className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-8 pb-6 text-gray-500 leading-relaxed bg-gray-50 text-lg font-light">{a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to Switch to Clean Energy?</h2>
            <p className="text-white/80 text-2xl mb-12 font-light">Book a free site inspection today and get a customized quotation within 24 hours.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/book-inspection" className="group px-12 py-5 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-xl rounded-2xl hover:from-amber-300 hover:to-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center gap-3">
                Get Free Inspection <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-12 py-5 bg-white/10 text-white font-semibold text-xl rounded-2xl hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                <Phone className="w-6 h-6" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <Sun className="w-7 h-7 text-primary-900" />
                </div>
                <span className="text-2xl font-bold">Green Hybrid Power</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light">India&apos;s leading solar energy company providing premium solar solutions with smart SISFS financing. Join 500+ happy customers saving on electricity bills.</p>
              <div className="flex gap-4">
                <a href="/#social" aria-label="Facebook" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="/#social" aria-label="Twitter" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="/#social" aria-label="Instagram" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="/#social" aria-label="LinkedIn" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="/#social" aria-label="YouTube" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"><Youtube className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">About Us</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Contact</Link></li>
                <li><Link to="/book-inspection" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Book Inspection</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Services</h4>
              <ul className="space-y-4">
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Residential Solar</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Commercial Solar</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Hybrid Systems</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">Solar Financing</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-amber-400 transition-colors text-lg font-light">AMC Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Contact Info</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-400 text-lg font-light">Green Hybrid Power<br />Mumbai, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <span className="text-gray-400 text-lg font-light">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <span className="text-gray-400 text-lg font-light">info@greenhybridpower.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm font-light">© 2024 Green Hybrid Power. All rights reserved.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Terms of Service</Link>
                <a href="/sitemap.xml" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-4 lg:hidden"
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 font-light">Get Free Inspection</p>
            <p className="text-lg font-bold text-gray-900">Zero Cost Visit</p>
          </div>
          <Link to="/book-inspection" className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
            <Phone className="w-4 h-4" /> Book Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
