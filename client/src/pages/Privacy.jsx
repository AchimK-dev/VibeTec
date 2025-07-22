const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-600 w-full px-4 py-16">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
        <p className="text-black mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Information We Collect</h2>
            <p className="text-black mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-black space-y-2">
              <li>Personal information (name, email, phone number)</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">How We Use Your Information</h2>
            <p className="text-black mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <ul className="list-disc pl-6 text-black space-y-2">
              <li>Provide and deliver our services</li>
              <li>Process transactions and send notifications</li>
              <li>Respond to your comments and questions</li>
              <li>Send you technical notices and security alerts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Information Sharing</h2>
            <p className="text-black">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Data Security</h2>
            <p className="text-black">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Your Rights</h2>
            <p className="text-black mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-black space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Contact Us</h2>
            <p className="text-black">
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@vibetec.com" className="text-blue-600 hover:text-blue-800"> privacy@vibetec.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
