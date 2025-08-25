import { Schema, model } from 'mongoose';

const plantSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one category is required'
    }
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
plantSchema.index({ name: 'text' });
plantSchema.index({ categories: 1 });
plantSchema.index({ inStock: 1 });

// Virtual for formatted price
plantSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price}`;
});

// Ensure virtuals are included in JSON output
plantSchema.set('toJSON', { virtuals: true });
plantSchema.set('toObject', { virtuals: true });

// Method to check if plant matches search criteria
plantSchema.methods.matchesSearch = function(searchTerm) {
  if (!searchTerm) return true;
  return this.name.toLowerCase().includes(searchTerm.toLowerCase());
};

// Method to check if plant belongs to category
plantSchema.methods.belongsToCategory = function(category) {
  if (!category) return true;
  return this.categories.includes(category);
};

// Static method to find plants with search and filter
plantSchema.statics.findWithFilters = function(searchTerm, category) {
  const query = {};
  
  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' };
  }
  
  if (category) {
    query.categories = category;
  }
  
  return this.find(query).sort({ name: 1 });
};

// Static method to search plants (for backward compatibility)
plantSchema.statics.searchPlants = function(searchTerm, category) {
  let query = {};
  
  // Add text search if search term provided
  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' };
  }
  
  // Add category filter if category provided
  if (category && category !== 'all') {
    query.categories = { $in: [category] };
  }
  
  return this.find(query).sort({ name: 1 });
};

export default model('Plant', plantSchema);