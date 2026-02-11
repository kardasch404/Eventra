import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';

/**
 * Helper function to create future dates relative to current date
 */
const createFutureDate = (daysFromNow: number, hour: number, minute = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
};

/**
 * Helper function to create specific date
 */
const createSpecificDate = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): Date => {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

export interface SeedEvent {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: string;
  type: EventType;
  status: EventStatus;
  hero: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  dateTime: {
    start: Date;
    end: Date;
    timezone: string;
    display: string;
    duration: string;
  };
  location: {
    mode: string;
    country: string;
    city: string;
    address?: string;
    venue?: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity: number;
  highlights: { icon: string; text: string }[];
}

export const EXTENDED_SEED_EVENTS: SeedEvent[] = [
  // MUSIC EVENTS
  {
    slug: 'jazz-night-casablanca-2026',
    title: 'Casablanca Jazz Night Under the Stars',
    summary: 'Experience an unforgettable evening of smooth jazz with international and local artists in the heart of Casablanca.',
    description: [
      'Join us for an enchanting night of jazz music featuring renowned international and Moroccan jazz artists.',
      'The event will take place in a stunning outdoor venue with perfect acoustics and ambiance.',
      'Lineup includes: Smooth jazz ensembles, contemporary jazz fusion, traditional Moroccan jazz crossover.',
      'Food trucks and beverage stations available throughout the evening.',
      'VIP packages include reserved seating and meet-and-greet with artists.',
      'Bring your friends and family for an evening of world-class music!',
    ],
    category: 'Music',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=450&fit=crop',
      alt: 'Jazz Night Casablanca',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 3, 15, 20, 0),
      end: createSpecificDate(2026, 3, 15, 23, 30),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Mar 15 · 8:00 PM - 11:30 PM GMT+1',
      duration: '3.5 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Marina Beach Club',
      address: 'Boulevard de la Corniche, Casablanca',
      coordinates: { lat: 33.609, lng: -7.6364 },
    },
    capacity: 500,
    highlights: [
      { icon: '🎷', text: 'International jazz artists' },
      { icon: '🌟', text: 'Outdoor venue' },
      { icon: '🍷', text: 'Food & drinks available' },
      { icon: '🎫', text: 'VIP packages' },
      { icon: '📍', text: 'In person' },
    ],
  },

  {
    slug: 'marrakech-electronic-festival-2026',
    title: 'Marrakech Electronic Music Festival',
    summary: 'The biggest electronic music festival in Morocco with top DJs from around the world.',
    description: [
      'Marrakech Electronic Music Festival returns for its 5th edition!',
      '2 days of non-stop electronic music featuring house, techno, and EDM.',
      'Headliners include world-renowned DJs and producers.',
      'Multiple stages with different vibes: Main Stage, Underground Club, Chill Zone.',
      'Festival camping available for multi-day attendees.',
      'Food court with international and local cuisine.',
      'Art installations and interactive experiences.',
    ],
    category: 'Music',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop',
      alt: 'Marrakech Electronic Festival',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 5, 22, 18, 0),
      end: createSpecificDate(2026, 5, 24, 3, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, May 22 - Sun, May 24 · 6:00 PM - 3:00 AM',
      duration: '2 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Oasiria Water Park',
      address: 'Route de l\'Ourika, Marrakech',
      coordinates: { lat: 31.5725, lng: -8.0708 },
    },
    capacity: 8000,
    highlights: [
      { icon: '🎧', text: 'Top international DJs' },
      { icon: '🎪', text: 'Multiple stages' },
      { icon: '🏕️', text: 'Camping available' },
      { icon: '🎨', text: 'Art installations' },
      { icon: '⏰', text: '2 days' },
    ],
  },

  // NIGHTLIFE EVENTS
  {
    slug: 'rooftop-party-rabat-summer-2026',
    title: 'Rabat Rooftop Summer Party',
    summary: 'Dance the night away at Rabat\'s most exclusive rooftop venue with panoramic city views.',
    description: [
      'Join us for the hottest summer party in Rabat!',
      'Enjoy stunning 360-degree views of the city from our rooftop venue.',
      'Live DJ sets featuring the best of house, R&B, and hip-hop.',
      'Premium cocktail bar with signature drinks.',
      'Dress code: Smart casual / Chic',
      'Limited capacity - book your tickets now!',
      'Free welcome drink for early birds.',
    ],
    category: 'Nightlife',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop',
      alt: 'Rooftop Party Rabat',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 7, 4, 22, 0),
      end: createSpecificDate(2026, 7, 5, 4, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Jul 4 · 10:00 PM - 4:00 AM',
      duration: '6 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Rabat',
      venue: 'Sky Lounge Rabat',
      address: 'Avenue Mohammed V, Rabat',
      coordinates: { lat: 34.0209, lng: -6.8416 },
    },
    capacity: 300,
    highlights: [
      { icon: '🌃', text: 'Rooftop venue' },
      { icon: '🎵', text: 'Live DJ' },
      { icon: '🍸', text: 'Premium cocktails' },
      { icon: '👗', text: 'Dress code: Smart casual' },
      { icon: '🎉', text: 'Exclusive event' },
    ],
  },

  {
    slug: 'tangier-nightclub-opening-2026',
    title: 'Grand Opening: Elements Nightclub Tangier',
    summary: 'Be part of history at the grand opening of Tangier\'s most anticipated nightclub.',
    description: [
      'Elements Nightclub opens its doors for the first time!',
      'State-of-the-art sound system and lighting.',
      'Special guest DJs flown in from Ibiza.',
      'VIP tables available with bottle service.',
      'Photo booth and professional photography.',
      'Opening night special: 50% off all drinks until midnight.',
      '21+ event - ID required.',
    ],
    category: 'Nightlife',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=450&fit=crop',
      alt: 'Elements Nightclub Opening',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 10, 23, 0),
      end: createSpecificDate(2026, 4, 11, 5, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Apr 10 · 11:00 PM - 5:00 AM',
      duration: '6 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Tangier',
      venue: 'Elements Nightclub',
      address: 'Boulevard Mohammed VI, Tangier',
      coordinates: { lat: 35.7595, lng: -5.834 },
    },
    capacity: 600,
    highlights: [
      { icon: '🎉', text: 'Grand opening' },
      { icon: '🎧', text: 'Ibiza DJs' },
      { icon: '🥂', text: 'Bottle service' },
      { icon: '📸', text: 'Photo booth' },
      { icon: '🔞', text: '21+' },
    ],
  },

  // ARTS EVENTS
  {
    slug: 'marrakech-contemporary-art-exhibition-2026',
    title: 'Marrakech Contemporary Art Exhibition',
    summary: 'Discover cutting-edge contemporary art from Moroccan and international artists.',
    description: [
      'A curated exhibition of contemporary art featuring works from over 50 artists.',
      'Mediums include painting, sculpture, photography, digital art, and mixed media.',
      'Opening night reception with artists in attendance.',
      'Guided tours available in English, French, and Arabic.',
      'Art talks and panel discussions throughout the exhibition period.',
      'Works available for purchase - supporting local and emerging artists.',
      'Free admission for students and art professionals.',
    ],
    category: 'Arts',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1578926078083-ea4ec1d9dc0e?w=800&h=450&fit=crop',
      alt: 'Contemporary Art Exhibition',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 5, 18, 0),
      end: createSpecificDate(2026, 5, 5, 20, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sun, Apr 5 - Tue, May 5 · Daily 6:00 PM - 8:00 PM',
      duration: '1 month',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Musée d\'Art Contemporain',
      address: 'Rue Yves Saint Laurent, Marrakech',
      coordinates: { lat: 31.6295, lng: -7.9811 },
    },
    capacity: 200,
    highlights: [
      { icon: '🎨', text: '50+ artists' },
      { icon: '🖼️', text: 'Multiple mediums' },
      { icon: '🎭', text: 'Artist meet & greets' },
      { icon: '🗣️', text: 'Guided tours' },
      { icon: '🎓', text: 'Free for students' },
    ],
  },

  {
    slug: 'fes-traditional-crafts-festival-2026',
    title: 'Fes Traditional Crafts & Arts Festival',
    summary: 'Celebrate Moroccan heritage with demonstrations of traditional craftsmanship and art.',
    description: [
      'Experience the rich tradition of Moroccan craftsmanship in the heart of Fes.',
      'Live demonstrations: Pottery making, leather tanning, metalwork, carpet weaving, zellige tile making.',
      'Workshops where you can learn traditional techniques.',
      'Artisan marketplace to purchase authentic handmade goods.',
      'Traditional music and dance performances.',
      'Food stalls featuring local Fassi cuisine.',
      'Family-friendly event celebrating Moroccan heritage.',
    ],
    category: 'Arts',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=450&fit=crop',
      alt: 'Traditional Crafts Festival',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 9, 10, 10, 0),
      end: createSpecificDate(2026, 9, 13, 19, 0),
      timezone: 'Africa/Casablanca',
      display: 'Thu, Sep 10 - Sun, Sep 13 · 10:00 AM - 7:00 PM',
      duration: '4 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Fes',
      venue: 'Bab Makina',
      address: 'Fes el-Jdid, Fes',
      coordinates: { lat: 34.0515, lng: -4.9998 },
    },
    capacity: 5000,
    highlights: [
      { icon: '🏺', text: 'Live demonstrations' },
      { icon: '🛠️', text: 'Hands-on workshops' },
      { icon: '🛍️', text: 'Artisan marketplace' },
      { icon: '🎭', text: 'Cultural performances' },
      { icon: '👨‍👩‍👧‍👦', text: 'Family-friendly' },
    ],
  },

  // HOLIDAY EVENTS
  {
    slug: 'new-year-eve-gala-casablanca-2026',
    title: 'New Year\'s Eve Gala Dinner & Celebration',
    summary: 'Ring in 2027 in style with a luxurious gala dinner, live entertainment, and fireworks.',
    description: [
      'Celebrate the arrival of 2027 at the most anticipated event of the year!',
      '5-course gourmet dinner prepared by award-winning chefs.',
      'Open bar with premium spirits and champagne toast at midnight.',
      'Live band and DJ entertainment all night long.',
      'Spectacular fireworks display at midnight.',
      'Black-tie optional dress code.',
      'Limited seating - reserve your table now!',
      'Valet parking included.',
    ],
    category: 'Holiday',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=450&fit=crop',
      alt: 'New Year Eve Gala',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 12, 31, 20, 0),
      end: createSpecificDate(2027, 1, 1, 2, 0),
      timezone: 'Africa/Casablanca',
      display: 'Wed, Dec 31 · 8:00 PM - 2:00 AM',
      duration: '6 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Four Seasons Hotel Casablanca',
      address: 'Boulevard de la Corniche, Casablanca',
      coordinates: { lat: 33.609, lng: -7.6364 },
    },
    capacity: 400,
    highlights: [
      { icon: '🍽️', text: '5-course gourmet dinner' },
      { icon: '🥂', text: 'Open bar & champagne' },
      { icon: '🎵', text: 'Live entertainment' },
      { icon: '🎆', text: 'Fireworks at midnight' },
      { icon: '🤵', text: 'Black-tie optional' },
    ],
  },

  // DATING/SOCIAL EVENTS
  {
    slug: 'speed-dating-marrakech-young-professionals-2026',
    title: 'Speed Dating Night for Young Professionals - Marrakech',
    summary: 'Meet potential romantic partners in a fun, relaxed speed dating event for professionals aged 25-40.',
    description: [
      'Looking for love? Join our speed dating event designed for young professionals!',
      'Format: 7-minute conversations with multiple potential matches.',
      'Age range: 25-40 years old.',
      'Professional, educated singles only.',
      'Welcome drink included.',
      'Matching algorithm - receive your matches via email after the event.',
      'Ice breaker games and socializing after speed dating rounds.',
      'Limited spots - equal male/female ratio maintained.',
    ],
    category: 'Social',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=450&fit=crop',
      alt: 'Speed Dating Event',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 3, 28, 19, 0),
      end: createSpecificDate(2026, 3, 28, 22, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Mar 28 · 7:00 PM - 10:00 PM',
      duration: '3 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Le Comptoir Darna',
      address: 'Avenue Echouhada, Marrakech',
      coordinates: { lat: 31.6295, lng: -7.9811 },
    },
    capacity: 60,
    highlights: [
      { icon: '💕', text: 'Meet 15+ singles' },
      { icon: '💼', text: 'Young professionals' },
      { icon: '🍹', text: 'Welcome drink' },
      { icon: '📧', text: 'Email matches' },
      { icon: '🎯', text: 'Ages 25-40' },
    ],
  },

  // HOBBIES EVENTS
  {
    slug: 'photography-workshop-essaouira-2026',
    title: 'Landscape Photography Workshop - Essaouira Coastline',
    summary: 'Learn professional landscape photography techniques while capturing the beauty of Essaouira.',
    description: [
      'Join professional photographer Hassan Alami for a full-day photography workshop.',
      'Learn advanced techniques: Composition, lighting, long exposure, HDR.',
      'Hands-on shooting sessions at the best locations in Essaouira.',
      'Locations include: Beach, old medina, port, ramparts.',
      'Post-processing workshop using Lightroom and Photoshop.',
      'All skill levels welcome - personalized instruction.',
      'Camera required (DSLR or mirrorless recommended).',
      'Lunch and refreshments included.',
    ],
    category: 'Hobbies',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=450&fit=crop',
      alt: 'Photography Workshop',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 12, 8, 0),
      end: createSpecificDate(2026, 4, 12, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sun, Apr 12 · 8:00 AM - 6:00 PM',
      duration: '10 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Essaouira',
      venue: 'Essaouira Beach & Medina',
      address: 'Essaouira, Morocco',
      coordinates: { lat: 31.5125, lng: -9.7595 },
    },
    capacity: 15,
    highlights: [
      { icon: '📸', text: 'Professional instructor' },
      { icon: '🏖️', text: 'Stunning locations' },
      { icon: '💻', text: 'Post-processing training' },
      { icon: '🍽️', text: 'Lunch included' },
      { icon: '👥', text: 'Small group' },
    ],
  },

  {
    slug: 'board-game-night-rabat-2026',
    title: 'Board Game Night - Strategy & Fun',
    summary: 'Join fellow board game enthusiasts for an evening of strategy games, party games, and fun!',
    description: [
      'Calling all board game lovers!',
      'Huge selection of games: Catan, Ticket to Ride, Pandemic, Codenames, and many more.',
      'Beginner-friendly - we\'ll teach you any game.',
      'Meet new friends who share your passion for gaming.',
      'Snacks and beverages available for purchase.',
      'Game library with 100+ titles.',
      'Tournaments and prizes for competitive players.',
      'Cozy, air-conditioned venue.',
    ],
    category: 'Hobbies',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=450&fit=crop',
      alt: 'Board Game Night',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createFutureDate(10, 18, 0),
      end: createFutureDate(10, 23, 0),
      timezone: 'Africa/Casablanca',
      display: 'Every Friday · 6:00 PM - 11:00 PM',
      duration: '5 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Rabat',
      venue: 'Game Zone Rabat',
      address: 'Avenue Allal Ben Abdellah, Rabat',
      coordinates: { lat: 34.0209, lng: -6.8416 },
    },
    capacity: 50,
    highlights: [
      { icon: '🎲', text: '100+ games' },
      { icon: '🏆', text: 'Tournaments' },
      { icon: '🤝', text: 'Meet gamers' },
      { icon: '🍕', text: 'Snacks available' },
      { icon: '❄️', text: 'Air-conditioned' },
    ],
  },

  // BUSINESS EVENTS
  {
    slug: 'tech-startup-pitch-competition-casablanca-2026',
    title: 'Tech Startup Pitch Competition Casablanca',
    summary: 'Watch innovative startups pitch their ideas to investors and compete for funding and prizes.',
    description: [
      'The biggest startup pitch competition in Morocco!',
      '15 selected startups will pitch to a panel of VCs and angel investors.',
      'Total prize pool: 500,000 MAD + mentorship packages.',
      '1st place: 250,000 MAD + 3 months accelerator program.',
      '2nd place: 150,000 MAD + legal services.',
      '3rd place: 100,000 MAD + marketing package.',
      'Networking reception after pitches.',
      'Open to all - free admission.',
      'Perfect for entrepreneurs, investors, and startup enthusiasts.',
    ],
    category: 'Business',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop',
      alt: 'Startup Pitch Competition',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 6, 18, 14, 0),
      end: createSpecificDate(2026, 6, 18, 19, 0),
      timezone: 'Africa/Casablanca',
      display: 'Thu, Jun 18 · 2:00 PM - 7:00 PM',
      duration: '5 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Technopark Casablanca',
      address: 'Route de Nouaceur, Casablanca',
      coordinates: { lat: 33.5243, lng: -7.6645 },
    },
    capacity: 300,
    highlights: [
      { icon: '💰', text: '500K MAD prizes' },
      { icon: '🚀', text: '15 startups competing' },
      { icon: '💼', text: 'Meet VCs & investors' },
      { icon: '🤝', text: 'Networking reception' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // FOOD & DRINK EVENTS
  {
    slug: 'marrakech-street-food-festival-2026',
    title: 'Marrakech Street Food Festival',
    summary: 'Taste the best street food from Morocco and around the world at this massive food festival.',
    description: [
      'The ultimate street food experience in Marrakech!',
      '50+ food vendors from Morocco and international cuisines.',
      'Moroccan specialties: Tagine, couscous, pastilla, harira, and more.',
      'International options: Tacos, burgers, Asian, Mediterranean.',
      'Live cooking demonstrations by celebrity chefs.',
      'Food competitions and tastings.',
      'Live music and entertainment throughout the day.',
      'Kids zone with activities for families.',
      'Free entry - pay per dish.',
    ],
    category: 'Food & Drink',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop',
      alt: 'Street Food Festival',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 5, 15, 11, 0),
      end: createSpecificDate(2026, 5, 17, 22, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, May 15 - Sun, May 17 · 11:00 AM - 10:00 PM',
      duration: '3 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Menara Gardens',
      address: 'Avenue de la Menara, Marrakech',
      coordinates: { lat: 31.6089, lng: -8.0406 },
    },
    capacity: 10000,
    highlights: [
      { icon: '🍽️', text: '50+ vendors' },
      { icon: '👨‍🍳', text: 'Celebrity chefs' },
      { icon: '🎵', text: 'Live music' },
      { icon: '👨‍👩‍👧‍👦', text: 'Family-friendly' },
      { icon: '🆓', text: 'Free entry' },
    ],
  },

  {
    slug: 'wine-tasting-meknes-vineyards-2026',
    title: 'Moroccan Wine Tasting Tour - Meknes Vineyards',
    summary: 'Discover the excellence of Moroccan wines with a guided tasting tour of Meknes region vineyards.',
    description: [
      'Experience the rich winemaking tradition of Morocco in Meknes.',
      'Visit 3 premium wineries in the region.',
      'Taste 12+ different wines including reds, whites, and rosés.',
      'Learn about winemaking process from vineyard to bottle.',
      'Gourmet lunch paired with wines at a traditional riad.',
      'Expert sommelier guidance throughout the day.',
      'Transportation from Meknes city center included.',
      'Small group experience (max 20 people).',
      '21+ only.',
    ],
    category: 'Food & Drink',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=450&fit=crop',
      alt: 'Wine Tasting Tour',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 10, 10, 9, 0),
      end: createSpecificDate(2026, 10, 10, 17, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Oct 10 · 9:00 AM - 5:00 PM',
      duration: '8 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Meknes',
      venue: 'Meknes Vineyard Region',
      address: 'Meknes Wine Route, Morocco',
      coordinates: { lat: 33.8742, lng: -5.5328 },
    },
    capacity: 20,
    highlights: [
      { icon: '🍷', text: '3 vineyards' },
      { icon: '🍇', text: '12+ wine tastings' },
      { icon: '🍽️', text: 'Gourmet lunch' },
      { icon: '🚐', text: 'Transportation included' },
      { icon: '🔞', text: '21+' },
    ],
  },

  // SPORTS EVENTS
  {
    slug: 'casablanca-marathon-2026',
    title: 'Casablanca International Marathon 2026',
    summary: 'Join thousands of runners in the annual Casablanca Marathon - Full, Half, and 10K options.',
    description: [
      'The biggest running event in Morocco returns!',
      'Race options: Full Marathon (42.2K), Half Marathon (21.1K), 10K Fun Run.',
      'Scenic route along the Corniche and through historic neighborhoods.',
      'Chip timing and official results.',
      'Finisher medals and certificates for all participants.',
      'Water stations every 2.5K.',
      'Professional medical support throughout the course.',
      'Post-race celebration with music, food, and awards ceremony.',
      'Register early for discounted rates.',
    ],
    category: 'Sports',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=450&fit=crop',
      alt: 'Casablanca Marathon',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 11, 8, 7, 0),
      end: createSpecificDate(2026, 11, 8, 14, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sun, Nov 8 · 7:00 AM - 2:00 PM',
      duration: '7 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Casablanca Corniche',
      address: 'Boulevard de la Corniche, Casablanca',
      coordinates: { lat: 33.609, lng: -7.6364 },
    },
    capacity: 5000,
    highlights: [
      { icon: '🏃', text: 'Full & Half Marathon' },
      { icon: '🏅', text: 'Finisher medals' },
      { icon: '⏱️', text: 'Chip timing' },
      { icon: '🏖️', text: 'Scenic Corniche route' },
      { icon: '🎉', text: 'Post-race celebration' },
    ],
  },

  {
    slug: 'surfing-championship-agadir-2026',
    title: 'Morocco Surf Pro Championship - Agadir',
    summary: 'Watch the best surfers compete in Morocco\'s premier surfing championship at Agadir Beach.',
    description: [
      'The Morocco Surf Pro returns to Agadir!',
      'Top national and international surfers competing.',
      'Multiple categories: Professional, Amateur, Junior.',
      'Beach festival atmosphere with music and food trucks.',
      'Free surfing lessons for beginners during breaks.',
      'Surf gear expo featuring major brands.',
      'Live commentary and big screen viewing.',
      'Awards ceremony on the beach.',
      'Free admission - bring the whole family!',
    ],
    category: 'Sports',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=450&fit=crop',
      alt: 'Surf Championship',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 8, 20, 10, 0),
      end: createSpecificDate(2026, 8, 23, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Thu, Aug 20 - Sun, Aug 23 · 10:00 AM - 6:00 PM',
      duration: '4 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Agadir',
      venue: 'Agadir Beach',
      address: 'Boulevard du 20 Août, Agadir',
      coordinates: { lat: 30.4202, lng: -9.5982 },
    },
    capacity: 15000,
    highlights: [
      { icon: '🏄', text: 'Pro surfers' },
      { icon: '🎓', text: 'Free lessons' },
      { icon: '🎵', text: 'Beach festival' },
      { icon: '🏆', text: 'Multiple categories' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // HEALTH & WELLNESS
  {
    slug: 'meditation-retreat-atlas-mountains-2026',
    title: 'Silent Meditation Retreat - Atlas Mountains',
    summary: 'Disconnect from the world and reconnect with yourself in a 5-day silent meditation retreat.',
    description: [
      'A transformative 5-day silent meditation retreat in the peaceful Atlas Mountains.',
      'Daily schedule: Morning meditation, yoga, mindful walking, evening reflection.',
      'Guided by experienced meditation teachers.',
      'All meals included - healthy vegetarian cuisine.',
      'Accommodation in comfortable mountain lodge.',
      'Noble silence maintained throughout (except Q&A sessions).',
      'Beautiful natural surroundings perfect for contemplation.',
      'All levels welcome - beginners receive extra support.',
      'Limited to 30 participants for intimate experience.',
    ],
    category: 'Health',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
      alt: 'Meditation Retreat',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 5, 1, 15, 0),
      end: createSpecificDate(2026, 5, 6, 12, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, May 1 at 3:00 PM - Wed, May 6 at 12:00 PM',
      duration: '5 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Imlil',
      venue: 'Kasbah du Toubkal',
      address: 'Imlil, Atlas Mountains',
      coordinates: { lat: 31.1361, lng: -7.9197 },
    },
    capacity: 30,
    highlights: [
      { icon: '🧘', text: 'Silent meditation' },
      { icon: '🏔️', text: 'Atlas Mountains' },
      { icon: '🍃', text: 'Yoga & mindfulness' },
      { icon: '🍽️', text: 'Vegetarian meals' },
      { icon: '🏡', text: 'Mountain lodge' },
    ],
  },
];
