import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { getArtists } from "@/data";

const ArtistCarousel = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const getItemSize = () => {
    if (typeof window === "undefined") return { width: 300, height: 300 };

    const width = window.innerWidth;
    if (width < 640) return { width: 280, height: 280 };
    if (width < 768) return { width: 320, height: 320 };
    if (width < 1024) return { width: 350, height: 350 };
    if (width < 1280) return { width: 380, height: 380 };
    return { width: 400, height: 400 };
  };

  const [itemSize, setItemSize] = useState(getItemSize());
  const ITEM_WIDTH = itemSize.width;
  const ITEM_HEIGHT = itemSize.height;
  const GAP = 16;

  useEffect(() => {
    const handleResize = () => {
      setItemSize(getItemSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const artistsData = await getArtists();
        setArtists(artistsData);
      } catch {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  useEffect(() => {
    if (!artists.length) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    setTimeout(() => {
      const middleIndex = Math.floor(artists.length / 2);
      const scrollPosition =
        middleIndex * (ITEM_WIDTH + GAP) -
        carousel.clientWidth / 2 +
        ITEM_WIDTH / 2;
      carousel.scrollLeft = Math.max(0, scrollPosition);
    }, 100);
  }, [artists, ITEM_WIDTH, GAP]);

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  const handleScrollLeft = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = ITEM_WIDTH + GAP;
    const newPosition = carousel.scrollLeft - scrollAmount;
    carousel.scrollTo({
      left: Math.max(0, newPosition),
      behavior: "smooth",
    });
  }, [ITEM_WIDTH, GAP]);

  const handleScrollRight = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = ITEM_WIDTH + GAP;
    const newPosition = carousel.scrollLeft + scrollAmount;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollTo({
      left: Math.min(newPosition, maxScroll),
      behavior: "smooth",
    });
  }, [ITEM_WIDTH, GAP]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!artists.length || isPaused) return;

    let animationFrameId;
    const scrollSpeed = 1;

    const smoothScroll = () => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const currentScroll = carousel.scrollLeft;

      if (currentScroll < maxScroll - 1) {
        carousel.scrollTo({
          left: currentScroll + scrollSpeed,
          behavior: "instant",
        });
      } else {
        carousel.scrollTo({
          left: 0,
          behavior: "instant",
        });
      }

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [artists, isPaused]);

  if (loading) {
    return (
      <div className="carousel carousel-center rounded-box space-x-4 p-4 overflow-x-auto">
        <div className="carousel-item">
          <div className="w-[400px] h-[400px] bg-base-100 rounded-lg flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="carousel carousel-center rounded-box space-x-4 p-4 overflow-x-auto">
        <div className="carousel-item">
          <div
            className="bg-base-200 rounded-lg flex flex-col items-center justify-center text-base-content p-8"
            style={{ width: `${ITEM_WIDTH}px`, height: `${ITEM_HEIGHT}px` }}
          >
            <div className="text-base-content/40 mb-6">
              <svg
                className="w-20 h-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-center text-base-content">
              No Artists Available
            </h3>
            <p className="text-sm text-center text-base-content/60 max-w-xs">
              Our talented DJs will be here soon. Check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full mx-auto"
      style={{ height: `${ITEM_HEIGHT + 32}px` }}
    >
      <button
        onClick={handleScrollLeft}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsPaused(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsPaused(false);
        }}
        className="absolute left-0 z-20 w-20 bg-gradient-to-r from-black/20 to-transparent hover:from-black/40 transition-all duration-300 group"
        style={{
          top: "1rem",
          height: `${ITEM_HEIGHT}px`,
        }}
        aria-label="Scroll left"
      >
        <svg
          className="w-8 h-8 text-base-content absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleScrollRight}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsPaused(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsPaused(false);
        }}
        className="absolute right-0 z-20 w-20 bg-gradient-to-l from-black/20 to-transparent hover:from-black/40 transition-all duration-300 group"
        style={{
          top: "1rem",
          height: `${ITEM_HEIGHT}px`,
        }}
        aria-label="Scroll right"
      >
        <svg
          className="w-8 h-8 text-base-content absolute right-4 top-1/2 transform -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div
        ref={carouselRef}
        className="rounded-box scrollbar-hide carousel-center"
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "none",
          gap: `${GAP}px`,
          padding: "1rem",
          maxWidth: "100%",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="carousel-item relative cursor-pointer group"
            onClick={() => handleArtistClick(artist._id)}
            style={{
              width: `${ITEM_WIDTH}px`,
              height: `${ITEM_HEIGHT}px`,
              flexShrink: 0,
            }}
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-lg flex flex-col justify-end p-4 transition-all duration-300 group-hover:from-black/95">
              <h3 className="text-secondary-content text-xl font-bold mb-1">
                {artist.name}
              </h3>
              <p className="text-secondary-content text-sm">
                {artist.musicGenre}
              </p>
              <p className="text-secondary-content text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click to book →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistCarousel;
