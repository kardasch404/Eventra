const mongoose = require('mongoose');
const { v7: uuidv7 } = require('uuid');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/eventra-dev').then(async () => {
  console.log('🔌 Connected to database\n');
  
  const User = mongoose.model('User', new mongoose.Schema({}, {strict: false}));
  const Event = mongoose.model('Event', new mongoose.Schema({}, {strict: false}));
  
  // Check if admin exists
  let admin = await User.findOne({ email: 'admin@eventra.ma' });
  
  if (!admin) {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    admin = await User.create({
      _id: uuidv7(),
      email: 'admin@eventra.ma',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      roles: ['admin'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin created:', admin.email);
  } else {
    console.log('✅ Admin exists:', admin.email);
  }
  
  // Create events
  console.log('\n📝 Creating events...\n');
  
  const cities = ['Casablanca', 'Marrakech', 'Rabat', 'Fes', 'Tangier', 'Agadir'];
  const categories = ['Music', 'Sports', 'Food & Drink', 'Arts', 'Business', 'Nightlife'];
  
  const events = [];
  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const category = categories[i % categories.length];
    const days = (i + 1) * 3;
    
    events.push({
      _id: uuidv7(),
      title: `${category} Event in ${city} ${i + 1}`,
      slug: `event-${city.toLowerCase()}-${i}-${Date.now()}`,
      description: { text: `Amazing ${category.toLowerCase()} event in ${city}` },
      summary: `${category} event`,
      category: category,
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      dateTime: {
        start: new Date(Date.now() + days * 86400000).toISOString(),
        end: null,
      },
      location: {
        venue: `${city} Venue`,
        city: city,
        country: 'Morocco',
      },
      hero: {
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        alt: category,
      },
      capacity: 100 + (i * 50),
      bookedCount: Math.floor(Math.random() * 50),
      organizer: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  for (const event of events) {
    await Event.create(event);
    console.log(`✅ ${event.title} - ${event.location.city}`);
  }
  
  const total = await Event.countDocuments({ status: 'PUBLISHED' });
  console.log(`\n🎉 Total events created: ${total}`);
  
  // Show distribution
  const byCity = await Event.aggregate([
    { $match: { status: 'PUBLISHED' } },
    { $group: { _id: '$location.city', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  console.log('\n📍 Events by City:');
  byCity.forEach(c => console.log(`  ${c._id}: ${c.count}`));
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
