import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Privacy Notice
            </h1>
            <p className="text-base-content/60 mb-8">
              Portfolio Project - Demo Data Only
            </p>

            <div className="space-y-8">
              <section className="bg-info/10 p-6 rounded-lg border border-info/30">
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Important Notice
                </h2>
                <p className="text-base-content/80">
                  This is a <strong>demonstration portfolio project</strong>.
                  All data entered into this application is for testing purposes
                  only and may be visible to other users or reset periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Demo Data Handling
                </h2>
                <p className="text-base-content/80 mb-4">
                  Please be aware that:
                </p>
                <ul className="list-disc pl-6 text-base-content/80 space-y-2">
                  <li>This is not a production application</li>
                  <li>Data may be reset or deleted at any time</li>
                  <li>Do not enter real personal information</li>
                  <li>Use dummy data for testing only</li>
                  <li>No real transactions or bookings are processed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Data Storage
                </h2>
                <p className="text-base-content/80">
                  Data entered in this demo application is stored temporarily in
                  a development database for demonstration purposes. The
                  application uses standard security practices including
                  password hashing and JWT authentication, but should not be
                  used with real personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Contact
                </h2>
                <p className="text-base-content/80">
                  For questions about this portfolio project, visit the{" "}
                  <a
                    href="https://github.com/AchimK-dev/VibeTec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:underline"
                  >
                    GitHub repository
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
