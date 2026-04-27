import React from 'react';

export default function Terms() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <title>Terms &amp; Conditions | Green Hybrid Power</title>
      <meta name="description" content="Terms and Conditions for Green Hybrid Power. Rules and legal terms for use of the site and services." />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms &amp; Conditions</h1>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>Last updated: {currentYear}</p>

              <h2>1. Introduction</h2>
              <p>These Terms &amp; Conditions ("Terms") govern your access to and use of https://greenhybridpower.in (the "Site") operated by Green Hybrid Power Pvt. Ltd. By accessing or using the Site you agree to be bound by these Terms.</p>

              <h2>2. Use of the Site</h2>
              <p>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site in any way that causes damage, disruption or unauthorized access.</p>

              <h2>3. Intellectual Property</h2>
              <p>All content on the Site including text, graphics, logos and images is the property of Green Hybrid Power or its licensors and is protected by intellectual property laws.</p>

              <h2>4. Disclaimers &amp; Limitation of Liability</h2>
              <p>Information on the Site is provided "as is" and for general informational purposes only. To the maximum extent permitted by law, Green Hybrid Power excludes liability for any loss or damage arising from the use of the Site.</p>

              <h2>5. Governing Law</h2>
              <p>These Terms are governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of Indian courts.</p>

              <h2>6. Contact</h2>
              <p>If you have questions about these Terms, contact us at info@greenhybridpower.in.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
