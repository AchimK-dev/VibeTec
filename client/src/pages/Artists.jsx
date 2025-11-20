import { useEffect, useState } from "react";
import { getArtists } from "@/data";
import {
  ArtistCard,
  ArtistCarousel,
  LoadingState,
  EmptyState,
} from "@/components";

const Artists = () => {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const artists = await getArtists();
        setArtists(artists);
      } catch {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading)
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl">
          <LoadingState message="Loading artists..." />
        </div>
      </div>
    );

  return (
    <div className="page-container-no-padding">
      <div className="w-full flex flex-col gap-3 md:gap-4">
        <div className="bg-base-100 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-base-content mb-6 sm:mb-8 md:mb-12 lg:mb-15 text-center px-4">
            OUR ARTISTS
          </h2>
          <div className="w-full max-w-full flex items-center justify-center px-2 sm:px-4">
            <ArtistCarousel />
          </div>
        </div>

        <div className="bg-base-100 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            {artists && artists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {artists.map((artist) => (
                  <ArtistCard key={artist._id} {...artist} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="music"
                title="No Artists Available"
                message="We're currently updating our artist roster. Please check back soon!"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;
