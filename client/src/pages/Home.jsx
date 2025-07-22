import { Link } from 'react-router';
import { ArtistCarousel } from '../components';

const Home = () => {
  return (
    <div className="page-container-no-padding">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-1 grid-rows-3 lg:grid-rows-3 gap-4">
        
        
        <div className="bg-[#BDFF00] rounded-xl shadow-lg p-4 flex flex-col justify-center items-center relative">
          <h1 className="text-4xl lg:text-9xl font-bold text-black mb-6 text-center">
            GET READY<br/>TO PARTY
          </h1>
          <p className="text-lg lg:text-3xl text-black mb-8 text-center">
            We bring the sound, energy, and vibe<br/> that makes your night unforgettable.
          </p>
          <Link 
            to="/artists" 
            className="btn text-black bg-white font-bold text-2xl h-25 w-80 mt-20 hover:scale-105 transition-transform" 
            style={{border: 'none', borderRadius: '50px', }}
          >
            BOOK NOW
          </Link>
          
          {/* Speaker Images */}
          <img 
            src="/images/speaker_left.png" 
            alt="Left Speaker" 
            className="absolute bottom-4 left-0 w-16 h-16 lg:w-150 lg:h-150 object-contain"
          />
          <img 
            src="/images/speaker_right.png" 
            alt="Right Speaker" 
            className="absolute bottom-4 right-0 w-16 h-16 lg:w-150 lg:h-150 object-contain"
          />
        </div>

        
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <div className="text-center m-20">
            <h2 className="text-3xl lg:text-6xl font-bold text-gray-800">OUR ARTISTS</h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ArtistCarousel />
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
            WHAT'S INCLUDED
          </h2>
          <ul className="text-lg text-gray-700 space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Professional DJ setup
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Tailored music experience
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Lighting & effects
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              On-the-spot requests
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Full event coverage
            </li>
          </ul>
          <Link 
            to="/artists" 
            className="btn text-black font-bold text-xl px-8 py-3 hover:scale-105 transition-transform" 
            style={{backgroundColor: '#BDFF00', border: 'none', borderRadius: '20px'}}
          >
            Learn More
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;
