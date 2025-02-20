import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="pt-24 px-6 pb-32 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-white prose-li:text-white prose-strong:text-white">
          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">1. Introduction</h2>
            <p className="text-white">
              Finesse ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">2. Information We Collect</h2>
            <p className="text-white">We collect and process the following types of personal data:</p>
            <ul className="list-disc list-inside text-white mt-4 space-y-2">
              <li>Identity Data (name, username, date of birth)</li>
              <li>Contact Data (email address, telephone number, shipping address)</li>
              <li>Financial Data (payment card details through our secure payment processor)</li>
              <li>Transaction Data (details of products purchased and payment history)</li>
              <li>Technical Data (IP address, browser type, device information)</li>
              <li>Profile Data (purchases, preferences, feedback)</li>
              <li>Usage Data (how you use our website and services)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white">Your information is used for the following purposes:</p>
            <ul className="list-disc list-inside text-white mt-4 space-y-2">
              <li>Processing your orders and payments</li>
              <li>Managing your account and providing customer support</li>
              <li>Sending order confirmations and updates</li>
              <li>Personalizing your shopping experience</li>
              <li>Improving our products and services</li>
              <li>Detecting and preventing fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">4. Data Security</h2>
            <p className="text-white">
              We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our payment processing is handled by trusted third-party providers who comply with PCI-DSS requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">5. Your Rights</h2>
            <p className="text-white">You have the right to:</p>
            <ul className="list-disc list-inside text-white mt-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">6. Contact Information</h2>
            <p className="text-white">
              For any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none text-white mt-4 space-y-2">
              <li>Email: privacy@finesse.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: Toronto, ON, L6R 0A0</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;