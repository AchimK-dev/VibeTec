const TableFilters = ({
  searchValue,
  onSearchChange,
  suggestions = [],
  showSuggestions,
  onSuggestionSelect,
  onClearSearch,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-base-200 rounded-lg px-4 py-3">
        <svg
          className="w-5 h-5 text-base-content/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={onSearchChange}
          className="flex-1 bg-transparent text-base-content placeholder:text-base-content/50 outline-none"
        />
        {searchValue && (
          <button
            onClick={onClearSearch}
            className="text-base-content/60 hover:text-base-content"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-base-200 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-base-200 hover:text-base-content transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-base-content">
                {suggestion.text}
              </div>
              {suggestion.subtext && (
                <div className="text-sm text-base-content/60">
                  {suggestion.subtext}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableFilters;
