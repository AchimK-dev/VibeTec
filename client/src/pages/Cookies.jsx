const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-600">
      <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p className="text-gray-600">
              Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
              They allow us to recognize you and remember your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Authentication Cookies:</strong> Keep you logged in to your account</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Session Cookies</h3>
                <p className="text-gray-600">
                  These are temporary cookies that expire when you close your browser. 
                  They help us maintain your session while you navigate our site.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-gray-600">
                  These cookies remain on your device for a set period or until you delete them. 
                  They help us remember your preferences for future visits.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Third-Party Cookies</h3>
                <p className="text-gray-600">
                  Some cookies are set by third-party services that appear on our pages, 
                  such as analytics providers or social media platforms.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Browser settings: Most browsers allow you to block or delete cookies</li>
              <li>Cookie preferences: You can set your preferences in our cookie banner</li>
              <li>Opt-out tools: Some third parties provide opt-out mechanisms</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Please note that blocking certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookie Consent</h2>
            <p className="text-gray-600">
              By continuing to use our website, you consent to our use of cookies as described in this policy. 
              You can withdraw your consent at any time by adjusting your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-gray-600">
              We may update this Cookie Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about our Cookie Policy, please contact us at 
              <a href="mailto:cookies@vibetec.com" className="text-blue-600 hover:text-blue-800"> cookies@vibetec.com</a>.
            </p>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Cookies;
