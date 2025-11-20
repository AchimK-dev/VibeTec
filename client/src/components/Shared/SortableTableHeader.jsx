const SortableTableHeader = ({
  label,
  field,
  currentSortField,
  currentSortOrder,
  onSort,
}) => {
  const isActive = currentSortField === field;

  return (
    <th
      className="text-base-content font-bold cursor-pointer"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        {isActive && (
          <span className="text-primary">
            {currentSortOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );
};

export default SortableTableHeader;
