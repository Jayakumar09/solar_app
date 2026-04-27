import React from 'react';

export default function Privacy() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <title>Privacy Policy | Green Hybrid Power</title>
      <meta name="description" content="Privacy Policy for Green Hybrid Power. Learn how we collect, use and protect your personal data when you use our website and services." />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>Last updated: {currentYear}</p>

              <h2>1. Introduction</h2>
              <p>Green Hybrid Power Pvt. Ltd. ("we", "us" or "our") operates https://greenhybridpower.in (the "Site"). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose and protect information about you when you visit the Site or use our services.</p>

              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>Contact information you provide (name, email, phone, postal address).</li>
                <li>Communications and enquiry content you send via contact forms or email.</li>
                <li>Transactional data relating to quotations, bookings and payments when you use our services.</li>
                <li>Technical data including IP address, browser type/version, device identifiers, and operating system.</li>
                <li>Usage data such as pages visited, time on site, referral source and anonymized analytics.</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use personal data to:</p>
              <ul>
                <li>Respond to enquiries and provide customer support.</li>
                <li>Process quotes, bookings, and service delivery.</li>
                <li>Send administrative messages and updates related to our services.</li>
                <li>Improve and personalize our services and site content.</li>
                <li>Detect fraud and protect the security of our services.</li>
              </ul>

              <h2>4. Legal Basis for Processing (EU/EEA Users)</h2>
              <p>Where applicable, we rely on consent, performance of a contract, legitimate interests, or compliance with legal obligations as the legal basis for processing personal data.</p>

              <h2>5. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies for analytics and improving site functionality. You can manage cookie preferences through your browser settings.</p>

              <h2>6. Third-Party Services</h2>
              <p>We may share data with trusted third parties who provide services such as payment processing, analytics, email delivery, and hosting. These providers are contractually bound to protect your data.</p>

              <h2>7. Data Retention</h2>
              <p>We retain personal data for as long as necessary to provide services, comply with legal obligations, or resolve disputes. Retention periods vary by data type and purpose.</p>

              <h2>8. Security</h2>
              <p>We implement reasonable technical and organizational measures to protect personal data. However, no method of internet transmission is completely secure.</p>

              <h2>9. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal data, and to object to certain processing. To exercise these rights, contact us at info@greenhybridpower.in.</p>

              <h2>10. Contact</h2>
              <p>If you have questions about this policy or wish to exercise your rights, contact:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p><strong>Green Hybrid Power Pvt. Ltd.</strong></p>
                <p>Email: info@greenhybridpower.in</p>
                <p>Phone: +91 89407 35144</p>
                <p>Website: https://greenhybridpower.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
