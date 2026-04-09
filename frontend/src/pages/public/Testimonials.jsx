import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Colonel (Retd) Suresh Pawar', location: 'Pune', rating: 5, feedback: 'Excellent installation and service. The team was professional and completed the work on time. My electricity bills have reduced by 80%!' },
  { name: 'Dr. Anjali Mehra', location: 'Mumbai', rating: 5, feedback: 'Green Hybrid Power transformed our energy costs. The hybrid system works perfectly even during monsoons. Highly recommended!' },
  { name: 'Mahesh Thakur', location: 'Nashik', rating: 4, feedback: 'Best solar company in Maharashtra. Great after-sales service and competitive pricing. The monitoring app is very useful.' },
  { name: 'Sunita Industries', location: 'Thane', rating: 5, feedback: 'We got a 15kW commercial installation done. The team handled everything from design to installation seamlessly.' },
  { name: 'Rajesh Kumar', location: 'Aurangabad', rating: 5, feedback: 'Very satisfied with the AMC service. The annual maintenance visits keep our system running at peak efficiency.' },
  { name: 'Priya Restaurant Chain', location: 'Mumbai', rating: 5, feedback: 'Installed solar for our restaurant chain. The battery backup ensures we never face power cuts during business hours.' },
];

export default function Testimonials() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our <span className="text-primary-600">Customers Say</span></h1>
            <p className="text-lg text-gray-600">Real stories from real customers who switched to clean energy</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, rating, feedback }, i) => (
              <motion.div key={name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex mb-3">
                  {[...Array(rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-200 mb-3" />
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{feedback}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
