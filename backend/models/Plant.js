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

plantSchema.index({ name: 'text' });
plantSchema.index({ categories: 1 });
plantSchema.index({ inStock: 1 });


plantSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price}`;
});

 
plantSchema.set('toJSON', { virtuals: true });
plantSchema.set('toObject', { virtuals: true });


plantSchema.methods.matchesSearch = function(searchTerm) {
  if (!searchTerm) return true;
  return this.name.toLowerCase().includes(searchTerm.toLowerCase());
};


plantSchema.methods.belongsToCategory = function(category) {
  if (!category) return true;
  return this.categories.includes(category);
};


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


plantSchema.statics.searchPlants = function(searchTerm, category) {
  let query = {};
  

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' };
  }
  

  if (category && category !== 'all') {
    query.categories = { $in: [category] };
  }
  
  return this.find(query).sort({ name: 1 });
};

export default model('Plant', plantSchema);