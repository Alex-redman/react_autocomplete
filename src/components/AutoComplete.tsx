import React, { useState, useEffect, useCallback } from 'react';
import { Person } from '../types/Person';

interface AutoCompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [noSuggestions, setNoSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [previousValue, setPreviousValue] = useState('');

  const handleInputChange = useCallback(
    (value: string) => {
      if (value === previousValue) {
        return;
      }

      setPreviousValue(value);

      if (value === '') {
        setSuggestions(people);
        setNoSuggestions(false);
        onSelected(null);

        return;
      }

      onSelected(null);
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase()),
      );

      setSuggestions(filtered);
      setNoSuggestions(filtered.length === 0);
    },
    [people, previousValue, onSelected],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      handleInputChange(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay, handleInputChange]);

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSuggestions([]);
    setNoSuggestions(false);
    onSelected(person);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!inputValue) {
      setSuggestions(people);
      setNoSuggestions(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
            {noSuggestions && (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
