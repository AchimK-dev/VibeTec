import { useEffect } from "react";
import { Link } from "react-router";
import { ArtistCarousel } from "../components";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container-no-padding">
      <div className="w-full grid grid-cols-1 gap-3 md:gap-4">
        <div className="bg-primary rounded-lg md:rounded-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] flex flex-col justify-center items-center relative overflow-hidden">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-primary-content mb-3 sm:mb-4 md:mb-6 text-center leading-tight">
            GET READY
            <br />
            TO PARTY
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-primary-content mb-4 sm:mb-6 md:mb-8 text-center max-w-3xl px-4">
            We bring the sound, energy, and vibe
            <br className="hidden sm:block" /> that makes your night
            unforgettable.
          </p>
          <Link
            to="/artists"
            className="btn btn-base-100 text-base-content font-bold text-base sm:text-lg md:text-xl lg:text-2xl h-auto py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 lg:px-12 min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px] hover:scale-105 transition-transform shadow-lg"
            style={{ border: "none", borderRadius: "50px" }}
          >
            BOOK NOW
          </Link>
        </div>

        <div className="bg-base-100 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-base-content mb-4 sm:mb-6 md:mb-8 text-center">
            OUR ARTISTS
          </h2>
          <div className="w-full max-w-full flex items-center justify-center px-2 sm:px-4">
            <ArtistCarousel />
          </div>
        </div>

        <div className="bg-base-100 rounded-lg md:rounded-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 min-h-[400px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] xl:min-h-[750px] flex flex-col justify-center items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-base-content mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center">
            WHAT'S INCLUDED
          </h2>
          <ul className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-base-content space-y-2 sm:space-y-2.5 md:space-y-3 mb-4 sm:mb-6 md:mb-8 max-w-2xl w-full px-4">
            <li className="flex items-start">
              <span className="text-success mr-2 sm:mr-2.5 md:mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                ✓
              </span>
              <span>Professional DJ setup</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2 sm:mr-2.5 md:mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                ✓
              </span>
              <span>Tailored music experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2 sm:mr-2.5 md:mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                ✓
              </span>
              <span>Lighting & effects</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2 sm:mr-2.5 md:mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                ✓
              </span>
              <span>On-the-spot requests</span>
            </li>
            <li className="flex items-start">
              <span className="text-success mr-2 sm:mr-2.5 md:mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                ✓
              </span>
              <span>Full event coverage</span>
            </li>
          </ul>
          <Link
            to="/artists"
            className="btn btn-primary text-primary-content font-bold text-base sm:text-lg md:text-xl lg:text-2xl h-auto py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 lg:px-12 min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px] hover:scale-105 transition-transform shadow-lg"
            style={{ border: "none", borderRadius: "50px" }}
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
