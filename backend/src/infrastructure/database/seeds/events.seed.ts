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
  
  // Event 9: Tech Meetup Fes
  {
    slug: 'tech-meetup-fes-developers',
    title: 'Tech Meetup Fes - Web Developers & Designers Unite',
    summary:
      'Join the vibrant tech community in Fes for an evening of learning, networking, and sharing experiences.',
    description: [
      'Calling all developers, designers, and tech enthusiasts in Fes!',
      'Join us for an exciting meetup where we discuss the latest trends in web development and design.',
      'This month\'s topics include: Modern React patterns and best practices, CSS frameworks comparison, Backend architecture with Node.js, UI/UX design principles.',
      'Whether you\'re a beginner or an experienced professional, everyone is welcome!',
      'Bring your laptop, your questions, and your passion for technology.',
      'Light refreshments will be provided. Free admission.',
    ],
    category: 'Technology',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Tech Meetup Fes',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createFutureDate(5, 19, 0),
      end: createFutureDate(5, 22, 0),
      timezone: 'Africa/Casablanca',
      display: 'Multiple dates · 7:00 PM - 10:00 PM GMT+1',
      duration: '3 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Fes',
      venue: 'Fes Tech Hub',
      address: 'Avenue Hassan II, Fes',
      coordinates: { lat: 34.0181, lng: -5.0078 },
    },
    capacity: 80,
    highlights: [
      { icon: '💻', text: 'Web development' },
      { icon: '🎨', text: 'UI/UX design' },
      { icon: '🤝', text: 'Networking' },
      { icon: '🆓', text: 'Free event' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 10: Marrakech Startup Weekend
  {
    slug: 'marrakech-startup-weekend-2026',
    title: 'Startup Weekend Marrakech - Build Your Dream in 54 Hours',
    summary:
      '54 hours to pitch, build, and launch your startup idea with mentors and fellow entrepreneurs in Marrakech.',
    description: [
      'Startup Weekend is coming to Marrakech! Transform your idea into reality in just one weekend.',
      'Friday evening: Pitch your ideas and form teams',
      'Saturday: Build your MVP with guidance from experienced mentors',
      'Sunday: Present to judges and compete for prizes',
      'Open to entrepreneurs, developers, designers, and anyone with a passion for innovation.',
      'Prizes include: 1st place: 50,000 MAD, 2nd place: 25,000 MAD, 3rd place: 15,000 MAD, Plus mentorship and potential funding opportunities!',
      'Meals and refreshments provided throughout the weekend.',
    ],
    category: 'Startup',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Startup Weekend Marrakech',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 3, 20, 18, 0),
      end: createSpecificDate(2026, 3, 22, 20, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Mar 20 at 6:00 PM - Sun, Mar 22 at 8:00 PM GMT+1',
      duration: '54 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Marrakech Innovation Center',
      address: 'Gueliz, Marrakech',
      coordinates: { lat: 31.6347, lng: -7.9995 },
    },
    capacity: 120,
    highlights: [
      { icon: '🚀', text: '54-hour hackathon' },
      { icon: '💰', text: 'Cash prizes' },
      { icon: '👨‍🏫', text: 'Expert mentors' },
      { icon: '🍽️', text: 'Meals provided' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 11: Rabat Digital Marketing Summit
  {
    slug: 'rabat-digital-marketing-summit-2026',
    title: 'Digital Marketing Summit Rabat 2026',
    summary:
      'Learn from top digital marketing experts about SEO, social media, content marketing, and growth strategies.',
    description: [
      'The Digital Marketing Summit comes to Rabat!',
      'Join industry leaders and marketing professionals for a full day of insights and strategies.',
      'Topics covered: SEO best practices for 2026, Social media marketing trends, Content marketing strategies, Email marketing automation, Analytics and data-driven decisions.',
      'Featuring keynote speakers from Google, Meta, and leading Moroccan marketing agencies.',
      'Includes workshops, panel discussions, and networking sessions.',
      'Perfect for marketing professionals, business owners, and anyone looking to grow their online presence.',
    ],
    category: 'Marketing',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Digital Marketing Summit Rabat',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 15, 9, 0),
      end: createSpecificDate(2026, 4, 15, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Wed, Apr 15 · 9:00 AM - 6:00 PM GMT+1',
      duration: '9 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Rabat',
      venue: 'Sofitel Rabat Jardin des Roses',
      address: 'Avenue Annakhil, Rabat',
      coordinates: { lat: 33.9716, lng: -6.8498 },
    },
    capacity: 400,
    highlights: [
      { icon: '📱', text: 'Digital marketing trends' },
      { icon: '📊', text: 'Data-driven strategies' },
      { icon: '🎤', text: 'Industry experts' },
      { icon: '🤝', text: 'Networking' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 12: Tangier AI & Machine Learning Conference
  {
    slug: 'tangier-ai-ml-conference-2026',
    title: 'Tangier AI & Machine Learning Conference 2026',
    summary:
      'Explore the future of AI and machine learning with researchers, practitioners, and industry leaders.',
    description: [
      'The first AI & ML Conference in Northern Morocco!',
      'Join us in Tangier for two days of cutting-edge presentations and hands-on workshops.',
      'Day 1: Keynotes on AI trends, deep learning applications, NLP advancements, computer vision innovations.',
      'Day 2: Hands-on workshops on TensorFlow, PyTorch, AI ethics, and practical ML deployment.',
      'Perfect for data scientists, ML engineers, researchers, and tech enthusiasts.',
      'Limited seats available. Early bird pricing ends soon!',
    ],
    category: 'Technology',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Tangier AI ML Conference',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 5, 8, 9, 0),
      end: createSpecificDate(2026, 5, 9, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, May 8 - Sat, May 9 · 9:00 AM - 6:00 PM GMT+1',
      duration: '2 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Tangier',
      venue: 'Hilton Tangier City Center',
      address: 'Place du Maghreb Arabe, Tangier',
      coordinates: { lat: 35.7595, lng: -5.834 },
    },
    capacity: 300,
    highlights: [
      { icon: '🤖', text: 'AI & ML trends' },
      { icon: '💡', text: 'Hands-on workshops' },
      { icon: '🎓', text: 'Expert speakers' },
      { icon: '🔬', text: 'Research presentations' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 13: Agadir Food & Tourism Expo
  {
    slug: 'agadir-food-tourism-expo-2026',
    title: 'Agadir Food & Tourism Expo 2026',
    summary:
      'Celebrate Moroccan cuisine and tourism at this exciting expo featuring tastings, cooking demos, and travel showcases.',
    description: [
      'Welcome to the Agadir Food & Tourism Expo!',
      'Experience the best of Moroccan gastronomy and discover amazing travel destinations.',
      'Food section: Cooking demonstrations by celebrity chefs, wine and food pairings, traditional Moroccan cuisine, international food vendors.',
      'Tourism section: Travel agencies showcasing destinations, cultural performances, adventure tourism activities, sustainable tourism initiatives.',
      'Free entry includes tastings at select booths!',
      'Perfect for food lovers, travelers, and families.',
    ],
    category: 'Food & Tourism',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Agadir Food Tourism Expo',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 7, 10, 11, 0),
      end: createSpecificDate(2026, 7, 12, 20, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Jul 10 - Sun, Jul 12 · 11:00 AM - 8:00 PM GMT+1',
      duration: '3 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Agadir',
      venue: 'Agadir Conference Palace',
      address: 'Boulevard Mohammed V, Agadir',
      coordinates: { lat: 30.4278, lng: -9.5981 },
    },
    capacity: 1500,
    highlights: [
      { icon: '🍽️', text: 'Food tastings' },
      { icon: '👨‍🍳', text: 'Celebrity chefs' },
      { icon: '✈️', text: 'Travel showcases' },
      { icon: '🎭', text: 'Cultural performances' },
      { icon: '🆓', text: 'Free entry' },
    ],
  },

  // Event 14: Fes Cultural Arts Festival
  {
    slug: 'fes-cultural-arts-festival-2026',
    title: 'Fes Festival of World Sacred Music - Special Edition',
    summary:
      'Experience spiritual music from around the world in the historic city of Fes.',
    description: [
      'The renowned Fes Festival returns with a special edition celebrating global spiritual traditions through music.',
      'Over 5 days, enjoy performances by artists from Morocco, India, Senegal, Turkey, and beyond.',
      'Concerts held in stunning historic venues across the medina including Bab Makina, Dar Tazi, and Batha Museum.',
      'Day concerts are family-friendly while evening performances offer a more intimate experience.',
      'Workshops and conferences on music, spirituality, and intercultural dialogue.',
      'A unique opportunity to experience diverse cultures in the heart of Morocco.',
    ],
    category: 'Arts & Culture',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Fes Cultural Arts Festival',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 6, 12, 18, 0),
      end: createSpecificDate(2026, 6, 17, 23, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Jun 12 - Wed, Jun 17 · Multiple performances daily',
      duration: '5 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Fes',
      venue: 'Various venues in Fes Medina',
      address: 'Fes el-Bali, Fes',
      coordinates: { lat: 34.0633, lng: -4.9735 },
    },
    capacity: 3000,
    highlights: [
      { icon: '🎵', text: 'World music' },
      { icon: '🕌', text: 'Historic venues' },
      { icon: '🌍', text: 'International artists' },
      { icon: '🎭', text: 'Cultural workshops' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 15: Casablanca Blockchain Summit
  {
    slug: 'casablanca-blockchain-summit-2026',
    title: 'Casablanca Blockchain Summit 2026',
    summary:
      'Explore blockchain technology, cryptocurrency, and decentralized finance with industry pioneers.',
    description: [
      'The Casablanca Blockchain Summit brings together blockchain developers, crypto investors, and DeFi enthusiasts.',
      'Topics include: Blockchain fundamentals and architecture, cryptocurrency trading strategies, DeFi protocols and opportunities, NFT marketplaces and trends, regulatory landscape in Morocco and Africa.',
      'Keynote speakers from major exchanges and blockchain companies.',
      'Networking sessions with VCs and blockchain startups.',
      'Exhibition area featuring blockchain solutions and services.',
      'Early bird tickets available now!',
    ],
    category: 'Technology',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Casablanca Blockchain Summit',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 10, 5, 9, 0),
      end: createSpecificDate(2026, 10, 6, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Mon, Oct 5 - Tue, Oct 6 · 9:00 AM - 6:00 PM GMT+1',
      duration: '2 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Four Seasons Hotel Casablanca',
      address: 'Boulevard de la Corniche, Casablanca',
      coordinates: { lat: 33.609, lng: -7.6364 },
    },
    capacity: 600,
    highlights: [
      { icon: '⛓️', text: 'Blockchain technology' },
      { icon: '💰', text: 'Cryptocurrency & DeFi' },
      { icon: '🎨', text: 'NFT insights' },
      { icon: '💼', text: 'VC networking' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 16: Marrakech Yoga & Wellness Retreat
  {
    slug: 'marrakech-yoga-wellness-retreat-2026',
    title: 'Marrakech Yoga & Wellness Retreat - 3 Days of Renewal',
    summary:
      'Rejuvenate your mind, body, and spirit with yoga, meditation, and wellness workshops in beautiful Marrakech.',
    description: [
      'Escape to Marrakech for a transformative 3-day yoga and wellness retreat.',
      'Daily schedule includes: Morning yoga sessions (all levels welcome), guided meditation, wellness workshops on nutrition and mindfulness, spa treatments, healthy gourmet meals.',
      'Led by certified yoga instructors and wellness experts.',
      'Set in a beautiful riad with traditional Moroccan hospitality.',
      'Limited to 30 participants for an intimate experience.',
      'All-inclusive package: accommodation, meals, and activities.',
    ],
    category: 'Health & Wellness',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Marrakech Yoga Wellness Retreat',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 24, 15, 0),
      end: createSpecificDate(2026, 4, 27, 12, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Apr 24 at 3:00 PM - Mon, Apr 27 at 12:00 PM GMT+1',
      duration: '3 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Marrakech',
      venue: 'Palais Namaskar',
      address: 'Route de Bab Atlas, Marrakech',
      coordinates: { lat: 31.6037, lng: -8.0663 },
    },
    capacity: 30,
    highlights: [
      { icon: '🧘', text: 'Daily yoga & meditation' },
      { icon: '🍃', text: 'Wellness workshops' },
      { icon: '💆', text: 'Spa treatments' },
      { icon: '🍽️', text: 'Healthy gourmet meals' },
      { icon: '🏡', text: 'Luxury riad' },
    ],
  },

  // Event 17: Essaouira Music Festival
  {
    slug: 'essaouira-gnaoua-music-festival-2026',
    title: 'Essaouira Gnaoua and World Music Festival 2026',
    summary:
      'The legendary Gnaoua Festival returns to Essaouira with world-class musicians and vibrant performances.',
    description: [
      'Experience the magic of the Gnaoua and World Music Festival in the coastal city of Essaouira!',
      '4 days of non-stop music featuring Gnaoua masters and international artists.',
      'Free open-air concerts on multiple stages across the city.',
      'Fusion performances blending Gnaoua with jazz, rock, reggae, and more.',
      'Street performances, art exhibitions, and cultural activities throughout the medina.',
      'One of Africa\'s largest music festivals with over 500,000 visitors expected.',
      'Family-friendly with activities for all ages.',
    ],
    category: 'Music & Entertainment',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Essaouira Gnaoua Music Festival',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 6, 25, 17, 0),
      end: createSpecificDate(2026, 6, 28, 23, 59),
      timezone: 'Africa/Casablanca',
      display: 'Thu, Jun 25 - Sun, Jun 28 · All day',
      duration: '4 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Essaouira',
      venue: 'Multiple venues in Essaouira',
      address: 'Essaouira Medina, Essaouira',
      coordinates: { lat: 31.5125, lng: -9.7595 },
    },
    capacity: 50000,
    highlights: [
      { icon: '🎸', text: 'Gnaoua masters' },
      { icon: '🌍', text: 'International artists' },
      { icon: '🎭', text: 'Street performances' },
      { icon: '🆓', text: 'Free admission' },
      { icon: '🏖️', text: 'Beachside location' },
    ],
  },

  // Event 18: Rabat Innovation & Entrepreneurship Forum
  {
    slug: 'rabat-innovation-entrepreneurship-forum-2026',
    title: 'Rabat Innovation & Entrepreneurship Forum 2026',
    summary:
      'Connect with innovators, investors, and policymakers shaping Morocco\'s entrepreneurial ecosystem.',
    description: [
      'The Rabat Innovation & Entrepreneurship Forum brings together the brightest minds in Moroccan innovation.',
      'Full-day event featuring: Keynote speeches from successful entrepreneurs, panel discussions on startup challenges, pitch competition with 100,000 MAD in prizes, investor speed dating sessions, government initiatives and support programs.',
      'Perfect for: Early-stage startups, aspiring entrepreneurs, investors, corporate innovation teams.',
      'Exhibition area showcasing innovative Moroccan startups.',
      'Networking lunch and evening reception included.',
      'Register early - limited seats available!',
    ],
    category: 'Business',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Rabat Innovation Forum',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 9, 18, 9, 0),
      end: createSpecificDate(2026, 9, 18, 19, 0),
      timezone: 'Africa/Casablanca',
      display: 'Fri, Sep 18 · 9:00 AM - 7:00 PM GMT+1',
      duration: '10 hours',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Rabat',
      venue: 'Mohammed VI Museum of Modern Art',
      address: 'Avenue Moulay Hassan, Rabat',
      coordinates: { lat: 34.0209, lng: -6.8306 },
    },
    capacity: 500,
    highlights: [
      { icon: '🚀', text: 'Startup pitches' },
      { icon: '💼', text: 'Investor meetings' },
      { icon: '🎤', text: 'Entrepreneur speakers' },
      { icon: '💰', text: 'Prize money' },
      { icon: '📍', text: 'In person' },
    ],
  },

  // Event 19: Meknes Agriculture & Technology Expo
  {
    slug: 'meknes-agriculture-tech-expo-2026',
    title: 'Meknes Agriculture & Technology Expo 2026',
    summary:
      'Discover the latest innovations in agriculture technology, sustainable farming, and agribusiness.',
    description: [
      'The Meknes Agriculture & Technology Expo is Morocco\'s premier agri-tech event.',
      'Explore cutting-edge solutions in: Precision agriculture and IoT sensors, sustainable farming practices, irrigation technology, agricultural drones and robotics, agribusiness management.',
      'Perfect for: Farmers, agribusiness professionals, agricultural researchers, technology providers.',
      'Live demonstrations of farming equipment and technology.',
      'Workshops on sustainable agriculture and business development.',
      'Connect with agricultural suppliers, buyers, and investors.',
      'Free admission with pre-registration.',
    ],
    category: 'Agriculture',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Meknes Agriculture Tech Expo',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 4, 20, 9, 0),
      end: createSpecificDate(2026, 4, 22, 18, 0),
      timezone: 'Africa/Casablanca',
      display: 'Mon, Apr 20 - Wed, Apr 22 · 9:00 AM - 6:00 PM GMT+1',
      duration: '3 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Meknes',
      venue: 'SIAM Exhibition Center',
      address: 'Route de Fès, Meknès',
      coordinates: { lat: 33.8742, lng: -5.5328 },
    },
    capacity: 2500,
    highlights: [
      { icon: '🚜', text: 'Agriculture tech' },
      { icon: '🌱', text: 'Sustainable farming' },
      { icon: '🤖', text: 'Farm robotics' },
      { icon: '💧', text: 'Smart irrigation' },
      { icon: '🆓', text: 'Free admission' },
    ],
  },

  // Event 20: Casablanca Fashion Week 2026
  {
    slug: 'casablanca-fashion-week-2026',
    title: 'Casablanca Fashion Week 2026',
    summary:
      'Celebrate Moroccan and international fashion with runway shows, designer showcases, and industry networking.',
    description: [
      'Casablanca Fashion Week returns for its most spectacular edition yet!',
      '5 days of haute couture, ready-to-wear collections, and emerging designer showcases.',
      'Featured events: Opening gala with red carpet, daily runway shows from top Moroccan and international designers, pop-up boutiques and shopping experiences, fashion industry panels and workshops, closing party at exclusive venue.',
      'Highlighting sustainable fashion and traditional Moroccan craftsmanship.',
      'VIP packages available with backstage access and designer meet-and-greets.',
      'General admission tickets include access to all runway shows and exhibitions.',
      'Don\'t miss the biggest fashion event in North Africa!',
    ],
    category: 'Fashion',
    type: EventType.IN_PERSON,
    status: EventStatus.PUBLISHED,
    hero: {
      url: '/img/event.png',
      alt: 'Casablanca Fashion Week',
      width: 800,
      height: 450,
    },
    dateTime: {
      start: createSpecificDate(2026, 11, 15, 18, 0),
      end: createSpecificDate(2026, 11, 20, 23, 0),
      timezone: 'Africa/Casablanca',
      display: 'Sun, Nov 15 - Fri, Nov 20 · Daily shows',
      duration: '5 days',
    },
    location: {
      mode: 'in_person',
      country: 'Morocco',
      city: 'Casablanca',
      venue: 'Morocco Mall',
      address: 'Boulevard de l\'Océan Atlantique, Casablanca',
      coordinates: { lat: 33.5366, lng: -7.6862 },
    },
    capacity: 1000,
    highlights: [
      { icon: '👗', text: 'Runway shows' },
      { icon: '🎨', text: 'Designer showcases' },
      { icon: '🛍️', text: 'Fashion boutiques' },
      { icon: '🌿', text: 'Sustainable fashion' },
      { icon: '🎉', text: 'VIP experiences' },
    ],
  },
];
