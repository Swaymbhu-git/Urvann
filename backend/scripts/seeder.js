import mongoose from 'mongoose';
const { connect, connection } = mongoose;
import { config } from 'dotenv';
import Plant from '../models/Plant.js';

config();

const plants = [
  {
    name: "Snake Plant Laurentii",
    price: 899,
    categories: ["Indoor", "Air Purifying", "Low Maintenance"],
    inStock: true
  },
  {
    name: "Money Plant Golden",
    price: 399,
    categories: ["Indoor", "Home Decor", "Beginner Friendly"],
    inStock: true
  },
  {
    name: "Echeveria Succulent",
    price: 450,
    categories: ["Outdoor", "Succulent", "Low Water"],
    inStock: false
  },
  {
    name: "Fiddle Leaf Fig",
    price: 1299,
    categories: ["Indoor", "Home Decor", "Statement Plant"],
    inStock: true
  },
  {
    name: "Peace Lily",
    price: 699,
    categories: ["Indoor", "Air Purifying", "Flowering"],
    inStock: true
  },
  {
    name: "Rubber Plant",
    price: 799,
    categories: ["Indoor", "Home Decor", "Low Maintenance"],
    inStock: true
  },
  {
    name: "Aloe Vera",
    price: 349,
    categories: ["Indoor", "Succulent", "Medicinal"],
    inStock: true
  },
  {
    name: "Monstera Deliciosa",
    price: 1199,
    categories: ["Indoor", "Home Decor", "Statement Plant"],
    inStock: true
  },
  {
    name: "Spider Plant",
    price: 299,
    categories: ["Indoor", "Air Purifying", "Beginner Friendly"],
    inStock: true
  },
  {
    name: "ZZ Plant",
    price: 649,
    categories: ["Indoor", "Low Maintenance", "Air Purifying"],
    inStock: true
  },
  {
    name: "Pothos Golden",
    price: 249,
    categories: ["Indoor", "Beginner Friendly", "Trailing"],
    inStock: true
  },
  {
    name: "Jade Plant",
    price: 399,
    categories: ["Indoor", "Succulent", "Good Luck"],
    inStock: true
  },
  {
    name: "Boston Fern",
    price: 549,
    categories: ["Indoor", "Air Purifying", "Humidity Loving"],
    inStock: false
  },
  {
    name: "Cactus Barrel",
    price: 299,
    categories: ["Indoor", "Succulent", "Low Water"],
    inStock: true
  },
  {
    name: "Philodendron Heartleaf",
    price: 349,
    categories: ["Indoor", "Trailing", "Beginner Friendly"],
    inStock: true
  },
  {
    name: "Dracaena Marginata",
    price: 899,
    categories: ["Indoor", "Air Purifying", "Statement Plant"],
    inStock: true
  },
  {
    name: "English Ivy",
    price: 399,
    categories: ["Indoor", "Trailing", "Air Purifying"],
    inStock: true
  },
  {
    name: "Bamboo Palm",
    price: 1099,
    categories: ["Indoor", "Air Purifying", "Tropical"],
    inStock: true
  },
  {
    name: "Haworthia Zebra",
    price: 249,
    categories: ["Indoor", "Succulent", "Small Space"],
    inStock: true
  },
  {
    name: "Calathea Orbifolia",
    price: 799,
    categories: ["Indoor", "Prayer Plant", "Humidity Loving"],
    inStock: false
  },
  {
    name: "Bird of Paradise",
    price: 1599,
    categories: ["Indoor", "Statement Plant", "Tropical"],
    inStock: true
  },
  {
    name: "String of Pearls",
    price: 449,
    categories: ["Indoor", "Succulent", "Trailing"],
    inStock: true
  },
  {
    name: "Areca Palm",
    price: 999,
    categories: ["Indoor", "Air Purifying", "Tropical"],
    inStock: true
  },
  {
    name: "Croton Petra",
    price: 649,
    categories: ["Indoor", "Colorful", "Statement Plant"],
    inStock: true
  },
  {
    name: "Pilea Peperomioides",
    price: 399,
    categories: ["Indoor", "Small Space", "Trendy"],
    inStock: true
  },
  {
    name: "Lavender Plant",
    price: 549,
    categories: ["Outdoor", "Fragrant", "Flowering"],
    inStock: true
  },
  {
    name: "Rosemary Herb",
    price: 299,
    categories: ["Outdoor", "Herbs", "Culinary"],
    inStock: true
  },
  {
    name: "Marigold Flowers",
    price: 199,
    categories: ["Outdoor", "Flowering", "Colorful"],
    inStock: true
  },
  {
    name: "Basil Sweet",
    price: 249,
    categories: ["Outdoor", "Herbs", "Culinary"],
    inStock: true
  },
  {
    name: "Mint Plant",
    price: 199,
    categories: ["Outdoor", "Herbs", "Fragrant"],
    inStock: true
  },
  {
    name: "Geranium Red",
    price: 349,
    categories: ["Outdoor", "Flowering", "Colorful"],
    inStock: false
  },
  {
    name: "Petunias Mixed",
    price: 299,
    categories: ["Outdoor", "Flowering", "Seasonal"],
    inStock: true
  },
  {
    name: "Tomato Cherry",
    price: 399,
    categories: ["Outdoor", "Edible", "Vegetable"],
    inStock: true
  },
  {
    name: "Sunflower Dwarf",
    price: 249,
    categories: ["Outdoor", "Flowering", "Cheerful"],
    inStock: true
  },
  {
    name: "Bougainvillea Pink",
    price: 699,
    categories: ["Outdoor", "Flowering", "Climbing"],
    inStock: true
  },
  {
    name: "Canna Lily",
    price: 549,
    categories: ["Outdoor", "Flowering", "Tropical"],
    inStock: true
  },
  {
    name: "Hibiscus Red",
    price: 799,
    categories: ["Outdoor", "Flowering", "Tropical"],
    inStock: true
  },
  {
    name: "Jasmine Night",
    price: 649,
    categories: ["Outdoor", "Fragrant", "Flowering"],
    inStock: true
  },
  {
    name: "Rose Bush Pink",
    price: 899,
    categories: ["Outdoor", "Flowering", "Classic"],
    inStock: false
  },
  {
    name: "Lemon Grass",
    price: 299,
    categories: ["Outdoor", "Herbs", "Culinary"],
    inStock: true
  },
  {
    name: "Curry Leaf Plant",
    price: 399,
    categories: ["Outdoor", "Herbs", "Culinary"],
    inStock: true
  },
  {
    name: "Neem Tree Sapling",
    price: 499,
    categories: ["Outdoor", "Medicinal", "Tree"],
    inStock: true
  },
  {
    name: "Tulsi Holy Basil",
    price: 249,
    categories: ["Outdoor", "Medicinal", "Sacred"],
    inStock: true
  },
  {
    name: "Ficus Bonsai",
    price: 1299,
    categories: ["Indoor", "Bonsai", "Artistic"],
    inStock: true
  },
  {
    name: "Adenium Desert Rose",
    price: 799,
    categories: ["Indoor", "Succulent", "Flowering"],
    inStock: true
  },
  {
    name: "Anthurium Red",
    price: 899,
    categories: ["Indoor", "Flowering", "Tropical"],
    inStock: true
  },
  {
    name: "Begonia Wax",
    price: 349,
    categories: ["Indoor", "Flowering", "Colorful"],
    inStock: true
  },
  {
    name: "Caladium Fancy",
    price: 549,
    categories: ["Indoor", "Colorful", "Foliage"],
    inStock: false
  },
  {
    name: "Dieffenbachia Camille",
    price: 699,
    categories: ["Indoor", "Air Purifying", "Statement Plant"],
    inStock: true
  },
  {
    name: "Fittonia Nerve Plant",
    price: 299,
    categories: ["Indoor", "Small Space", "Colorful"],
    inStock: true
  },
  {
    name: "Hoya Carnosa",
    price: 649,
    categories: ["Indoor", "Trailing", "Flowering"],
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Plant.deleteMany({});
    console.log('Cleared existing plants');

    await Plant.insertMany(plants);
    console.log(`Successfully seeded ${plants.length} plants`);

    await connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

  seedDatabase();


export default { plants, seedDatabase };