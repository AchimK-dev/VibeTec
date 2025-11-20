import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Terms of Use
            </h1>
            <p className="text-base-content/60 mb-8">
              Portfolio Demonstration Project
            </p>

            <div className="space-y-8">
              <section className="bg-info/10 p-6 rounded-lg border border-info/30">
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Demo Project Notice
                </h2>
                <p className="text-base-content/80">
                  This is a <strong>portfolio demonstration project</strong>{" "}
                  created to showcase web development skills. This is not a real
                  service and no actual bookings, transactions, or services are
                  provided.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Usage Guidelines
                </h2>
                <p className="text-base-content/80 mb-4">
                  When using this demo application:
                </p>
                <ul className="list-disc pl-6 text-base-content/80 space-y-2">
                  <li>Use only for demonstration and testing purposes</li>
                  <li>Do not enter real personal or sensitive information</li>
                  <li>
                    Understand that all data is temporary and may be reset
                  </li>
                  <li>No real bookings or services are provided</li>
                  <li>All artist profiles and content are fictional</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Disclaimer
                </h2>
                <p className="text-base-content/80 mb-4">
                  This project is provided "as is" for demonstration purposes
                  only. The developer makes no warranties or representations
                  about the accuracy or completeness of the content.
                </p>
                <p className="text-base-content/80">
                  This is an educational project and should not be used for any
                  commercial purposes or real business transactions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-base-content">
                  Source Code
                </h2>
                <p className="text-base-content/80">
                  The source code for this project is available on{" "}
                  <a
                    href="https://github.com/AchimK-dev/VibeTec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:underline"
                  >
                    GitHub
                  </a>
                  . Feel free to explore the implementation and technology
                  stack.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
