const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-[10rem] font-extrabold lg:text-[16rem] text-transparent bg-linear-to-r from-[#6054e8] to-[#f8485e] bg-clip-text">
          404
        </h1>
        <p className="text-2xl font-bold text-base-content flex items-center gap-2">
          Page not found
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
