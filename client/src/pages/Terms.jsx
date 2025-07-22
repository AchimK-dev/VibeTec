const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using VibeTec services, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of VibeTec materials for personal, 
              non-commercial transitory viewing only.
            </p>
            <p className="text-gray-600 mb-4">This license shall automatically terminate if you violate any of these restrictions:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use materials for commercial purposes</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate and complete information.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You are responsible for safeguarding your password</li>
              <li>You are responsible for all activities under your account</li>
              <li>We reserve the right to refuse service to anyone</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">You may not use our service:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>For any unlawful purpose</li>
              <li>To transmit viruses or malicious code</li>
              <li>To infringe upon intellectual property rights</li>
              <li>To harass, abuse, or harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="text-gray-600">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. 
              We reserve the right to modify or discontinue services with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-gray-600">
              VibeTec shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@vibetec.com" className="text-blue-600 hover:text-blue-800"> legal@vibetec.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
