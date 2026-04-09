import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Settings, CheckCircle, ArrowRight, Zap, Shield, Clock, Award, Star } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Sun,
      title: 'Rooftop Solar Systems',
      subtitle: 'Residential & Commercial',
      description: 'Turn your rooftop into a power plant. Our solar systems are designed for maximum efficiency and savings.',
      features: [
        '3kW to 15kW residential systems',
        'Commercial and industrial installations',
        'Net metering support',
        'Real-time monitoring app',
        '25-year panel warranty',
        'Free maintenance for first year'
      ],
      starting: '₹1,50,000'
    },
    {
      icon: Wind,
      title: 'Hybrid Solar + Wind',
      subtitle: 'For Consistent Power',
      description: 'Combine solar and wind energy for round-the-clock power generation, perfect for areas with inconsistent sunlight.',
      features: [
        'Solar + small wind turbine combo',
        'Battery storage included',
        'Works day and night',
        'Ideal for coastal & windy areas',
        'Intelligent power switching',
        '10-year system warranty'
      ],
      starting: '₹3,50,000'
    },
    {
      icon: Battery,
      title: 'Battery Backup Solutions',
      subtitle: 'Uninterrupted Power',
      description: 'Never experience power cuts again. Our battery systems store energy for use during outages.',
      features: [
        'Lithium-ion battery technology',
        '5-10 hours backup capacity',
        'Fast charging technology',
        'Compact wall-mounted design',
        '10-year warranty',
        'Easy installation'
      ],
      starting: '₹75,000'
    },
    {
      icon: Settings,
      title: 'AMC & Maintenance',
      subtitle: 'Annual Service Plans',
      description: 'Keep your solar system running at peak efficiency with our comprehensive maintenance packages.',
      features: [
        'Quarterly system checkups',
        'Panel cleaning service',
        'Inverter maintenance',
        'Performance optimization',
        '24/7 emergency support',
        'Priority service calls'
      ],
      starting: '₹12,000/year'
    },
    {
      icon: Zap,
      title: 'Smart Monitoring',
      subtitle: 'Real-Time Tracking',
      description: 'Monitor your energy generation and consumption in real-time with our smart monitoring solutions.',
      features: [
        'Mobile app access',
        'Real-time energy data',
        'Generation alerts',
        'Consumption analytics',
        'Cost savings tracking',
        'Remote diagnostics'
      ],
      starting: '₹5,000/year'
    },
    {
      icon: Shield,
      title: 'Installation & Commissioning',
      subtitle: 'Professional Setup',
      description: 'Our certified engineers ensure flawless installation with minimal disruption to your daily routine.',
      features: [
        'Site survey & assessment',
        'Custom system design',
        'Professional installation',
        'Quality testing & commissioning',
        'Safety compliance',
        'Post-installation support'
      ],
      starting: '₹25,000'
    }
  ];

  return (
    <div>
      <section style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)',
        paddingTop: '70px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Our <span style={{ color: '#22c55e' }}>Services & Plans</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '600px' }}>
            Comprehensive renewable energy solutions tailored for your unique needs.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>What We Offer</h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              From consultation to installation and maintenance, we provide end-to-end renewable energy solutions.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {services.map((service, i) => (
              <div key={i} className="card" style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <service.icon size={32} color="#22c55e" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{service.title}</h3>
                    <p style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: 500 }}>{service.subtitle}</p>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  {service.description}
                </p>

                <ul style={{ listStyle: 'none', marginBottom: '1.5rem', flex: 1 }}>
                  {service.features.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                      <CheckCircle size={16} color="#22c55e" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #374151'
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Starting from</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>{service.starting}</p>
                  </div>
                  <Link to="/quote" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Get Quote <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Our Process</h2>
            <p style={{ color: '#94a3b8' }}>Simple, transparent, and hassle-free</p>
          </div>

          <div className="grid grid-4">
            {[
              { step: '01', title: 'Consultation', desc: 'Free site assessment and energy requirement analysis' },
              { step: '02', title: 'Custom Design', desc: 'Tailored system design based on your needs and roof space' },
              { step: '03', title: 'Installation', desc: 'Professional installation by certified technicians' },
              { step: '04', title: 'Support', desc: 'Ongoing maintenance and 24/7 customer support' }
            ].map((process, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {process.step}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{process.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(10, 22, 40, 1) 100%)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 4rem)',
            textAlign: 'center'
          }}>
            <Star size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Ready to Start Your Solar Journey?
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Book a free site inspection today and let our experts design the perfect solution for your home or business.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book-inspection" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                Book Free Inspection <ArrowRight size={20} />
              </Link>
              <Link to="/quote" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
