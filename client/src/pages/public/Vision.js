import React from 'react';
import { Target, Eye, Rocket, Lightbulb, Heart, Globe } from 'lucide-react';

const Vision = () => {
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
            Our <span style={{ color: '#22c55e' }}>Vision & Mission</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '600px' }}>
            Driving India's renewable energy revolution with innovation and sustainability.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '3rem', marginBottom: '4rem' }}>
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(10, 22, 40, 1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Eye size={40} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#22c55e' }}>
                Our Vision
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                To become India's most trusted and impactful renewable energy company, powering 1 million homes with clean energy by 2035 and significantly reducing carbon emissions.
              </p>
              <ul style={{ listStyle: 'none' }}>
                {[
                  'Leader in rooftop solar solutions across India',
                  'Pioneer in hybrid solar-wind technologies',
                  'Enable energy independence for rural communities',
                  'Zero carbon footprint operations by 2030'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', color: '#94a3b8' }}>
                    <span style={{ color: '#22c55e', marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(10, 22, 40, 1) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.3)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(14, 165, 233, 0.2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Target size={40} color="#0ea5e9" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0ea5e9' }}>
                Our Mission
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                To make renewable energy accessible, affordable, and practical for every Indian household and business through innovative solutions and exceptional service.
              </p>
              <ul style={{ listStyle: 'none' }}>
                {[
                  'Provide best-in-class solar solutions at competitive prices',
                  'Ensure 100% customer satisfaction with comprehensive support',
                  'Maintain highest standards of quality and reliability',
                  'Continuously innovate with emerging technologies'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', color: '#94a3b8' }}>
                    <span style={{ color: '#0ea5e9', marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111827' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Our Core Values
          </h2>
          <div className="grid grid-3">
            {[
              { icon: Lightbulb, title: 'Innovation', desc: 'Continuously pushing boundaries with cutting-edge renewable energy technology.' },
              { icon: Heart, title: 'Sustainability', desc: 'Committed to environmental stewardship and reducing carbon footprints.' },
              { icon: Globe, title: 'Accessibility', desc: 'Making clean energy available and affordable for everyone.' },
              { icon: Rocket, title: 'Excellence', desc: 'Striving for the highest quality in everything we do.' },
              { icon: Eye, title: 'Transparency', desc: 'Honest communication and clear pricing with no hidden costs.' },
              { icon: Target, title: 'Impact', desc: 'Focused on creating measurable positive change for our communities.' }
            ].map((value, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#22c55e'
                }}>
                  <value.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{value.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
              2035 Goals
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '3rem' }}>
              A decade-long roadmap to transform India's energy landscape
            </p>

            <div className="grid grid-3">
              {[
                { value: '1M+', label: 'Homes Powered', desc: 'Providing clean energy to 1 million Indian households' },
                { value: '5 GW', label: 'Capacity Target', desc: 'Achieving 5 gigawatts of installed solar capacity' },
                { value: '10M', label: 'Tons CO2 Saved', desc: 'Preventing 10 million tons of carbon emissions' }
              ].map((goal, i) => (
                <div key={i} className="card" style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(10, 22, 40, 1) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.5rem' }}>{goal.value}</h3>
                  <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{goal.label}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vision;
