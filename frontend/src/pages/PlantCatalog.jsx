import React, { useState, useEffect, useCallback } from 'react';
import { plantAPI } from '../services/api';
import PlantCard from '../components/PlantCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/PlantCatalog.css';

const FilterDropdown = ({ categories = [], selectedCategory = '', onChange, placeholder = 'All Categories' }) => {
  const [open, setOpen] = useState(false);


  const styles = {
    container: { position: 'relative', minWidth: 180 },
    trigger: {
      width: '100%',
      padding: '8px 40px 8px 12px',
      border: '2px solid #ddd',
      borderRadius: 8,
      background: '#fff',
      color: '#222',
      textAlign: 'left',
      cursor: 'pointer',
      position: 'relative'
    },
    arrow: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
    menu: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      right: 0,
      maxHeight: 300,
      overflowY: 'auto',
      background: '#fff',
      borderRadius: 10,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      zIndex: 9999,
      padding: 6
    },
    item: {
      padding: '8px 12px',
      cursor: 'pointer',
      borderRadius: 6,
      margin: '4px 2px',
      whiteSpace: 'nowrap'
    },
    activeItem: {
      background: 'rgba(45,90,39,0.08)',
      color: '#222'
    },
    debugTag: { fontSize: 12, color: 'rgba(0,0,0,0.45)', marginLeft: 8 }
  };

  const handleSelect = (val) => {
    onChange && onChange(val);
    setOpen(false);
  };

  return (
    <div style={styles.container} className="filter-dropdown-inline">
      <button
        type="button"
        style={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {selectedCategory || placeholder}
        <span style={styles.debugTag}></span>
        <span style={styles.arrow}>▾</span>
      </button>

      {open && (
        <ul style={styles.menu} role="listbox" aria-label="Categories">
          <li
            tabIndex={0}
            role="option"
            style={{ ...styles.item, ...(selectedCategory === '' ? styles.activeItem : {}) }}
            onClick={() => handleSelect('')}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(''); }}
          >
            {placeholder}
          </li>

          {categories.map(cat => (
            <li
              key={cat}
              tabIndex={0}
              role="option"
              style={{ ...styles.item, ...(selectedCategory === cat ? styles.activeItem : {}) }}
              onClick={() => handleSelect(cat)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(cat); }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PlantCatalog = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchPlants = useCallback(async (search = '', category = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (category && category.trim()) params.category = category.trim();

      const response = await plantAPI.getAllPlants(params);
      setPlants(response.data || []);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setPlants([]);
      setError(err.message || 'Failed to load plants');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await plantAPI.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, [fetchPlants, fetchCategories]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    fetchPlants(value, selectedCategory);
  }, [fetchPlants, selectedCategory]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    fetchPlants(searchTerm, category);
  }, [fetchPlants, searchTerm]);

  const handleRetry = useCallback(() => {
    fetchPlants(searchTerm, selectedCategory);
  }, [fetchPlants, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    fetchPlants('', '');
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="plant-catalog">
      <div className="catalog-header">
        <h1>Plant Catalog</h1>
        <p>Discover beautiful plants for your home and garden</p>
      </div>

      <div className="filters-section">
        <div className="filters-container">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search plants by name..."
          />

          <FilterDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="All Categories"
          />

          {hasActiveFilters && (
            <button
              className="clear-filters-btn"
              onClick={clearFilters}
              type="button"
            >
              Clear Filters
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <span className="filters-label">Active filters:</span>
            {searchTerm && (
              <span className="filter-tag">Search: "{searchTerm}"</span>
            )}
            {selectedCategory && (
              <span className="filter-tag">Category: {selectedCategory}</span>
            )}
          </div>
        )}
      </div>

      <div className="catalog-content">
        {loading && <Loader size="large" message="Loading plants..." />}

        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} type="error" />
        )}

        {!loading && !error && (
          <>
            <div className="results-info">
              <span className="results-count">
                {plants.length} plant{plants.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {plants.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🌱</div>
                <h3>No plants found</h3>
                <p>
                  {hasActiveFilters
                    ? 'Try adjusting your search or filter criteria'
                    : 'No plants available at the moment'}
                </p>
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Show All Plants
                  </button>
                )}
              </div>
            ) : (
              <div className="plants-grid">
                {plants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlantCatalog;
