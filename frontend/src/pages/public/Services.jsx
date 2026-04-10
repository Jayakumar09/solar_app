import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Settings, Smartphone, CheckCircle } from 'lucide-react';
import PlanImage from '../../components/common/PlanImage';
import { planPlaceholders } from '../../config/siteContent';
import api from '../../services/api';

const plans = [
  {
    type: 'basic',
    name: 'Basic Solar Kit',
    price: '₹45,000',
    desc: 'Perfect for small homes and budget-conscious customers',
    features: ['3kW Solar Panel', '1 Battery Unit', 'Basic Inverter', '2 Year Warranty', 'Free Installation', 'Basic Monitoring'],
    popular: false,
  },
  {
    type: 'hybrid',
    name: 'Hybrid Solar + Wind',
    price: '₹95,000',
    desc: 'Combined solar and wind for higher energy needs',
    features: ['5kW Solar + 1kW Wind', '3 Battery Units', 'Hybrid Inverter', 'Smart Controller', '5 Year Warranty', 'Free AMC', 'Priority Support'],
    popular: true,
  },
  {
    type: 'premium',
    name: 'Premium Complete Setup',
    price: '₹1,50,000',
    desc: 'Full system with battery backup and smart monitoring',
    features: ['10kW Solar + 2kW Wind', '6 Battery Units', 'Premium Inverter', 'Smart Monitoring App', '10 Year Warranty', 'Priority Support', 'Quarterly AMC'],
    popular: false,
  },
];

const services = [
  { icon: Sun, title: 'Rooftop Solar Systems', desc: 'Custom-designed solar panel installations for residential and commercial rooftops. Maximum savings with government subsidies.' },
  { icon: Wind, title: 'Hybrid Solar + Wind', desc: 'Combined solar panels and small wind turbines for areas with good wind resources. Year-round energy generation.' },
  { icon: Battery, title: 'Battery Backup Solutions', desc: 'High-capacity battery systems for uninterrupted power during grid outages. Lithium and tubular battery options.' },
  { icon: Settings, title: 'AMC Services', desc: 'Annual Maintenance Contracts to keep your system running at peak efficiency. Regular cleaning, inspection, and repairs.' },
  { icon: Smartphone, title: 'Smart Monitoring', desc: 'Real-time app-based monitoring of energy generation, consumption, and system health. Alerts and analytics.' },
];

export default function Services() {
  const seededPlans = plans.map((plan) => ({
    ...plan,
    id: plan.type,
    description: plan.desc,
    image_url: planPlaceholders[plan.type] || planPlaceholders.basic,
    solar_panel_image_url: planPlaceholders.panel,
    inverter_image_url: planPlaceholders.inverter,
    battery_image_url: planPlaceholders.battery,
  }));
  const [managedPlans, setManagedPlans] = useState(seededPlans);

  useEffect(() => {
    api.get('/plans')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          setManagedPlans(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our <span className="text-primary-600">Services & Plans</span></h1>
            <p className="text-lg text-gray-600">Comprehensive renewable energy solutions designed to meet every need and budget</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {managedPlans.map(({ id, type, name, price, desc, description, features, popular, image_url, solar_panel_image_url, inverter_image_url, battery_image_url }, i) => (
              <motion.div key={id || type} className={`relative overflow-hidden bg-white rounded-3xl shadow-lg ${popular ? 'ring-2 ring-primary-500 scale-105' : ''}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">Most Popular</div>}
                <PlanImage src={image_url} alt={name} planType={type} className="h-56 w-full" />
                <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-600 text-sm mb-4">{description || desc}</p>
                <div className="text-3xl font-bold text-primary-700 mb-6">{typeof price === 'number' ? `Rs ${price.toLocaleString()}` : price}</div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <PlanImage src={solar_panel_image_url} alt={`${name} panel`} type="panel" planType={type} className="h-20 rounded-2xl" />
                  <PlanImage src={inverter_image_url} alt={`${name} inverter`} type="inverter" planType={type} className="h-20 rounded-2xl" />
                  <PlanImage src={battery_image_url} alt={`${name} battery`} type="battery" planType={type} className="h-20 rounded-2xl" />
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/quote-request" className={`block w-full py-3 text-center font-medium rounded-xl transition-all ${popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}>
                  Get Quote
                </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
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
