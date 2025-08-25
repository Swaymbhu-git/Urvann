import React, { useState } from 'react';
import { plantAPI } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AddPlantForm.css';

const AddPlantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categories: '',
    inStock: true
  });
  
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
    validationErrors: {}
  });

  const suggestedCategories = [
    'Indoor', 'Outdoor', 'Succulent', 'Air Purifying', 'Home Decor',
    'Beginner Friendly', 'Low Maintenance', 'Flowering', 'Herbs',
    'Large Plants', 'Small Plants', 'Trailing Plants', 'Medicinal',
    'Fragrant', 'Colorful Foliage', 'Low Light', 'Desert Plants'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (state.validationErrors[name]) {
      setState(prev => ({
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          [name]: null
        }
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Plant name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Plant name cannot exceed 100 characters';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.categories.trim()) {
      errors.categories = 'At least one category is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setState(prev => ({
        ...prev,
        validationErrors,
        error: null
      }));
      return;
    }
    
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
        validationErrors: {}
      }));
      
      const plantData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
        inStock: formData.inStock
      };
      
      await plantAPI.createPlant(plantData);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
        error: null
      }));
      
      setFormData({
        name: '',
        price: '',
        categories: '',
        inStock: true
      });
      
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, 3000);
      
    } catch (error) {
      console.error('Error creating plant:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create plant',
        success: false
      }));
    }
  };

  const addCategory = (category) => {
    const currentCategories = formData.categories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat);
    
    if (!currentCategories.includes(category)) {
      const newCategories = [...currentCategories, category].join(', ');
      setFormData(prev => ({ ...prev, categories: newCategories }));
    }
  };

  const { loading, error, success, validationErrors } = state;

  const handleAdminLogout = () => {
    sessionStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  return (
    <div className="add-plant-form">
      <div className="form-header">
        <div className="admin-status">
          <span className="admin-badge">🔐 Admin Mode</span>
          <button 
            className="logout-btn" 
            onClick={handleAdminLogout}
            type="button"
          >
            Exit Admin
          </button>
        </div>
        <h1>Add New Plant</h1>
        <p>Add a new plant to the catalog</p>
      </div>

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Plant added successfully!
        </div>
      )}

      {error && (
        <ErrorMessage 
          message={error}
          type="error"
          showRetry={false}
        />
      )}

      <form onSubmit={handleSubmit} className="plant-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Plant Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.name ? 'error' : ''}`}
            placeholder="Enter plant name"
            maxLength={100}
            disabled={loading}
          />
          {validationErrors.name && (
            <span className="error-text">{validationErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price (₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.price ? 'error' : ''}`}
            placeholder="Enter price"
            min="0"
            step="0.01"
            disabled={loading}
          />
          {validationErrors.price && (
            <span className="error-text">{validationErrors.price}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="categories" className="form-label">
            Categories *
          </label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.categories ? 'error' : ''}`}
            placeholder="Enter categories separated by commas"
            disabled={loading}
          />
          <small className="form-help">
            Separate multiple categories with commas (e.g., Indoor, Air Purifying, Low Maintenance)
          </small>
          {validationErrors.categories && (
            <span className="error-text">{validationErrors.categories}</span>
          )}
          
          <div className="suggested-categories">
            <span className="suggestions-label">Suggested categories:</span>
            <div className="category-suggestions">
              {suggestedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="category-suggestion"
                  onClick={() => addCategory(category)}
                  disabled={loading}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="form-checkbox"
              disabled={loading}
            />
            <span className="checkbox-text">In Stock</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size="small" />
                Adding Plant...
              </>
            ) : (
              'Add Plant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;