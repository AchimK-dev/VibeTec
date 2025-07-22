import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getArtists } from '@/data';
import { ArtistCard, ArtistCarousel } from '@/components';

const Artists = () => {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const artists = await getArtists();
        setArtists(artists);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
  
  return (
    <div className="page-container-no-padding">
      {/* 2-Kachel Grid Layout - Obere Kachel halb so groß wie untere */}
      <div className="w-full grid grid-cols-1 gap-4 grid-rows-1-2">
        
        {/* Erste Kachel - Artist Carousel (33.33% der Höhe) */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <div className="text-center m-20">
            <h2 className="text-3xl lg:text-6xl font-bold text-gray-800">OUR ARTISTS</h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ArtistCarousel />
          </div>
        </div>
        
        {/* Zweite Kachel - Artists Grid (66.66% der Höhe) */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
          <div className="flex-1">
            {artists && artists.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {artists.map((artist) => (
                  <ArtistCard key={artist._id} {...artist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎧</div>
                <h2 className="text-2xl font-bold text-gray-300 mb-2">No Artists Yet</h2>
                <p className="text-gray-400">Be the first to add an artist!</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Artists;
