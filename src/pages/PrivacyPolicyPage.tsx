import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="pt-24 px-6 pb-32 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-light">
          <p className="text-gray-light mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">1. Introduction</h2>
            <p>
              Finesse ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">2. Data We Collect</h2>
            <p>We collect and process the following types of personal data:</p>
            <ul className="list-disc list-inside text-gray-light mt-4 space-y-2">
              <li>Identity Data (name, username)</li>
              <li>Contact Data (email address, telephone number)</li>
              <li>Technical Data (IP address, browser type)</li>
              <li>Profile Data (purchases, preferences)</li>
              <li>Usage Data (how you use our website)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">3. Cookie Policy</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <p className="mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">4. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-light mt-4 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-white mb-4">5. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-gray-light mt-4 space-y-2">
              <li>By email: privacy@finesse.com</li>
              <li>By phone: (555) 123-4567</li>
              <li>By mail: 1234 Luxury Lane, New York, NY 10001</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;