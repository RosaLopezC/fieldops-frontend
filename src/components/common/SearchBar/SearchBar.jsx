import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.scss';

const SearchBar = ({
  placeholder = 'Buscar...',
  onSearch,
  debounceMs = 300,
  initialValue = '',
  showClearButton = true,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Debounce para no hacer búsquedas en cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Ejecutar búsqueda cuando cambie el valor debounced
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-bar-icon">
        <FaSearch />
      </div>
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {showClearButton && value && (
        <button
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBar;