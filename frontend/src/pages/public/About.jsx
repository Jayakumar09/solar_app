import { motion } from 'framer-motion';
import { Sun, Users, Target, Heart, Award, CheckCircle } from 'lucide-react';

const team = [
  { name: 'Rajesh Sharma', role: 'Founder & CEO', exp: '15+ years in Renewable Energy' },
  { name: 'Dr. Priya Mehta', role: 'Technical Director', exp: 'PhD in Electrical Engineering' },
  { name: 'Vikram Singh', role: 'Operations Head', exp: '12+ years in Solar Installation' },
  { name: 'Anita Deshmukh', role: 'Customer Success', exp: '10+ years in Service Management' },
];

const milestones = [
  { year: '2015', event: 'Company Founded' },
  { year: '2018', event: '100th Installation' },
  { year: '2020', event: 'Hybrid Solutions Launch' },
  { year: '2022', event: '500+ Customers' },
  { year: '2024', event: '10 MW Installed Capacity' },
];

export default function About() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About <span className="text-primary-600">Green Hybrid Power</span></h1>
            <p className="text-lg text-gray-600">We are Maharashtra's leading renewable energy company, dedicated to providing sustainable solar and wind solutions for homes and businesses since 2015.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">Founded in 2015 by Rajesh Sharma, Green Hybrid Power started with a vision to make renewable energy accessible to every household in India. What began as a small team of passionate engineers has grown into one of Maharashtra's most trusted names in solar solutions.</p>
              <p className="text-gray-600 mb-4">We specialize in rooftop solar systems, hybrid solar + wind solutions, battery backups, and smart monitoring systems. Our commitment to quality, transparency, and customer satisfaction has helped us serve over 350 happy customers.</p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[['350+', 'Happy Customers'], ['750+', 'KW Installed'], ['10+', 'Years Experience']].map(([val, label]) => (
                  <div key={label} className="text-center p-4 bg-primary-50 rounded-xl">
                    <div className="text-2xl font-bold text-primary-700">{val}</div>
                    <div className="text-xs text-gray-600">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div className="relative" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-6">Our Milestones</h3>
                <div className="space-y-4">
                  {milestones.map(({ year, event }) => (
                    <div key={year} className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center font-bold">{year}</div>
                      <div>{event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(({ name, role, exp }) => (
                <div key={name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{role}</p>
                  <p className="text-gray-500 text-xs">{exp}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
