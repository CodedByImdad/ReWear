/* ReWear development seed script.
 * Run with: npm run seed   (from the project root or server/)
 * Drops only the collections it owns and inserts fresh sample data.
 * Never runs automatically when the server starts.
 */
const path = require('path');
const env = require('../config/env');
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log(`Connected to ${env.MONGO_URI}`);

  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Request.deleteMany({}),
  ]);

  const users = await User.create([
    { name: 'Admin', email: 'admin@rewear.test', password: 'Admin@123', role: 'admin' },
    { name: 'Aarav Sharma', email: 'aarav@rewear.test', password: 'Password@123' },
    { name: 'Diya Patil', email: 'diya@rewear.test', password: 'Password@123' },
    { name: 'Rohan Desai', email: 'rohan@rewear.test', password: 'Password@123' },
  ]);

  const [admin, aarav, diya, rohan] = users;

  const items = await Item.create([
    {
      owner: aarav._id,
      title: 'Blue Denim Jacket',
      description:
        'Gently worn denim jacket, size M. No tears or stains. Perfect for casual outings and layering in cooler weather.',
      category: 'Jackets',
      size: 'M',
      condition: 'Good',
      gender: 'Unisex',
      location: 'Pune, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
    {
      owner: aarav._id,
      title: 'White Cotton Shirt',
      description:
        'Formal white cotton shirt worn only twice. Size L, ironed and neatly packed. Ideal for interviews and office wear.',
      category: 'Shirts',
      size: 'L',
      condition: 'Like New',
      gender: 'Men',
      location: 'Pune, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: diya._id,
      title: 'Floral Summer Dress',
      description:
        'Light floral dress perfect for summer. Size S, machine washed, colour still vibrant. Small pocket on the left side.',
      category: 'Dresses',
      size: 'S',
      condition: 'Good',
      gender: 'Women',
      location: 'Mumbai, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
    {
      owner: diya._id,
      title: 'Black Skinny Jeans',
      description:
        'Black skinny jeans, size 28 equivalent M. Worn for one season, minor fading at the knees but no damage.',
      category: 'Jeans',
      size: 'M',
      condition: 'Used',
      gender: 'Women',
      location: 'Mumbai, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: rohan._id,
      title: 'Red Cotton T-Shirt',
      description:
        'Brand new red crew-neck t-shirt with tags still attached. Size XL. Gifted in the wrong size, never worn.',
      category: 'T-Shirts',
      size: 'XL',
      condition: 'New',
      gender: 'Men',
      location: 'Nashik, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
    {
      owner: rohan._id,
      title: 'Running Shoes',
      description:
        'Grey running shoes, EU 42. Used for light jogging for two months, soles still in good shape. Cleaned and sanitised.',
      category: 'Shoes',
      size: 'L',
      condition: 'Good',
      gender: 'Unisex',
      location: 'Nashik, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: aarav._id,
      title: 'Casual Chinos',
      description:
        'Beige chinos, size 32. Comfortable stretch fabric, no fading. Worn to office for about six months.',
      category: 'Pants',
      size: 'L',
      condition: 'Good',
      gender: 'Men',
      location: 'Pune, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
    {
      owner: diya._id,
      title: 'Leather Belt',
      description:
        'Brown leather belt, one size. Small scratch near the buckle, otherwise sturdy. A wardrobe staple.',
      category: 'Accessories',
      size: 'One Size',
      condition: 'Used',
      gender: 'Unisex',
      location: 'Mumbai, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: rohan._id,
      title: 'Winter Hoodie',
      description:
        'Navy blue hoodie with fleece lining, size L. Warm and cosy, used for one winter, no pilling.',
      category: 'Jackets',
      size: 'L',
      condition: 'Like New',
      gender: 'Unisex',
      location: 'Nashik, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
    {
      owner: diya._id,
      title: 'Kids Printed T-Shirt',
      description:
        'Colourful printed t-shirt for kids aged 6-8. Soft cotton, washes well, no fading of the print.',
      category: 'T-Shirts',
      size: 'S',
      condition: 'Good',
      gender: 'Kids',
      location: 'Mumbai, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: aarav._id,
      title: 'Formal Trousers',
      description:
        'Charcoal formal trousers, size 32. Tailored fit, dry cleaned, suitable for interviews and functions.',
      category: 'Pants',
      size: 'L',
      condition: 'Like New',
      gender: 'Men',
      location: 'Pune, Maharashtra',
      type: 'Donation',
      status: 'Available',
    },
    {
      owner: rohan._id,
      title: 'Checked Casual Shirt',
      description:
        'Green checked casual shirt, size M. Soft flannel fabric, worn a handful of times, buttons all intact.',
      category: 'Shirts',
      size: 'M',
      condition: 'Good',
      gender: 'Men',
      location: 'Nashik, Maharashtra',
      type: 'Exchange',
      status: 'Available',
    },
  ]);

  // One accepted donation request so the dashboard/admin views have history.
  const donatedShirt = items.find((i) => i.title === 'White Cotton Shirt');
  await Request.create({
    item: donatedShirt._id,
    requester: diya._id,
    owner: aarav._id,
    type: 'Donation',
    message: 'I need a formal shirt for my upcoming campus placement interviews.',
    status: 'Accepted',
  });
  donatedShirt.status = 'Requested';
  await donatedShirt.save();

  // One pending exchange request with an offered item.
  const jacket = items.find((i) => i.title === 'Blue Denim Jacket');
  const hoodie = items.find((i) => i.title === 'Winter Hoodie');
  const hoodieOwnedByRohan = hoodie.owner.equals(rohan._id);
  if (hoodieOwnedByRohan) {
    const req = await Request.create({
      item: jacket._id,
      requester: rohan._id,
      owner: aarav._id,
      type: 'Exchange',
      message: 'Would you like to swap your denim jacket for my winter hoodie?',
      offeredItem: hoodie._id,
      status: 'Pending',
    });
    jacket.status = 'Requested';
    hoodie.status = 'Requested';
    await Promise.all([jacket.save(), hoodie.save()]);
    void req;
  }

  console.log('Seed complete.');
  console.log('Admin login : admin@rewear.test / Admin@123');
  console.log('User logins : aarav@rewear.test, diya@rewear.test, rohan@rewear.test / Password@123');
  console.log(`Created ${users.length} users, ${items.length} items, 2 requests.`);
  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
