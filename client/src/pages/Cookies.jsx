import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Cookie Information
            </h1>
            <p className="text-base-content/60 mb-8">Portfolio Demo Project</p>

            <div className="space-y-8">
              <section className="bg-info/10 p-6 rounded-lg border border-info/30">
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Demo Project Notice
                </h2>
                <p className="text-base-content/80">
                  This is a portfolio demonstration project. Cookie usage is
                  minimal and only for demonstration of authentication
                  functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Cookies Used
                </h2>
                <div className="bg-base-300 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-base-content">
                    Authentication Cookies
                  </h3>
                  <p className="text-base-content/80 mb-4">
                    This application uses JWT (JSON Web Tokens) stored in
                    browser local storage for authentication purposes. This
                    allows users to remain logged in during their demo session.
                  </p>

                  <h3 className="text-lg font-semibold mb-2 text-base-content">
                    Theme Preferences
                  </h3>
                  <p className="text-base-content/80">
                    Your light/dark theme preference is stored locally to
                    persist across sessions.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Managing Storage
                </h2>
                <p className="text-base-content/80 mb-4">
                  You can clear all stored data by:
                </p>
                <ul className="list-disc pl-6 text-base-content/80 space-y-2">
                  <li>Logging out (clears authentication token)</li>
                  <li>
                    Clearing browser local storage through browser settings
                  </li>
                  <li>Using browser incognito/private mode</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  No Tracking
                </h2>
                <p className="text-base-content/80">
                  This demo application does not use any analytics, tracking
                  cookies, or third-party services that collect user data.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
