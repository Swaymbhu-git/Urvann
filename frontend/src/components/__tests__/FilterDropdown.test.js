import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FilterDropdown from '../FilterDropdown';

describe('FilterDropdown', () => {
  const mockOnChange = jest.fn();
  const mockCategories = ['Indoor', 'Outdoor', 'Succulent'];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with default label', () => {
    render(<FilterDropdown onChange={mockOnChange} />);
    
    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
  });

  test('renders with custom label', () => {
    render(<FilterDropdown label="Custom Label" onChange={mockOnChange} />);
    
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  test('renders "All Categories" as first option', () => {
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('');
    
    const allOption = screen.getByRole('option', { name: 'All Categories' });
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue('');
  });

  test('renders provided categories as options', () => {
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    mockCategories.forEach(category => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });
  });

  test('renders default categories when none provided', () => {
    render(<FilterDropdown onChange={mockOnChange} />);
    
    // Check for some default categories
    expect(screen.getByRole('option', { name: 'Indoor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Outdoor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Succulent' })).toBeInTheDocument();
  });

  test('displays selected category', () => {
    render(
      <FilterDropdown 
        categories={mockCategories} 
        selectedCategory="Indoor" 
        onChange={mockOnChange} 
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('Indoor');
  });

  test('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Indoor');
    
    expect(mockOnChange).toHaveBeenCalledWith('Indoor');
  });

  test('calls onChange with empty string when "All Categories" selected', async () => {
    const user = userEvent.setup();
    render(
      <FilterDropdown 
        categories={mockCategories} 
        selectedCategory="Indoor" 
        onChange={mockOnChange} 
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '');
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('handles missing onChange prop gracefully', async () => {
    const user = userEvent.setup();
    render(<FilterDropdown categories={mockCategories} />);
    
    const select = screen.getByRole('combobox');
    
    // Should not throw error
    expect(() => user.selectOptions(select, 'Indoor')).not.toThrow();
  });

  test('renders select arrow icon', () => {
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  test('associates label with select element', () => {
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    const label = screen.getByText('Filter by Category');
    
    expect(select).toHaveAttribute('id', 'category-filter');
    expect(label).toHaveAttribute('for', 'category-filter');
  });

  test('renders all options in correct order', () => {
    render(<FilterDropdown categories={mockCategories} onChange={mockOnChange} />);
    
    const options = screen.getAllByRole('option');
    
    expect(options[0]).toHaveTextContent('All Categories');
    expect(options[1]).toHaveTextContent('Indoor');
    expect(options[2]).toHaveTextContent('Outdoor');
    expect(options[3]).toHaveTextContent('Succulent');
  });
});