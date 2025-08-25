import React from 'react';
import '../styles/FilterDropdown.css';

const FilterDropdown = ({ 
  categories, 
  selectedCategory, 
  onChange, 
  placeholder = 'All Categories' 
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const defaultCategories = [
    'Indoor',
    'Outdoor', 
    'Succulent',
    'Air Purifying',
    'Home Decor',
    'Beginner Friendly',
    'Low Maintenance',
    'Flowering',
    'Herbs',
    'Tropical',
    'Medicinal',
    'Fragrant'
  ];

  const categoriesToShow = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={selectedCategory || ''}
        onChange={handleChange}
        size={1}
      >
        <option value="">{placeholder}</option>
        {categoriesToShow.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <span className="dropdown-arrow">▼</span>
    </div>
  );
};

export default FilterDropdown;