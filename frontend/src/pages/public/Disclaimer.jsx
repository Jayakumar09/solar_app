import React from 'react';
import { Link } from 'react-router-dom';

const Disclaimer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-card p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              This website is operated by Green Hybrid Power ("we," "our," or "us"). The following disclaimer governs your use of our website and any information, content, or services provided through this site.
            </p>

            <hr className="my-8" />
            
            <h2 className="text-xl font-bold text-gray-800 mt-8">1. Informational Purpose Only</h2>
            <p>
              The content on this website is provided for informational and educational purposes only. The information provided is general in nature and should not be construed as professional, financial, or legal advice. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">2. No Professional Guarantee</h2>
            <p>
              Any financial projections, savings estimates, ROI calculations, or cost information provided on this website are estimates only and may vary based on numerous factors including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Location and sunlight availability</li>
              <li>Electricity rates and rate increases</li>
              <li>System specifications and installation quality</li>
              <li>Government policies and subsidies</li>
              <li>Individual energy consumption patterns</li>
            </ul>
            <p className="mt-4">
              Past performance does not guarantee future results. Actual savings and returns may differ significantly from any estimates provided.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">3. External Links</h2>
            <p>
              Our website may contain links to third-party websites, services, or resources that are not operated or controlled by Green Hybrid Power. We have no control over the content, availability, or privacy practices of these third-party sites. We are not responsible for any damages or losses arising from your use of or reliance on any third-party content, products, or services.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">4. Advertising and Affiliate Disclosure</h2>
            <p>
              This website may display advertisements or contain affiliate links to third-party products or services. Green Hybrid Power may receive compensation for clicks on or purchases made through these links. However, our recommendations are based on our genuine assessment and not on compensation received. We only recommend products and services that we believe will provide value to our users.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">5. Accuracy of Information</h2>
            <p>
              While we strive to keep the information on this website accurate and current, errors or omissions may occur. We reserve the right to make changes to our website and this disclaimer at any time without prior notice. You acknowledge that any reliance on information from this website is at your own risk.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">6. Technical Information</h2>
            <p>
              Solar energy systems, costs, government subsidies, and policies are subject to change. Information regarding prices, subsidies, and regulations may change without notice. Always verify current information with relevant government agencies and authorized vendors before making any decisions.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">7. User Responsibility</h2>
            <p>
              Users of this website are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verifying all information independently</li>
              <li>Consulting with qualified professionals</li>
              <li>Conducting their own due diligence</li>
              <li>Making informed decisions based on their specific circumstances</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-800 mt-8">8. Limitation of Liability</h2>
            <p>
              In no event shall Green Hybrid Power, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of this website or any information provided herein. Your sole remedy for dissatisfaction with the website is to stop using it.
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8">9. Contact Information</h2>
            <p>
              If you have any questions about this disclaimer, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p><strong>Green Hybrid Power</strong></p>
              <p>Email: info@greenhybridpower.in</p>
              <p>Phone: +91 8940735144</p>
              <p>Website: https://greenhybridpower.in</p>
            </div>

            <hr className="my-8" />

            <p className="text-sm text-gray-500">
              Last updated: {currentYear}. This disclaimer is subject to change without notice.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/contact" 
                className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600"
              >
                Contact Us
              </Link>
              <Link 
                to="/privacy" 
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;