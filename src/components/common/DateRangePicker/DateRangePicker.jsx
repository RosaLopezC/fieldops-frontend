import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import './DateRangePicker.scss';

const DateRangePicker = ({
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  minDate = '',
  maxDate = '',
  className = ''
}) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const handleStartChange = (e) => {
    onStartDateChange(e.target.value);
  };

  const handleEndChange = (e) => {
    onEndDateChange(e.target.value);
  };

  return (
    <div className={`date-range-picker ${className}`}>
      <div className={`date-input-wrapper ${focusedInput === 'start' ? 'focused' : ''}`}>
        <FaCalendarAlt className="date-icon" />
        <input
          type="date"
          className="date-input"
          value={startDate}
          onChange={handleStartChange}
          onFocus={() => setFocusedInput('start')}
          onBlur={() => setFocusedInput(null)}
          min={minDate}
          max={endDate || maxDate}
        />
        <label className="date-label">Desde</label>
      </div>

      <span className="date-separator">—</span>

      <div className={`date-input-wrapper ${focusedInput === 'end' ? 'focused' : ''}`}>
        <FaCalendarAlt className="date-icon" />
        <input
          type="date"
          className="date-input"
          value={endDate}
          onChange={handleEndChange}
          onFocus={() => setFocusedInput('end')}
          onBlur={() => setFocusedInput(null)}
          min={startDate || minDate}
          max={maxDate}
        />
        <label className="date-label">Hasta</label>
      </div>
    </div>
  );
};

export default DateRangePicker;