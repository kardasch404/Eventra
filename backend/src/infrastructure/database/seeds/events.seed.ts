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

export const SEED_EVENTS: SeedEvent[] = [
  // Event 1: Conflict Without Blowups
  {
    slug: 'conflict-without-blowups-3-step-script',
    title: 'Conflict Without Blowups: The 3-Step Script for Calm Conversations',
    summary:
      'Stop blowups before they start. Learn a simple 3-Step Script to bring up issues calmly—without defensiveness—so you build connection.',
    description: [
      'Are you tired of having the same argument every month?',
      'Does trying to bring up a real issue quickly turn into defensiveness, resentment, or a full-blown shutdown?',
      "You're not alone — and it's not what you're saying… it's how you're saying it.",
      "Most couples don't have a communication problem. They have a safety problem.",
      "That's why even a simple correction can feel like an attack… and a normal conversation turns into conflict.",
      'This high-impact, 60-minute live working session will teach you a simple, repeatable 3-step script to bring up issues clearly and gently — without triggering blowups.',
      '✅ Attend alone or as a couple',
      '✅ Practical and usable the same day',
      '✅ Live Q&A included (not recorded)',
      'What You Will Learn: The 3-Step Script',
      'This workshop is dedicated to mastering a simple 3-part framework that helps you:',
      '• Start with emotional safety',
      '• Communicate your needs without blame',
      '• End the conversation with teamwork instead of tension',
      "You'll leave with a ready-to-use script that helps your spouse hear you without feeling attacked — so your feedback builds connection instead of conflict.",
      'Key Takeaways (in 60 Minutes):',
      '✅ Mindset Shift: The "Right vs. Relationship Test" — when to speak vs. when to wait',
      '✅ Timing Triage: The H.A.L.T. check — how to avoid starting hard conversations emotionally depleted',
      '✅ Step 1 — The Soft Start: How to open with connection and reduce defensiveness',
      '✅ Step 2 — The Core Message: The I-Statement formula — speak your truth without blame or criticism',
      '✅ Step 3 — The Collaborative Close: Turn complaints into shared solutions and real change',
      '✅ Handling Pushback: What to do when your spouse gets defensive without escalating into a fight',
      "This is not theory. It's a practical tool you can use immediately to start building a healthier, less reactive marriage.",
      'Stop fighting the same fight. Start solving the problem.',
      'Register now to secure your spot!',
    ],
    category: 'Spirituality',
    type: EventType.ONLINE,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Conflict Without Blowups Workshop',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 2, 10, 3, 0),
      end: createSpecificDate(2026, 2, 10, 4, 0),
      timezone: 'Africa/Casablanca',
      display: 'Tue, Feb 10 · 3:00 AM - 4:00 AM GMT+1',
      duration: '1 hour',
    },
    location: {
      mode: 'online',
      country: 'Morocco',
      city: 'Online',
    },
    capacity: 500,
    highlights: [
      { icon: '🎯', text: 'Learn the 3-Step Conflict Resolution Script' },
      { icon: '🧘', text: 'Stay calm under pressure' },
      { icon: '💬', text: 'Transform arguments into productive conversations' },
      { icon: '🆓', text: 'Free registration' },
      { icon: '⏱️', text: '1 hour' },
      { icon: '🌐', text: 'Online event' },
    ],
  },

  // Event 2: How to Make Your 1st Sale Selling on Amazon
  {
    slug: 'how-to-make-first-sale-amazon',
    title: 'How to Make Your 1st Sale Selling on Amazon',
    summary:
      'Learn the secrets of selling on Amazon, all from the comfort of your couch - join us online!',
    description: [
      "Join us for an exciting online event where we'll spill the secrets of how to earn BIG bucks on Amazon! Women Supporting Other Women!",
      "Are you ready to unlock the potential of Amazon's vast marketplace? Look no further! This event is your golden ticket to learn the ins and outs of making serious cash online.",
      "Whether you're a seasoned entrepreneur or just starting out, our expert speakers will guide you through the process of building a successful Amazon business.",
      'Why attend?',
      '• The #1 Thing You Need To Do in Order to Start Making BOSS Checks on Amazon is Open a FREE Store TODAY!',
      '• Learn how to start earning from selling items in Dollar Tree',
      '• Learn how to find profitable products that will fly off the shelves',
      '• How to Make your 1st sale in 15 Days From the BEST of the Best Women Amazon Sellers!',
      "Don't miss out on this incredible opportunity to revolutionize your online business! Secure your spot now and get ready to make those dollar signs rain!",
      'Agenda:',
      '8:00 PM - 8:30 PM: 1ST HOT-SELLER ON AMAZON - Join us as we share the 1st hot selling item for the night in groceries!',
      '8:30 PM - 9:30 PM: 2ND HOT SELLER ON AMAZON - Join us as we share the 2nd hot selling item for the night in toys!',
      'FAQs:',
      '• Will you teach us how to open an Amazon store? Yes!',
      '• Will you teach us which products are selling and which brands to stay away from? Yes of course!',
      '• Will there be a replay? Yes!',
    ],
    category: 'Business',
    type: EventType.ONLINE,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Amazon Selling Workshop',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createFutureDate(7, 20, 0),
      end: createFutureDate(7, 22, 0),
      timezone: 'Africa/Casablanca',
      display: 'Multiple dates · 8:00 PM - 10:00 PM GMT+1',
      duration: '2 hours',
    },
    location: {
      mode: 'online',
      country: 'Morocco',
      city: 'Online',
    },
    capacity: 1000,
    highlights: [
      { icon: '💰', text: 'Learn to earn on Amazon' },
      { icon: '👩‍💼', text: 'Women Supporting Women' },
      { icon: '🛒', text: 'Find profitable products' },
      { icon: '🆓', text: 'Free event' },
      { icon: '⏱️', text: '2 hours' },
      { icon: '🌐', text: 'Online event' },
    ],
  },

  // Event 3: iTrading Expo Morocco 2026
  {
    slug: 'itrading-expo-morocco-2026',
    title: 'iTrading Expo Morocco 2026 - June 6-7 (Financial Event)',
    summary:
      'The Ultimate Fintech Hub for Innovation, Connections, and Success With a Special Focus for Traders and Investors',
    description: [
      'What is iTRADING EXPO?',
      'iTRADING EXPO is the hub where innovation, technology, and finance come together to unlock new possibilities.',
      'Bringing together leaders in trading, finance, fintech, and technology, the event delivers unmatched exposure as one of the largest B2B & B2C platforms in the industry.',
      'With total market coverage across all trading instruments and early client engagement through the exclusive online marketplace, iTRADING EXPO is where the future of finance is shaped.',
      'The topmost trading community is closer than you think!',
      'To Purchase a sponsorship please contact:',
      '+1 929 3091817 iEvents Pro (USA)',
      '+357 95536475 iEvents Pro (Cyprus)',
      'or via info@ievents.pro',
      'Topics covered: forex trading, forex course, make money online, day trading, technical analysis, best forex brokers, forex strategies, stock market, stocks, swing trading, investing for beginners, passive income, options trading, stock trading, finance, investment, futures trading, crypto, bitcoin, blockchain, cryptocurrency and more!',
    ],
    category: 'Finance',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'iTrading Expo Morocco 2026',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 6, 6, 10, 0),
      end: createSpecificDate(2026, 6, 7, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Jun 6 at 10:00 AM to Sun, Jun 7 at 6:00 PM GMT+1',
      duration: '1 day 8 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Hyatt Regency Casablanca',
      address: 'Place des Nations Unies, Casablanca, Casablanca-Settat 20000',
      coordinates: { lat: 33.5951, lng: -7.6187 },
    },
    capacity: 2000,
    highlights: [
      { icon: '📈', text: 'Trading & Finance experts' },
      { icon: '🏢', text: 'B2B & B2C platform' },
      { icon: '🤝', text: 'Networking opportunities' },
      { icon: '🎓', text: 'Workshops & masterclasses' },
      { icon: '⏱️', text: '1 day 8 hours' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 4: Checkmate & Connect
  {
    slug: 'checkmate-connect-chess-networking-entrepreneurs',
    title: 'Checkmate & Connect: Chess and Networking for Entrepreneurs',
    summary:
      'Join us for an exciting evening of strategic moves and meaningful connections at Checkmate & Connect: Chess and Networking for Entrepreneurs',
    description: [
      'This unique event blends the intellectual challenges of chess with the opportunities for networking and collaboration among like-minded entrepreneurs.',
      "Whether you're a seasoned chess player or a beginner looking to learn, our event offers a welcoming environment for all skill levels.",
      'Engage in friendly chess matches, sharpen your strategic thinking, and test your wits against fellow entrepreneurs.',
      "Beyond the chessboard, you'll have the chance to build valuable professional relationships with a diverse group of entrepreneurs, investors, and business enthusiasts.",
      'Share your ideas, seek advice, and explore potential partnerships in an atmosphere designed to foster innovation and growth.',
      "Don't miss this opportunity to make strategic moves in both your game and your business ventures.",
      "'Checkmate & Connect' promises an evening of fun, learning, and networking that could lead to your next entrepreneurial breakthrough.",
      'Join us and let the game of chess inspire your entrepreneurial journey!',
    ],
    category: 'Networking',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Checkmate & Connect Chess Networking Event',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createFutureDate(14, 18, 0),
      end: createFutureDate(14, 21, 0),
      timezone: 'Africa/Casablanca',
      display: 'Multiple dates · 6:00 PM - 9:00 PM GMT+1',
      duration: '3 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Commons Zerktouni',
      address: 'Avenue Mers Sultan, Casablanca, Casablanca-Settat 20250',
      coordinates: { lat: 33.5883, lng: -7.6317 },
    },
    capacity: 50,
    highlights: [
      { icon: '♟️', text: 'All skill levels welcome' },
      { icon: '🤝', text: 'Professional networking' },
      { icon: '🧠', text: 'Strategic thinking' },
      { icon: '🆓', text: 'Free event' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 5: Odoo Business Show Casablanca
  {
    slug: 'odoo-business-show-casablanca-2026',
    title: 'Odoo Business Show Casablanca',
    summary:
      'Discover how Odoo can transform your business operations at this exclusive showcase event.',
    description: [
      'The Odoo Business Show comes to Casablanca! Join us for an evening of discovery and innovation.',
      "Odoo is the world's #1 open-source business software used by over 7 million users worldwide. This event will show you why.",
      'Attend live demonstrations of: CRM and sales automation, inventory and warehouse management, accounting and invoicing, HR and employee management, e-commerce and website building.',
      'Meet certified Odoo partners who can help implement solutions tailored to your business needs.',
      'Network with business owners and IT professionals who are already leveraging Odoo to streamline their operations.',
      'Free admission includes refreshments and exclusive offers for attendees.',
    ],
    category: 'Business',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Odoo Business Show Casablanca',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 2, 10, 19, 0),
      end: createSpecificDate(2026, 2, 10, 22, 0),
      timezone: 'Africa/Casablanca',
      display: 'Tue, Feb 10 · 7:00 PM - 10:00 PM GMT+1',
      duration: '3 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Casablanca Convention Center',
      address: 'Boulevard Sidi Mohammed Ben Abdellah, Casablanca',
      coordinates: { lat: 33.5731, lng: -7.5898 },
    },
    capacity: 300,
    highlights: [
      { icon: '💻', text: 'Live software demonstrations' },
      { icon: '🤝', text: 'Meet certified partners' },
      { icon: '🎁', text: 'Exclusive offers for attendees' },
      { icon: '🍷', text: 'Networking reception' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // Event 6: Admission Day - Casablanca
  {
    slug: 'admission-day-casablanca-2026',
    title: 'Admission Day - Casablanca',
    summary:
      'Open admission day for prospective students featuring campus tours, program presentations, and scholarship information.',
    description: [
      'Discover your future at our Admission Day event! This is your opportunity to explore our programs, meet faculty, and learn about the opportunities that await you.',
      'The day will feature: Comprehensive campus tours led by current students, program presentations from all departments, one-on-one sessions with admissions counselors, scholarship and financial aid information sessions.',
      "Whether you're interested in business, engineering, arts, or sciences, our team will help you find the program that's right for you.",
      'Parents and guardians are welcome to attend. We encourage families to come together and ask questions about student life, career prospects, and support services.',
      'Pre-registration is recommended but walk-ins are welcome. Lunch will be provided for all registered attendees.',
      "Don't miss this chance to take the first step toward your academic and professional future.",
    ],
    category: 'Education',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Admission Day Casablanca',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 3, 14, 10, 0),
      end: createSpecificDate(2026, 3, 14, 16, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, Mar 14 · 10:00 AM - 4:00 PM GMT+1',
      duration: '6 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Casablanca',
      address: 'Casablanca, Morocco',
      coordinates: { lat: 33.5731, lng: -7.5898 },
    },
    capacity: 500,
    highlights: [
      { icon: '🎓', text: 'Campus tours' },
      { icon: '📚', text: 'Program presentations' },
      { icon: '💰', text: 'Scholarship information' },
      { icon: '🍽️', text: 'Lunch provided' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // Event 7: Jobs Fair Casablanca - 2026
  {
    slug: 'jobs-fair-casablanca-2026',
    title: 'Jobs Fair Casablanca - 2026',
    summary:
      "Connect with top employers and discover career opportunities at Morocco's largest job fair.",
    description: [
      'Jobs Fair Casablanca 2026 is your gateway to career opportunities!',
      'Meet representatives from leading companies across various industries including technology, finance, healthcare, manufacturing, and more.',
      "Whether you're a recent graduate, an experienced professional looking for a change, or exploring new career paths, this event has something for everyone.",
      'Features include: On-site interviews with participating companies, resume review sessions with HR professionals, career coaching and advice workshops, networking opportunities with industry leaders.',
      'Bring multiple copies of your resume and dress professionally. Many companies conduct first-round interviews on the spot!',
      'Free admission for all job seekers. Pre-registration recommended.',
    ],
    category: 'Career',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Jobs Fair Casablanca 2026',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 5, 30, 11, 0),
      end: createSpecificDate(2026, 5, 30, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sat, May 30 · 11:00 AM - 6:00 PM GMT+1',
      duration: '7 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Hyatt Regency Casablanca',
      address: 'Place des Nations Unies, Casablanca',
      coordinates: { lat: 33.5951, lng: -7.6187 },
    },
    capacity: 2000,
    highlights: [
      { icon: '💼', text: 'Top employers' },
      { icon: '📝', text: 'On-site interviews' },
      { icon: '📄', text: 'Resume review' },
      { icon: '🎯', text: 'Career coaching' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // Event 8: MOROCCO SIEMA EXPO 2026
  {
    slug: 'morocco-siema-expo-2026',
    title: 'MOROCCO SIEMA EXPO 2026',
    summary:
      'The premier industrial and manufacturing expo in Morocco showcasing the latest innovations.',
    description: [
      'MOROCCO SIEMA EXPO 2026 is the largest industrial and manufacturing exhibition in Morocco.',
      'This prestigious event brings together industry leaders, manufacturers, suppliers, and innovators from around the world.',
      'Explore the latest technologies in: Industrial automation and robotics, manufacturing equipment, energy solutions, logistics and supply chain, smart factory technologies.',
      'Network with decision-makers from major industrial companies and discover new business opportunities.',
      'The expo features keynote presentations from industry experts, product demonstrations, and exclusive networking events.',
      'Early registration is recommended as space is limited.',
    ],
    category: 'Industry',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Morocco SIEMA Expo 2026',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 9, 22, 11, 0),
      end: createSpecificDate(2026, 9, 24, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Tue, Sep 22 - Thu, Sep 24 · 11:00 AM - 6:00 PM GMT+1',
      duration: '3 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'OFEC Casablanca',
      address: 'OFEC, Casablanca',
      coordinates: { lat: 33.565, lng: -7.62 },
    },
    capacity: 5000,
    highlights: [
      { icon: '🏭', text: 'Industrial innovations' },
      { icon: '🤖', text: 'Automation & robotics' },
      { icon: '🔧', text: 'Manufacturing solutions' },
      { icon: '🤝', text: 'B2B networking' },
      { icon: '📍', text: 'In person' },
    ],
  },
];
