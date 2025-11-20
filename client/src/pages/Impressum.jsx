import { useEffect } from "react";

const Impressum = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Impressum
            </h1>
            <p className="text-base-content/60 mb-8">Legal Notice</p>

            <div className="space-y-8">
              <section className="bg-info/10 p-6 rounded-lg border border-info/30">
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Portfolio Project Notice
                </h2>
                <p className="text-base-content/80 mb-4">
                  This is a portfolio demonstration project created to showcase
                  full-stack web development skills. This is{" "}
                  <strong>not a real business</strong> and does not offer actual
                  DJ booking services.
                </p>
                <p className="text-base-content/80">
                  All data, bookings, and user accounts on this platform are for
                  demonstration purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Project Information
                </h2>
                <div className="bg-base-300 p-6 rounded-lg">
                  <p className="text-base-content/80 mb-2">
                    <strong>Project Name:</strong> VibeTec - DJ Booking Platform
                  </p>
                  <p className="text-base-content/80 mb-2">
                    <strong>Type:</strong> Full-Stack Web Application Portfolio
                    Project
                  </p>
                  <p className="text-base-content/80 mb-2">
                    <strong>Developer:</strong> Achim Klein
                  </p>
                  <p className="text-base-content/80">
                    <strong>GitHub:</strong>{" "}
                    <a
                      href="https://github.com/AchimK-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info hover:underline"
                    >
                      github.com/AchimK-dev
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Technologies Used
                </h2>
                <div className="bg-base-300 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-base-content mb-2">
                        Frontend
                      </h3>
                      <ul className="text-base-content/80 space-y-1">
                        <li>• React.js</li>
                        <li>• React Router</li>
                        <li>• TailwindCSS & DaisyUI</li>
                        <li>• Axios</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base-content mb-2">
                        Backend
                      </h3>
                      <ul className="text-base-content/80 space-y-1">
                        <li>• Node.js & Express</li>
                        <li>• MongoDB & Mongoose</li>
                        <li>• JWT Authentication</li>
                        <li>• Bcrypt Password Hashing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Contact
                </h2>
                <div className="bg-base-300 p-6 rounded-lg">
                  <p className="text-base-content/80 mb-2">
                    For questions about this portfolio project:
                  </p>
                  <ul className="text-base-content/80 space-y-2">
                    <li>
                      <strong>GitHub Repository:</strong>{" "}
                      <a
                        href="https://github.com/AchimK-dev/VibeTec"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info hover:underline"
                      >
                        View on GitHub
                      </a>
                    </li>
                    <li>
                      <strong>Developer Profile:</strong>{" "}
                      <a
                        href="https://github.com/AchimK-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Disclaimer
                </h2>
                <div className="bg-base-300 p-6 rounded-lg">
                  <p className="text-base-content/80 mb-4">
                    This website is a demonstration project created for
                    educational and portfolio purposes. It does not represent a
                    real company or business entity.
                  </p>
                  <p className="text-base-content/80 mb-4">
                    No real transactions, bookings, or services are provided
                    through this platform. All content, including artist
                    profiles and booking information, is fictional and for
                    demonstration purposes only.
                  </p>
                  <p className="text-base-content/80">
                    The developer is not liable for any misuse of the
                    information presented on this demonstration website.
                  </p>
                </div>
              </section>

              <section className="bg-base-300 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Image Credits
                </h2>
                <p className="text-base-content/80">
                  Images used in this project are sourced from:
                </p>
                <ul className="list-disc pl-6 text-base-content/80 space-y-1 mt-2">
                  <li>Unsplash.com (Free to use under Unsplash License)</li>
                  <li>Pexels.com (Free to use under Pexels License)</li>
                </ul>
              </section>

              <section>
                <p className="text-base-content/60 text-sm">
                  <strong>Last Updated:</strong>{" "}
                  {new Date().toLocaleDateString("de-DE")}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
