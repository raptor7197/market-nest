import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const placeholderProducts = [
  {
    name: 'Utility Overshirt',
    description: 'Structured cotton overshirt with matte hardware and a relaxed fit for everyday layering.',
    price: 79,
    category: 'clothing',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Metro Runner',
    description: 'Lightweight sneakers with contrast paneling and a cushioned sole for all-day wear.',
    price: 109,
    category: 'shoes',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Canvas Weekender',
    description: 'Large carryall with reinforced handles, zip closure, and enough room for a short trip.',
    price: 95,
    category: 'bags',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Orbit Chain',
    description: 'Minimal polished chain designed to stack easily with other everyday accessories.',
    price: 42,
    category: 'jewelry',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Signal Cap',
    description: 'Low-profile cap with embroidered front mark and adjustable back strap.',
    price: 28,
    category: 'accessories',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Studio Tote',
    description: 'Clean-lined daily tote with interior organization and a durable textured finish.',
    price: 68,
    category: 'bags',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Drift Hoodie',
    description: 'Midweight hoodie with dropped shoulders, soft brushed interior, and subtle seam detailing.',
    price: 64,
    category: 'clothing',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Contour Loafer',
    description: 'Modern slip-on loafer with squared toe profile and smooth leather upper.',
    price: 122,
    category: 'shoes',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const seedMarketplace = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to seed the marketplace');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const brandEmail = 'seed.brand@marketnest.demo';
  let brand = await User.findOne({ email: brandEmail });

  if (!brand) {
    brand = await User.create({
      email: brandEmail,
      password: 'SeedBrand123!',
      name: 'MarketNest Studio',
      role: 'brand',
    });
  }

  await Product.deleteMany({ brand: brand._id, description: /seeded placeholder/i });

  const products = placeholderProducts.map((product) => ({
    ...product,
    description: `${product.description} Seeded placeholder item for marketplace previews and deployment verification.`,
    brand: brand._id,
  }));

  await Product.insertMany(products);

  console.log(`Seeded ${products.length} marketplace products for ${brand.email}`);
  console.log('Brand login: seed.brand@marketnest.demo / SeedBrand123!');
};

seedMarketplace()
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
