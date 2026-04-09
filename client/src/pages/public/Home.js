import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Zap, Shield, Award, Users, Clock, CheckCircle, ArrowRight, Phone, MapPin, Star, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({
    installations: 500,
    capacity: '10+ MW',
    customers: 450,
    satisfaction: '98%'
  });

  useEffect(() => {
    api.get('/plans').then(res => setPlans(res.data.slice(0, 3))).catch(() => {});
  }, []);

  const features = [
    { icon: Sun, title: 'Rooftop Solar', desc: 'Efficient solar panel systems for homes and businesses' },
    { icon: Wind, title: 'Wind Turbines', desc: 'Compact wind turbines for hybrid energy solutions' },
    { icon: Battery, title: 'Battery Storage', desc: 'Advanced battery systems for backup power' },
    { icon: Zap, title: 'Smart Monitoring', desc: 'Real-time energy monitoring via mobile app' }
  ];

  const whyUsPoints = [
    { icon: Shield, title: '5+ Years Experience', desc: 'Proven track record in solar installations' },
    { icon: Award, title: 'Premium Quality', desc: 'Tier-1 panels with 25-year warranty' },
    { icon: Users, title: 'Expert Team', desc: 'Certified engineers and technicians' },
    { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer assistance' }
  ];

  return (
    <div>
      <section style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite 1s'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '9999px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#22c55e'
            }}>
              <Zap size={16} />
              Trusted by 500+ Happy Customers
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem'
            }}>
              Power Your Future with
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Clean Energy
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#94a3b8',
              marginBottom: '2rem',
              lineHeight: 1.7
            }}>
              Transform your home or business with rooftop solar systems, hybrid solar + wind solutions, and smart battery backup. Start your journey to energy independence today.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/quote" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Get Free Quote <ArrowRight size={20} />
              </Link>
              <Link to="/book-inspection" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Book Free Inspection
              </Link>
            </div>

            <div style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '3rem',
              flexWrap: 'wrap'
            }}>
              {[['Free Site Survey', 'No Hidden Costs', 'EMI Available']].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} color="#22c55e" />
                  <span style={{ color: '#94a3b8' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <div className="grid grid-4">
            {[
              { value: '500+', label: 'Installations' },
              { value: '10+ MW', label: 'Total Capacity' },
              { value: '450+', label: 'Happy Customers' },
              { value: '98%', label: 'Satisfaction' }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.5rem' }}>{stat.value}</h3>
                <p style={{ color: '#94a3b8' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Our Services</h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Comprehensive renewable energy solutions tailored for your needs
            </p>
          </div>

          <div className="grid grid-4">
            {features.map((feature, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#22c55e'
                }}>
                  <feature.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Our Plans</h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Choose the perfect solar solution for your energy needs
            </p>
          </div>

          <div className="grid grid-3">
            {[
              { name: 'Basic Solar', type: 'basic', price: '₹1,50,000', features: ['3-5 kW System', 'Polycrystalline Panels', '5 Year Warranty', 'Basic Monitoring'] },
              { name: 'Hybrid Solar + Wind', type: 'hybrid', price: '₹3,50,000', features: ['5kW Solar + 1kW Wind', 'Monocrystalline Panels', '10 Year Warranty', 'Battery Backup'] },
              { name: 'Premium Complete', type: 'premium', price: '₹7,50,000', features: ['10kW+ System', 'Premium Tier-1 Panels', '15 Year Warranty', 'Smart Home Integration'] }
            ].map((plan, i) => (
              <div key={i} className="card" style={{
                border: plan.type === 'hybrid' ? '2px solid #22c55e' : '1px solid #374151',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {plan.type === 'hybrid' && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '-35px',
                    background: '#22c55e',
                    padding: '0.25rem 3rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transform: 'rotate(45deg)'
                  }}>
                    POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>{plan.price}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Starting price</p>
                <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <CheckCircle size={16} color="#22c55e" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/quote"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Why Choose Us</h2>
          </div>

          <div className="grid grid-4">
            {whyUsPoints.map((point, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#22c55e'
                }}>
                  <point.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{point.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(10, 22, 40, 1) 100%)',
        borderTop: '1px solid rgba(34, 197, 94, 0.2)',
        borderBottom: '1px solid rgba(34, 197, 94, 0.2)'
      }}>
        <div className="container">
          <div style={{
            background: '#111827',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 4rem)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Ready to Go Solar?
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Get a free consultation and personalized quote for your home or business. Our experts will guide you through every step.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book-inspection" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Book Free Inspection <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>What Our Customers Say</h2>
          </div>

          <div className="grid grid-3">
            {[
              { name: 'Rajesh Kumar', location: 'Bangalore', text: 'Excellent installation and great savings on electricity bill. The team was professional and completed the work on time.', rating: 5 },
              { name: 'Priya Sharma', location: 'Pune', text: 'Went with the hybrid system. Perfect for our area with frequent power cuts. Now we have uninterrupted power supply.', rating: 5 },
              { name: 'Amit Patel', location: 'Ahmedabad', text: 'Best investment for our factory. The ROI was achieved in just 3 years. Highly recommend Green Hybrid Power.', rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p style={{ fontWeight: 600 }}>{testimonial.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Home;
