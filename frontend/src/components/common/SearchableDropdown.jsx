import React from 'react';


function SearchableDropdown({ 
  items = [], 
  searchQuery, 
  showDropdown, 
  onSelect, 
  renderItem,
  emptyMessage = "No items found"
}) {
  if (!showDropdown || !searchQuery) {
    return null;
  }

  return (
    <div className="search-dropdown">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className="search-dropdown-item"
            onClick={() => onSelect(item)}
          >
            {renderItem ? renderItem(item) : (
              <>
                <div className="search-dropdown-item-name">{item.full_name}</div>
                <div className="search-dropdown-item-details">
                  {item.employee_id} • {item.department}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div style={{
          padding: '12px 16px',
          color: 'var(--gray-500)',
          textAlign: 'center'
        }}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
