const mongoose = require('mongoose');
const { v7: uuidv7 } = require('uuid');

mongoose.connect('mongodb://localhost:27017/eventra-dev').then(async () => {
  const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  const admin = await User.findOne({ email: 'admin@eventra.ma' });
  
  if (!admin) {
    console.log('❌ Admin not found');
    mongoose.connection.close();
    process.exit(1);
  }
  
  console.log('✅ Admin found:', admin.email);
  
  const testEvents = [
    {
      _id: uuidv7(),
      title: 'Jazz Concert Casablanca',
      slug: 'jazz-casa-' + Date.now(),
      description: { text: 'Amazing jazz concert' },
      summary: 'Jazz music event',
      category: 'Music',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      dateTime: { start: new Date(Date.now() + 86400000).toISOString() },
      location: { venue: 'Teatro Cervantes', city: 'Casablanca', country: 'Morocco' },
      hero: { url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', alt: 'Jazz' },
      capacity: 300,
      bookedCount: 50,
      organizer: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: uuidv7(),
      title: 'Marathon Marrakech',
      slug: 'marathon-marrakech-' + Date.now(),
      description: { text: 'Annual city marathon' },
      summary: 'Running event',
      category: 'Sports',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      dateTime: { start: new Date(Date.now() + 172800000).toISOString() },
      location: { venue: 'Jemaa el-Fnaa', city: 'Marrakech', country: 'Morocco' },
      hero: { url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', alt: 'Marathon' },
      capacity: 1000,
      bookedCount: 584,
      organizer: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: uuidv7(),
      title: 'Food Festival Rabat',
      slug: 'food-fest-rabat-' + Date.now(),
      description: { text: 'International food festival' },
      summary: 'Food event',
      category: 'Food & Drink',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      dateTime: { start: new Date(Date.now() + 259200000).toISOString() },
      location: { venue: 'Bouregreg Marina', city: 'Rabat', country: 'Morocco' },
      hero: { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', alt: 'Food' },
      capacity: 500,
      bookedCount: 200,
      organizer: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  
  for (const event of testEvents) {
    await Event.create(event);
    console.log('✅ Created:', event.title, '-', event.location.city);
  }
  
  const total = await Event.countDocuments({ status: 'PUBLISHED' });
  console.log('\n✅ Total PUBLISHED events:', total);
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
