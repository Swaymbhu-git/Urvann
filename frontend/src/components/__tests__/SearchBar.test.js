import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with default placeholder', () => {
    render(<SearchBar onChange={mockOnChange} />);
    
    expect(screen.getByPlaceholderText('Search plants by name...')).toBeInTheDocument();
  });

  test('renders with custom placeholder', () => {
    render(<SearchBar onChange={mockOnChange} placeholder="Custom placeholder" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  test('displays initial value', () => {
    render(<SearchBar value="initial value" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('initial value')).toBeInTheDocument();
  });

  test('calls onChange after debounce delay', async () => {
    const user = userEvent.setup();
    render(<SearchBar onChange={mockOnChange} debounceMs={100} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'snake');
    
    // Should not call immediately
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('snake');
    }, { timeout: 200 });
  });

  test('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  test('hides clear button when input is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  test('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="test value" onChange={mockOnChange} />);
    
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    await user.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('updates local value when prop value changes', () => {
    const { rerender } = render(<SearchBar value="initial" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
    
    rerender(<SearchBar value="updated" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });

  test('debounces multiple rapid changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar onChange={mockOnChange} debounceMs={100} />);
    
    const input = screen.getByRole('textbox');
    
    // Type multiple characters rapidly
    await user.type(input, 'abc');
    
    // Should only call onChange once after debounce
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('abc');
    }, { timeout: 200 });
  });

  test('handles empty onChange prop gracefully', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    
    // Should not throw error
    expect(() => user.type(input, 'test')).not.toThrow();
  });

  test('renders search icon', () => {
    render(<SearchBar onChange={mockOnChange} />);
    
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });
});