import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { getArtists } from '@/data';

const ArtistCarousel = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load artists from database
  useEffect(() => {
    const loadArtists = async () => {
      try {
        const artistsData = await getArtists();
        setArtists(artistsData);
      } catch (error) {
        // Handle authentication errors gracefully (when not logged in)
        if (error.response?.status === 401) {
          // Set empty array to show fallback content
          setArtists([]);
        } else {
          setArtists([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  // Function to reorder artists: center first, then alternating left-right
  const getReorderedArtists = (artists) => {
    if (artists.length === 0) return [];
    
    const reordered = [];
    const firstArtist = artists[0];
    
    // Add first artist to center
    reordered.push(firstArtist);
    
    // Add remaining artists alternating left and right
    for (let i = 1; i < artists.length; i++) {
      if (i % 2 === 1) {
        // Odd indices go to the left (beginning)
        reordered.unshift(artists[i]);
      } else {
        // Even indices go to the right (end)
        reordered.push(artists[i]);
      }
    }
    
    return reordered;
  };

  // Initialize carousel position after artists load
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || artists.length === 0) return;

    // Calculate center position based on reordered array
    const reordered = getReorderedArtists(artists);
    const centerIndex = Math.floor(reordered.length / 2);
    const itemWidth = 820; // Width including gap
    const centerPosition = centerIndex * itemWidth;
    
    // Scroll to center position smoothly
    setTimeout(() => {
      carousel.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    }, 100);
  }, [artists]);

  // Handle artist click
  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  // Get reordered artists for display
  const reorderedArtists = getReorderedArtists(artists);

  // Don't render if still loading
  if (loading) {
    return (
      <div className="carousel carousel-center rounded-box space-x-4 p-4 overflow-x-auto">
        <div className="carousel-item">
          <div className="w-[800px] h-[800px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-xl">Loading Artists...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show fallback content when no artists available (not logged in or no data)
  if (artists.length === 0) {
    return (
      <div className="carousel carousel-center rounded-box space-x-4 p-4 overflow-x-auto">
        <div className="carousel-item">
          <div className="w-[800px] h-[800px] bg-gradient-to-br from-[#BDFF00] to-[#a3e600] rounded-lg flex flex-col items-center justify-center text-black">
            <div className="text-8xl mb-6">🎵</div>
            <h3 className="text-3xl font-bold mb-4 text-center">Amazing Artists</h3>
            <p className="text-xl text-center mb-6 px-8">
              Discover talented DJs and musicians ready to make your event unforgettable
            </p>
            <div className="btn text-black font-bold border-2 border-black hover:scale-105 transition-all duration-200 rounded-lg px-8 py-3"
                 style={{backgroundColor: 'white'}}>
              Sign up to explore artists
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => {
          const carousel = carouselRef.current;
          if (carousel) {
            const singleSetWidth = carousel.scrollWidth / 2;
            const currentPosition = carousel.scrollLeft;
            const itemWidth = 820;
            const newPosition = currentPosition - itemWidth;
            
            // If scrolling would go before the start, wrap to the end of the first set
            if (newPosition < 0) {
              carousel.scrollTo({
                left: singleSetWidth + newPosition,
                behavior: 'smooth'
              });
            } else {
              carousel.scrollTo({
                left: newPosition,
                behavior: 'smooth'
              });
            }
          }
        }}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => {
          const carousel = carouselRef.current;
          if (carousel) {
            const singleSetWidth = carousel.scrollWidth / 2;
            const currentPosition = carousel.scrollLeft;
            const itemWidth = 820;
            
            // If scrolling would go past the first set, wrap to the beginning
            if (currentPosition + itemWidth >= singleSetWidth) {
              carousel.scrollTo({
                left: (currentPosition + itemWidth) - singleSetWidth,
                behavior: 'smooth'
              });
            } else {
              carousel.scrollTo({
                left: currentPosition + itemWidth,
                behavior: 'smooth'
              });
            }
          }
        }}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div 
        ref={carouselRef}
        className="carousel carousel-center rounded-box space-x-4 p-4 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Main artist set - reordered with center first */}
        {reorderedArtists.map((artist, index) => (
          <div 
            key={`main-${artist._id || index}`} 
            className="carousel-item relative cursor-pointer"
            onClick={() => handleArtistClick(artist._id)}
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-[800px] h-[800px] object-cover rounded-lg" 
            />
            {/* Artist name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold text-center">{artist.name}</h3>
              <p className="text-white/80 text-lg text-center">{artist.musicGenre}</p>
              <p className="text-white/60 text-sm text-center mt-2">Click to book →</p>
            </div>
          </div>
        ))}
        
        {/* Duplicate set for seamless infinite scroll */}
        {reorderedArtists.map((artist, index) => (
          <div 
            key={`loop-${artist._id || index}`} 
            className="carousel-item relative cursor-pointer"
            onClick={() => handleArtistClick(artist._id)}
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-[800px] h-[800px] object-cover rounded-lg" 
            />
            {/* Artist name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold text-center">{artist.name}</h3>
              <p className="text-white/80 text-lg text-center">{artist.musicGenre}</p>
              <p className="text-white/60 text-sm text-center mt-2">Click to book →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistCarousel;
