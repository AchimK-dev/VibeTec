const DemoUserTooltip = ({ inline = false }) => {
  if (inline) {
    return (
      <span
        className="tooltip tooltip-top"
        data-tip="Demo Account: Read-only access"
      >
        <span className="text-warning text-xs flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Demo
        </span>
      </span>
    );
  }

  return (
    <div className="alert alert-warning shadow-lg mb-4">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Demo Account</h3>
          <div className="text-xs">
            You are using a read-only demo account. Editing and deleting is not
            possible.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoUserTooltip;
