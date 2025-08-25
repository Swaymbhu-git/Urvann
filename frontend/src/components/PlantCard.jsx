import React from 'react';
import '../styles/PlantCard.css';

const PlantCard = ({ plant }) => {
  const { name, price, categories, inStock } = plant;

  return (
    <div className={`plant-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="plant-card-header">
        <h3 className="plant-name">{name}</h3>
        <div className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
      
      <div className="plant-price">
        ₹{price}
      </div>
      
      <div className="plant-categories">
        {categories.map((category, index) => (
          <span key={index} className="category-tag">
            {category}
          </span>
        ))}
      </div>
      
      {!inStock && (
        <div className="out-of-stock-overlay">
          <span>Currently Unavailable</span>
        </div>
      )}
    </div>
  );
};

export default PlantCard;