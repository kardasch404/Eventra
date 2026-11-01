const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/eventra';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Define schemas
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }), 'events');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    let admin = await User.findOne({ email: 'admin@eventra.co' });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('eventra', 10);
      admin = await User.create({
        email: 'admin@eventra.co',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isEmailVerified: true,
        roles: ['admin'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('  ✓ Admin user created: admin@eventra.co');
      console.log('  ✓ Password: eventra');
    } else {
      console.log('  ℹ Admin user already exists');
    }

    // Seed events
    console.log('🎫 Seeding events...');
    
    const events = [
      {
        id: 'evt-tech-conf-2026',
        title: 'Tech Conference 2026',
        slug: 'tech-conference-2026',
        description: [
          'Join us for the biggest technology conference of 2026!',
          'Featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
          'Learn about AI, Web3, Cloud Computing, and more.'
        ],
        summary: 'Annual technology conference featuring the latest innovations',
        category: 'Technology',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-08-15T09:00:00Z'),
          end: new Date('2026-08-17T18:00:00Z'),
          timezone: 'America/Los_Angeles',
          display: 'August 15-17, 2026',
          duration: '3 days'
        },
        location: { 
          mode: 'venue',
          venue: 'Moscone Convention Center',
          address: '747 Howard St',
          city: 'San Francisco',
          country: 'United States',
          coordinates: { lat: 37.7842, lng: -122.4016 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
          alt: 'Tech Conference',
          width: 1200,
          height: 630
        },
        capacity: 1000,
        bookedCount: 342,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '🎤', text: '50+ Expert Speakers' },
          { icon: '🛠️', text: 'Hands-on Workshops' },
          { icon: '🤝', text: 'Networking Events' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'evt-music-fest-2026',
        title: 'Summer Music Festival 2026',
        slug: 'music-festival-summer-2026',
        description: [
          'Three days of incredible live music in Central Park!',
          'Featuring top artists from around the world across multiple genres.',
          'Food trucks, art installations, and unforgettable experiences.'
        ],
        summary: 'The ultimate summer music experience',
        category: 'Music',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-07-20T12:00:00Z'),
          end: new Date('2026-07-22T23:00:00Z'),
          timezone: 'America/New_York',
          display: 'July 20-22, 2026',
          duration: '3 days'
        },
        location: { 
          mode: 'venue',
          venue: 'Central Park',
          address: 'Central Park West',
          city: 'New York',
          country: 'United States',
          coordinates: { lat: 40.7829, lng: -73.9654 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
          alt: 'Music Festival',
          width: 1200,
          height: 630
        },
        capacity: 5000,
        bookedCount: 2847,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '🎵', text: '30+ Artists' },
          { icon: '🎪', text: '4 Main Stages' },
          { icon: '🍔', text: 'Food & Drinks' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'evt-food-wine-2026',
        title: 'Food & Wine Expo',
        slug: 'food-wine-expo-2026',
        description: [
          'Taste the finest cuisines and wines from around the world.',
          'Meet celebrity chefs and attend exclusive cooking demonstrations.',
          'Wine tasting sessions from premium vineyards.'
        ],
        summary: 'A culinary journey for food enthusiasts',
        category: 'Food & Drink',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-09-10T10:00:00Z'),
          end: new Date('2026-09-10T20:00:00Z'),
          timezone: 'America/Los_Angeles',
          display: 'September 10, 2026',
          duration: '10 hours'
        },
        location: { 
          mode: 'venue',
          venue: 'LA Convention Center',
          address: '1201 S Figueroa St',
          city: 'Los Angeles',
          country: 'United States',
          coordinates: { lat: 34.0407, lng: -118.2695 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
          alt: 'Food Expo',
          width: 1200,
          height: 630
        },
        capacity: 800,
        bookedCount: 567,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '👨‍🍳', text: 'Celebrity Chefs' },
          { icon: '🍷', text: 'Wine Tasting' },
          { icon: '🍽️', text: 'Gourmet Samples' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'evt-marathon-2026',
        title: 'Chicago Marathon 2026',
        slug: 'marathon-city-run-2026',
        description: [
          'Annual city marathon for runners of all levels.',
          '42.195 km through the beautiful streets of Chicago.',
          'All proceeds go to local charities.'
        ],
        summary: 'Run for health and charity',
        category: 'Sports',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-10-05T06:00:00Z'),
          end: new Date('2026-10-05T14:00:00Z'),
          timezone: 'America/Chicago',
          display: 'October 5, 2026',
          duration: '8 hours'
        },
        location: { 
          mode: 'venue',
          venue: 'Grant Park',
          address: '337 E Randolph St',
          city: 'Chicago',
          country: 'United States',
          coordinates: { lat: 41.8758, lng: -87.6189 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200',
          alt: 'Marathon',
          width: 1200,
          height: 630
        },
        capacity: 2000,
        bookedCount: 1543,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '🏃', text: '42.195 KM Course' },
          { icon: '💰', text: 'Charity Fundraiser' },
          { icon: '🏅', text: 'Medals for All' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'evt-art-gallery-2026',
        title: 'Contemporary Art Exhibition',
        slug: 'art-gallery-opening-2026',
        description: [
          'Discover emerging artists and contemporary masterpieces.',
          'Gallery opening featuring 50+ artists from around the world.',
          'Wine and cheese reception included.'
        ],
        summary: 'Discover new artistic talent',
        category: 'Arts',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-11-12T18:00:00Z'),
          end: new Date('2026-11-12T22:00:00Z'),
          timezone: 'America/New_York',
          display: 'November 12, 2026',
          duration: '4 hours'
        },
        location: { 
          mode: 'venue',
          venue: 'Museum of Fine Arts',
          address: '465 Huntington Ave',
          city: 'Boston',
          country: 'United States',
          coordinates: { lat: 42.3394, lng: -71.0948 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
          alt: 'Art Gallery',
          width: 1200,
          height: 630
        },
        capacity: 300,
        bookedCount: 189,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '🎨', text: '50+ Artists' },
          { icon: '🖼️', text: 'Exclusive Pieces' },
          { icon: '🥂', text: 'Wine Reception' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'evt-business-net-2026',
        title: 'Business Networking Summit',
        slug: 'business-networking-night',
        description: [
          'Connect with industry leaders and entrepreneurs.',
          'Speed networking sessions and panel discussions.',
          'Complimentary refreshments and business card exchange.'
        ],
        summary: 'Expand your professional network',
        category: 'Business',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        dateTime: { 
          start: new Date('2026-07-25T17:00:00Z'),
          end: new Date('2026-07-25T21:00:00Z'),
          timezone: 'America/Los_Angeles',
          display: 'July 25, 2026',
          duration: '4 hours'
        },
        location: { 
          mode: 'venue',
          venue: 'Seattle Convention Center',
          address: '705 Pike St',
          city: 'Seattle',
          country: 'United States',
          coordinates: { lat: 47.6113, lng: -122.3331 }
        },
        hero: { 
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
          alt: 'Networking Event',
          width: 1200,
          height: 630
        },
        capacity: 150,
        bookedCount: 98,
        organizerId: admin._id.toString(),
        highlights: [
          { icon: '🤝', text: 'Speed Networking' },
          { icon: '💼', text: 'Industry Leaders' },
          { icon: '☕', text: 'Free Refreshments' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const eventData of events) {
      const exists = await Event.findOne({ slug: eventData.slug });
      if (!exists) {
        await Event.create(eventData);
        console.log(`  ✓ Created event: ${eventData.title}`);
      } else {
        console.log(`  ℹ Event already exists: ${eventData.title}`);
      }
    }

    const totalEvents = await Event.countDocuments();
    console.log(`\n✅ Seeding completed! Total events: ${totalEvents}`);
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@eventra.co');
    console.log('   Password: eventra');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
