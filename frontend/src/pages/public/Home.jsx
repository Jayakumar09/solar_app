import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Shield, Zap, Award, Users, Clock, ArrowRight, CheckCircle, ChevronDown, FileText, Calculator, Building2, Home as HomeIcon, Phone, Star, Clock3, IndianRupee, ThumbsUp, Government, MapPin } from 'lucide-react';

const trustMetrics = [
  { value: '500+', label: 'Installations', icon: HomeIcon },
  { value: '50L+', label: 'Savings Generated', icon: IndianRupee },
  { value: '95%', label: 'Customer Satisfaction', icon: ThumbsUp },
  { value: 'Govt', label: 'Approved Vendor', icon: Government },
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
  { title: 'Govt Subsidy Support', desc: 'We help you get up to 40% subsidy with zero paperwork', icon: Government },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-400 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-400 rounded-full blur-[150px]" />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
          <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium mb-8 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India&apos;s Smart Solar + Financing Platform
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              Power Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Clean Energy</span>
            </h1>
            
            <motion.p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Get solar installed with <span className="text-amber-300 font-semibold">ZERO upfront cost</span> using smart financing (SISFS platform)
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Link to="/book-inspection" className="group px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:from-amber-300 hover:to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Get Free Inspection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/quote-request" className="px-10 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center">
                Get Quote
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {trustMetrics.map(({ value, label, icon: Icon, suffix }, i) => (
              <motion.div key={label} className="group text-center p-6 lg:p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold text-primary-700 mb-1">{suffix}{value}</div>
                <div className="text-sm text-gray-600 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Premium Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Everything you need for a seamless transition to clean energy</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} className="group relative bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-amber-300 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mt-3 mb-4">How SISFS Works</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">From request to savings in 5 simple steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map(({ num, title, desc, icon: Icon }, i) => (
              <motion.div key={title} className="relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                  <div className="text-5xl font-black text-amber-400/30 mb-3">{num}</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6 text-primary-900" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/70 text-sm">{desc}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Solutions</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Services & Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Choose the perfect solar solution for your needs</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(({ name, price, period, icon: Icon, features: planFeatures }, i) => (
              <motion.div key={name} className={`relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border-2 ${i === 1 ? 'border-primary-500 ring-4 ring-primary-500/20 scale-105' : 'border-gray-100 hover:border-primary-200'} group`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                {i === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-full">Most Popular</div>}
                <div className={`w-14 h-14 rounded-2xl ${i === 1 ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-primary-100 to-primary-200'} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${i === 1 ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{price}</span>
                  <span className="text-gray-500 ml-2">/{period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {planFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/book-inspection" className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all duration-300 ${i === 1 ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'}`}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Promise</span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-6">Why Choose <span className="text-primary-600">Green Hybrid Power</span>?</h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">We don&apos;t just install solar panels. We deliver complete energy independence with guaranteed savings.</p>
              <div className="space-y-6">
                {whyChooseUs.map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="flex items-start gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{title}</h4>
                      <p className="text-gray-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/why-choose-us" className="inline-flex items-center mt-10 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Learn More <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div className="relative" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-10 shadow-2xl">
                <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                  <div className="text-amber-300 text-6xl font-black mb-2">95%</div>
                  <div className="text-white/90 text-lg font-medium">Customer Satisfaction Rate</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm"><div className="text-white text-3xl font-bold">10+</div><div className="text-white/70 text-sm mt-1">Years Experience</div></div>
                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm"><div className="text-white text-3xl font-bold">500+</div><div className="text-white/70 text-sm mt-1">Installations</div></div>
                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm"><div className="text-white text-3xl font-bold">50+</div><div className="text-white/70 text-sm mt-1">Expert Team</div></div>
                  <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm"><div className="text-white text-3xl font-bold">24/7</div><div className="text-white/70 text-sm mt-1">Support Available</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">What Our Customers Say</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, location, review, rating }, i) => (
              <motion.div key={name} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{review}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">{name.charAt(0)}</div>
                  <div>
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} className="border border-gray-200 rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{q}</span>
                  <ChevronDown className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed bg-gray-50">{a}</div>
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
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">Ready to Switch to Clean Energy?</h2>
            <p className="text-white/80 text-xl mb-10">Book a free site inspection today and get a customized quotation within 24 hours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-inspection" className="group px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:from-amber-300 hover:to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Get Free Inspection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-10 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
