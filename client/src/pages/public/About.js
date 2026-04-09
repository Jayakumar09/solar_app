import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Wind, Battery, Users, Award, Globe, ArrowRight } from 'lucide-react';

const About = () => {
  const milestones = [
    { year: '2019', title: 'Company Founded', desc: 'Started with a vision to make renewable energy accessible' },
    { year: '2020', title: 'First 50 Installations', desc: 'Reached our first major milestone' },
    { year: '2021', title: 'Hybrid Solutions Launch', desc: 'Introduced solar + wind hybrid systems' },
    { year: '2022', title: '100+ Happy Customers', desc: 'Expanded operations across Karnataka' },
    { year: '2023', title: '10 MW Capacity', desc: 'Achieved 10 MW of total installed capacity' },
    { year: '2024', title: 'Premium Division', desc: 'Launched enterprise and premium solutions' }
  ];

  const team = [
    { name: 'Rajesh Verma', role: 'Founder & CEO', exp: '15+ years in energy sector' },
    { name: 'Dr. Priya Nair', role: 'Chief Technology Officer', exp: 'PhD in Renewable Energy, IIT' },
    { name: 'Amit Sharma', role: 'Head of Operations', exp: '10+ years in solar installations' },
    { name: 'Sneha Reddy', role: 'Customer Success Lead', exp: 'Expert in customer relations' }
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
            About <span style={{ color: '#22c55e' }}>Green Hybrid Power</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '600px' }}>
            Pioneering sustainable energy solutions for homes and businesses across India since 2019.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Our Story
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.8 }}>
                Green Hybrid Power was founded with a simple yet powerful vision: to make renewable energy accessible, affordable, and practical for every Indian household and business.
              </p>
              <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.8 }}>
                Starting from Bangalore in 2019, we have grown into one of the most trusted names in rooftop solar and hybrid energy solutions. Our team of certified engineers and technicians has successfully installed over 500 systems across Karnataka, Maharashtra, Gujarat, and Rajasthan.
              </p>
              <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.8 }}>
                We believe that sustainable energy is not just about saving money – it's about securing a better future for generations to come. That's why we combine cutting-edge technology with personalized service to deliver solutions that truly make a difference.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Get in Touch <ArrowRight size={20} />
              </Link>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                {[
                  { icon: Sun, value: '500+', label: 'Installations' },
                  { icon: Wind, value: '10+ MW', label: 'Total Capacity' },
                  { icon: Users, value: '450+', label: 'Happy Customers' },
                  { icon: Award, value: '5+', label: 'Years Experience' }
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '1.5rem', background: '#111827', borderRadius: '16px' }}>
                    <stat.icon size={32} color="#22c55e" style={{ marginBottom: '0.5rem' }} />
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#22c55e' }}>{stat.value}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Our Journey
          </h2>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, #22c55e, #0ea5e9)',
              transform: 'translateX(-50%)'
            }} className="timeline-line" />
            <div className="grid grid-3">
              {milestones.map((m, i) => (
                <div key={i} style={{
                  gridColumn: i % 2 === 0 ? '1 / 2' : '2 / 3',
                  textAlign: i % 2 === 0 ? 'right' : 'left',
                  paddingRight: i % 2 === 0 ? '2rem' : 0,
                  paddingLeft: i % 2 !== 0 ? '2rem' : 0
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#22c55e',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    {m.year}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{m.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Meet Our Team
          </h2>
          <div className="grid grid-4">
            {team.map((member, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <p style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{member.role}</p>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{member.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <Globe size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Our Mission
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
              To accelerate India's transition to clean energy by providing innovative, reliable, and affordable solar and wind solutions that empower homes and businesses to achieve energy independence while contributing to a sustainable future.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .timeline-line { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
