import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantCard from '../PlantCard';

describe('PlantCard', () => {
  const mockPlant = {
    _id: '1',
    name: 'Snake Plant',
    price: 899,
    categories: ['Indoor', 'Air Purifying', 'Low Maintenance'],
    inStock: true
  };

  test('renders plant information correctly', () => {
    render(<PlantCard plant={mockPlant} />);
    
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getByText('₹899')).toBeInTheDocument();
    expect(screen.getByText('✓ In Stock')).toBeInTheDocument();
    expect(screen.getByText('Indoor')).toBeInTheDocument();
    expect(screen.getByText('Air Purifying')).toBeInTheDocument();
    expect(screen.getByText('Low Maintenance')).toBeInTheDocument();
  });

  test('displays out of stock status correctly', () => {
    const outOfStockPlant = {
      ...mockPlant,
      inStock: false
    };

    render(<PlantCard plant={outOfStockPlant} />);
    
    expect(screen.getByText('✗ Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument(); // overlay text
  });

  test('applies correct CSS classes for in-stock plant', () => {
    render(<PlantCard plant={mockPlant} />);
    
    const card = screen.getByText('Snake Plant').closest('.plant-card');
    expect(card).not.toHaveClass('out-of-stock');
    
    const stockStatus = screen.getByText('✓ In Stock');
    expect(stockStatus).toHaveClass('in-stock');
  });

  test('applies correct CSS classes for out-of-stock plant', () => {
    const outOfStockPlant = {
      ...mockPlant,
      inStock: false
    };

    render(<PlantCard plant={outOfStockPlant} />);
    
    const card = screen.getByText('Snake Plant').closest('.plant-card');
    expect(card).toHaveClass('out-of-stock');
    
    const stockStatus = screen.getByText('✗ Out of Stock');
    expect(stockStatus).toHaveClass('out-of-stock');
  });

  test('renders all categories as separate tags', () => {
    render(<PlantCard plant={mockPlant} />);
    
    const categoryTags = screen.getAllByText(/Indoor|Air Purifying|Low Maintenance/);
    expect(categoryTags).toHaveLength(3);
    
    categoryTags.forEach(tag => {
      expect(tag).toHaveClass('category-tag');
    });
  });

  test('handles plant with single category', () => {
    const singleCategoryPlant = {
      ...mockPlant,
      categories: ['Indoor']
    };

    render(<PlantCard plant={singleCategoryPlant} />);
    
    expect(screen.getByText('Indoor')).toBeInTheDocument();
    expect(screen.queryByText('Air Purifying')).not.toBeInTheDocument();
  });

  test('handles plant with no categories gracefully', () => {
    const noCategoryPlant = {
      ...mockPlant,
      categories: []
    };

    render(<PlantCard plant={noCategoryPlant} />);
    
    // Should still render other information
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getByText('₹899')).toBeInTheDocument();
  });
});