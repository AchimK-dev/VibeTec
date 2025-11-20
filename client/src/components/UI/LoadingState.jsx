const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <p className="text-base-content/60 text-lg">{message}</p>
    </div>
  );
};

export default LoadingState;
