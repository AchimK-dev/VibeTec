const ErrorState = ({
  title = "Connection Error",
  message = "We're having trouble connecting to the server. Please check your connection and try again.",
  actionLabel = "Try Again",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
      <div className="text-error mb-6">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-error mb-3 text-center">
        {title}
      </h2>
      <p className="text-base-content/60 text-center mb-6 max-w-md">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-error text-base-content font-bold hover:scale-105 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
