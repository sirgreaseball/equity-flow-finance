import { nanoid } from 'nanoid';

// Core entity interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'business' | 'admin';
  createdAt: string;
  kycVerified?: boolean;
}

export interface Business {
  id: string;
  ownerId: string;
  businessName: string;
  category: string;
  location: string;
  description: string;
  createdAt: string;
  pitchDeckUrl?: string;
  financialsUrl?: string;
  videoUrl?: string;
}

export interface Listing {
  id: string;
  businessId: string;
  fundingGoal: number;
  amountRaised: number;
  equityOffered: number;
  investorsCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface Investment {
  id: string;
  userId: string;
  listingId: string;
  amount: number;
  equityReceived: number;
  investedAt: string;
}

export interface Proposal {
  id: string;
  businessId: string;
  title: string;
  description: string;
  options: string[];
  endAt: string;
  status: 'active' | 'passed' | 'rejected';
  totalVotes: number;
  createdAt: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  optionIndex: number;
  votingPower: number; // Based on equity
  votedAt: string;
}

export interface BusinessUpdate {
  id: string;
  businessId: string;
  title: string;
  content: string;
  date: string;
  type: 'milestone' | 'financial' | 'general';
}

// Mock data for Governance
export const mockProposals: Proposal[] = [
  {
    id: 'prop-1',
    businessId: 'biz-1',
    title: 'Expansion to Delhi Market',
    description: 'We propose to allocate $50,000 from the current round for setting up a satellite office in Delhi to capture North Indian clients. This pivot is expected to increase revenue by 25% within Q3.',
    options: ['Support Expansion', 'Reject Expansion', 'Request More Data'],
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 12,
    createdAt: '2024-03-20',
  },
  {
    id: 'prop-2',
    businessId: 'biz-1',
    title: 'Annual Dividend Policy',
    description: 'Establish a policy to distribute 10% of net profits to micro-equity stakeholders annually starting from FY 2025.',
    options: ['Approve Policy', 'Disapprove', 'Abstain'],
    endAt: '2024-03-15',
    status: 'passed',
    totalVotes: 45,
    createdAt: '2024-03-01',
  },
  {
    id: 'prop-3',
    businessId: 'biz-2',
    title: 'New Roastery Equipment Purchase',
    description: 'Authorize the purchase of a 15kg Probat roaster for $45,000 to double production capacity.',
    options: ['Approve Purchase', 'Delay to Next Quarter', 'Reject'],
    endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 8,
    createdAt: '2024-03-25',
  },
  {
    id: 'prop-4',
    businessId: 'biz-3',
    title: 'Franchise Model Rollout',
    description: 'Should we begin offering our performance lab model as a franchise? This requires $100k for legal and branding.',
    options: ['Yes, start franchising', 'No, remain corporate-owned', 'Abstain'],
    endAt: '2024-02-10',
    status: 'rejected',
    totalVotes: 32,
    createdAt: '2024-01-15',
  },
  {
    id: 'prop-5',
    businessId: 'biz-5',
    title: 'B2B School District Pricing Tier',
    description: 'Approve the new high-volume discount tier (25% off) for school districts with >10,000 students.',
    options: ['Approve Pricing', 'Reject Pricing'],
    endAt: '2024-03-10',
    status: 'passed',
    totalVotes: 64,
    createdAt: '2024-02-28',
  },
  // Additional proposals to increase activity
  {
    id: 'prop-9',
    businessId: 'biz-4',
    title: 'Launch Seasonal Brew Series',
    description: 'Introduce a limited-edition seasonal brew line for Q4 to boost holiday sales.',
    options: ['Approve Launch', 'Delay', 'Cancel'],
    endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 20,
    createdAt: '2024-04-01',
  },
  {
    id: 'prop-10',
    businessId: 'biz-6',
    title: 'Expand Farm to Include Microgreens',
    description: 'Allocate $30k to add microgreen production lines, catering to restaurant clients.',
    options: ['Approve', 'Reject', 'More Info'],
    endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 15,
    createdAt: '2024-04-02',
  },
  {
    id: 'prop-11',
    businessId: 'biz-7',
    title: 'Sustainable Packaging Initiative',
    description: 'Shift to 100% biodegradable packaging for all product lines.',
    options: ['Approve', 'Reject'],
    endAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 22,
    createdAt: '2024-04-03',
  },
  {
    id: 'prop-12',
    businessId: 'biz-9',
    title: 'AI Feature Expansion',
    description: 'Invest $200k to add new AI-driven mental health assessments.',
    options: ['Approve', 'Reject', 'Modify Amount'],
    endAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 30,
    createdAt: '2024-04-04',
  },
  {
    id: 'prop-6',
    businessId: 'biz-7',
    title: 'Shift to 100% Organic Cotton',
    description: 'Transition our primary supplier to a certified organic farm, increasing COGS by 8% but aligning with our brand.',
    options: ['Proceed with Organic', 'Keep Current Supplier'],
    endAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 22,
    createdAt: '2024-03-28',
  },
  {
    id: 'prop-7',
    businessId: 'biz-9',
    title: 'FDA Trial Funding Allocation',
    description: 'Allocate $200,000 from treasury specifically to fast-track our pending FDA breakthrough device trial.',
    options: ['Approve Allocation', 'Reject Allocation', 'Modify Amount'],
    endAt: '2024-03-20',
    status: 'passed',
    totalVotes: 89,
    createdAt: '2024-03-05',
  },
  {
    id: 'prop-8',
    businessId: 'biz-6',
    title: 'Acquisition of Neighboring Plot',
    description: 'Use $80,000 to purchase the adjacent warehouse to increase vertical farming space by 50%.',
    options: ['Approve Acquisition', 'Reject Acquisition'],
    endAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalVotes: 14,
    createdAt: '2024-03-30',
  },
  { id: 'prop-13', businessId: 'biz-2', title: 'Launch Coffee Subscription Service', description: 'Introduce a monthly subscription box for curated coffee blends, targeting corporate clients.', options: ['Approve', 'Delay', 'Reject'], endAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', totalVotes: 9, createdAt: '2024-04-05' },
  { id: 'prop-14', businessId: 'biz-3', title: 'Add Virtual Training Platform', description: 'Develop a VR-powered training module for athletes to simulate competition scenarios.', options: ['Approve', 'Reject', 'More Info'], endAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', totalVotes: 13, createdAt: '2024-04-06' },
  { id: 'prop-15', businessId: 'biz-4', title: 'Expand Distribution to East Coast', description: 'Open new distribution center in New York to reduce shipping times.', options: ['Approve', 'Reject'], endAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', totalVotes: 7, createdAt: '2024-04-07' },
  { id: 'prop-16', businessId: 'biz-5', title: 'Integrate AI Grading', description: 'Add AI-driven automated grading to the EdTech platform.', options: ['Approve', 'Reject', 'Pilot'], endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', totalVotes: 11, createdAt: '2024-04-08' },
  { id: 'prop-17', businessId: 'biz-6', title: 'Introduce Hydroponic Line', description: 'Build a hydroponic system to grow leafy greens year‑round, reducing water usage.', options: ['Approve', 'Reject'], endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', totalVotes: 14, createdAt: '2024-04-09' },
];

export const mockBusinessUpdates: BusinessUpdate[] = [
  {
    id: 'upd-1',
    businessId: 'biz-1',
    title: 'Q1 Revenue Targets Surpassed',
    content: 'TechCorp is proud to announce that we have reached 120% of our Q1 revenue target. New partnerships with 5 enterprise clients in Bangalore have been finalized.',
    date: '2024-03-18',
    type: 'financial',
  },
  {
    id: 'upd-2',
    businessId: 'biz-1',
    title: 'AI Model V2.0 Deployment',
    content: 'Our core automation engine has been updated. Processing latency reduced by 30% across all customer workflows.',
    date: '2024-03-10',
    type: 'milestone',
  },
  {
    id: 'upd-3',
    businessId: 'biz-2',
    title: 'New Direct-to-Consumer Packaging',
    content: 'We just launched our new sustainable packaging for all online subscription orders. Early customer feedback is overwhelmingly positive!',
    date: '2024-03-22',
    type: 'general',
  },
  {
    id: 'upd-4',
    businessId: 'biz-3',
    title: 'NFL Combine Training Success',
    content: 'Three of our athletes drafted this week! This validates our proprietary biomechanics tracking system on the world stage.',
    date: '2024-03-25',
    type: 'milestone',
  },
  {
    id: 'upd-5',
    businessId: 'biz-5',
    title: 'Statewide Contract Won',
    content: 'Luminary EdTech has officially signed a 3-year contract with the Texas Board of Education, adding 40,000 new students to the platform.',
    date: '2024-03-28',
    type: 'financial',
  },
  {
    id: 'upd-6',
    businessId: 'biz-7',
    title: 'Vogue Feature Published',
    content: 'We are thrilled to be featured in this month\'s issue of Vogue highlighting sustainable fashion pioneers. Expecting a massive spike in web traffic.',
    date: '2024-03-29',
    type: 'general',
  },
  {
    id: 'upd-7',
    businessId: 'biz-9',
    title: 'Clinical Trial Phase 1 Complete',
    content: 'Our conversational AI has successfully passed Phase 1 safety trials with zero adverse events reported among the 500 participants.',
    date: '2024-03-15',
    type: 'milestone',
  },
  {
    id: 'upd-8',
    businessId: 'biz-4',
    title: 'Canning Line Operational',
    content: 'The new $150k canning line is officially operational. We can now process 120 cans per minute, increasing our distribution capabilities significantly.',
    date: '2024-03-31',
    type: 'milestone',
  },
  { id: 'upd-9', businessId: 'biz-2', title: 'Export Partnership Secured', content: 'Signed a distribution agreement with a leading European retailer, increasing overseas sales forecast by 30%.', date: '2024-04-02', type: 'financial' },
  { id: 'upd-10', businessId: 'biz-4', title: 'New Brew Flavor Launch', content: 'Introducing a limited-edition pumpkin spice brew, expected to boost Q4 sales by 15%.', date: '2024-04-03', type: 'general' },
  { id: 'upd-11', businessId: 'biz-6', title: 'Hydroponics Tech Upgrade', content: 'Implemented AI-driven nutrient dosing, improving yields by 22% while reducing water use.', date: '2024-04-04', type: 'milestone' },
  { id: 'upd-12', businessId: 'biz-7', title: 'Sustainability Award', content: 'Received the Green Fashion Innovator award for 100% recycled material sourcing.', date: '2024-04-05', type: 'milestone' },
  { id: 'upd-13', businessId: 'biz-9', title: 'AI Health App Launch', content: 'Released mobile app version 2.0 with new chat features, hitting 10k downloads in first week.', date: '2024-04-06', type: 'general' },
  { id: 'upd-14', businessId: 'biz-1', title: 'Series B Funding Closed', content: 'Raised $2M in Series B, extending runway by 24 months.', date: '2024-04-07', type: 'financial' },
  { id: 'upd-15', businessId: 'biz-2', title: 'New Coffee Blend Released', content: 'Introduced "Midnight Roast", gaining 5k new subscribers.', date: '2024-04-08', type: 'general' },
  { id: 'upd-16', businessId: 'biz-3', title: 'Olympic Athlete Partnership', content: 'Signed elite athlete for performance lab promotion.', date: '2024-04-09', type: 'milestone' },
  { id: 'upd-17', businessId: 'biz-4', title: 'Export Expansion', content: 'Secured distribution contract in Canada, projected 20% growth.', date: '2024-04-10', type: 'financial' },
  { id: 'upd-18', businessId: 'biz-5', title: 'AI Tutoring Feature', content: 'Launched AI-driven tutoring, increased engagement 30%.', date: '2024-04-11', type: 'general' },
  { id: 'upd-19', businessId: 'biz-6', title: 'Hydroponics Yield Record', content: 'Achieved record yield of 1.2M lbs per month.', date: '2024-04-12', type: 'milestone' },
  { id: 'upd-20', businessId: 'biz-7', title: 'Sustainability Report 2024', content: 'Published ESG report, carbon neutral status achieved.', date: '2024-04-13', type: 'general' },
];

// Mock database
export const mockUsers: User[] = [
  { id: 'user-john', name: 'Jonathan Mercer', email: 'j.mercer@firstcapitalgroup.io', role: 'investor', createdAt: '2024-01-15', kycVerified: true },
  { id: 'user-dhruv', name: 'Dhruv Singh', email: 'dhruvsonar@gmail.com', role: 'investor', createdAt: '2024-03-01', kycVerified: true },
  { id: 'user-sarah', name: 'Sarah Johnson', email: 'sarah.johnson@techcorpsolutions.com', role: 'business', createdAt: '2024-01-20' },
  { id: 'user-mike', name: 'Mike Chen', email: 'mike.chen@embercoffeeroasters.com', role: 'business', createdAt: '2024-02-01' },
  { id: 'user-emma', name: 'Emma Rodriguez', email: 'emma.rodriguez@apexperflabs.com', role: 'business', createdAt: '2024-01-28' },
  { id: 'user-david', name: 'David Kim', email: 'david.kim@vaultbrewing.co', role: 'business', createdAt: '2024-02-10' },
  { id: 'user-lisa', name: 'Lisa Thompson', email: 'lisa.thompson@luminaryedtech.com', role: 'business', createdAt: '2024-01-20' },
  { id: 'user-robert', name: 'Robert Wilson', email: 'r.wilson@terrafreshfarms.com', role: 'business', createdAt: '2024-02-05' },
  { id: 'user-alice', name: 'Alice Vance', email: 'alice.vance@stitchandthread.co', role: 'business', createdAt: '2024-03-01' },
  { id: 'user-bob', name: 'Bob Miller', email: 'bob.miller@revupauto.com', role: 'business', createdAt: '2024-03-05' },
  { id: 'user-charlie', name: 'Charlie Day', email: 'charlie.day@clarityhealthai.com', role: 'business', createdAt: '2024-03-10' },
];

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1',
    ownerId: 'user-sarah',
    businessName: 'TechCorp Solutions',
    category: 'Technology',
    location: 'San Francisco, CA',
    description: 'AI-powered business automation platform helping SMEs cut operational costs by 40%. Our suite includes intelligent workflow management, predictive analytics, and seamless CRM integrations — trusted by 500+ clients across the US.',
    createdAt: '2024-01-20',
    pitchDeckUrl: 'https://example.com/techcorp-pitch.pdf',
    financialsUrl: 'https://example.com/techcorp-financials.csv',
  },
  {
    id: 'biz-2',
    ownerId: 'user-mike',
    businessName: 'Ember Coffee Roasters',
    category: 'Food & Beverage',
    location: 'Portland, OR',
    description: 'Award-winning specialty coffee roastery sourcing single-origin beans from 12 countries. We sell through 3 brick-and-mortar cafes and a growing DTC subscription with over 8,000 active members nationwide.',
    createdAt: '2024-02-01',
  },
  {
    id: 'biz-3',
    ownerId: 'user-emma',
    businessName: 'Apex Performance Labs',
    category: 'Health & Fitness',
    location: 'Austin, TX',
    description: 'Science-backed performance training studio combining biometric tracking, elite coaching, and recovery therapy. With 3 locations in Austin and franchise plans underway, we have trained 2,000+ athletes from weekend warriors to NFL prospects.',
    createdAt: '2024-01-28',
  },
  {
    id: 'biz-4',
    ownerId: 'user-david',
    businessName: 'Vault Brewing Co.',
    category: 'Food & Beverage',
    location: 'Denver, CO',
    description: 'Craft brewery built inside a converted 1920s bank vault. We offer 18 rotating taps, a full kitchen, and a taproom that draws 1,200+ visitors weekly. Distribution now expanding across the Rocky Mountain region.',
    createdAt: '2024-02-10',
  },
  {
    id: 'biz-5',
    ownerId: 'user-lisa',
    businessName: 'Luminary EdTech',
    category: 'Education',
    location: 'Boston, MA',
    description: 'Adaptive learning platform for K-12 STEM education. Our AI tutor personalizes curriculum in real time and has improved student test scores by an average of 28%. Currently deployed in 340 schools across 14 states.',
    createdAt: '2024-01-20',
  },
  {
    id: 'biz-6',
    ownerId: 'user-robert',
    businessName: 'Terra Fresh Farms',
    category: 'AgriTech',
    location: 'Nashville, TN',
    description: 'Vertical indoor farming operation growing pesticide-free leafy greens, herbs, and microgreens year-round. Supplying Whole Foods, Kroger, and 80 independent grocers across the Southeast with same-day harvested produce.',
    createdAt: '2024-02-05',
  },
  {
    id: 'biz-7',
    ownerId: 'user-alice',
    businessName: 'Stitch & Thread',
    category: 'Fashion & Apparel',
    location: 'Los Angeles, CA',
    description: 'Sustainable DTC fashion brand manufacturing 100% from recycled materials. Featured in Vogue, GQ, and Forbes 30 Under 30. $2.4M in revenue last year with zero paid advertising — built entirely on community and product quality.',
    createdAt: '2024-03-01',
  },
  {
    id: 'biz-8',
    ownerId: 'user-bob',
    businessName: 'RevUp Auto',
    category: 'Automotive',
    location: 'Detroit, MI',
    description: 'On-demand mobile auto repair and EV conversion service. Our certified technicians come to you — saving customers an average of $400 vs. dealerships. Servicing 6 metro areas with a waitlist of 3,000+ customers.',
    createdAt: '2024-03-05',
  },
  {
    id: 'biz-9',
    ownerId: 'user-charlie',
    businessName: 'Clarity Health AI',
    category: 'HealthTech',
    location: 'Seattle, WA',
    description: 'Mental wellness platform using conversational AI and licensed therapist oversight to deliver affordable, always-on mental health support. 95,000+ active users, FDA breakthrough device designation pending.',
    createdAt: '2024-01-28',
  },
];

export const mockListings: Listing[] = [
  { id: 'list-1', businessId: 'biz-1', fundingGoal: 500000, amountRaised: 387500, equityOffered: 15, investorsCount: 31, createdAt: '2024-01-25', isActive: true },
  { id: 'list-2', businessId: 'biz-2', fundingGoal: 180000, amountRaised: 126000, equityOffered: 12, investorsCount: 19, createdAt: '2024-02-05', isActive: true },
  { id: 'list-3', businessId: 'biz-3', fundingGoal: 320000, amountRaised: 224000, equityOffered: 18, investorsCount: 27, createdAt: '2024-02-07', isActive: true },
  { id: 'list-4', businessId: 'biz-4', fundingGoal: 240000, amountRaised: 168000, equityOffered: 10, investorsCount: 14, createdAt: '2024-02-14', isActive: true },
  { id: 'list-5', businessId: 'biz-5', fundingGoal: 450000, amountRaised: 360000, equityOffered: 20, investorsCount: 48, createdAt: '2024-01-28', isActive: true },
  { id: 'list-6', businessId: 'biz-6', fundingGoal: 280000, amountRaised: 182000, equityOffered: 14, investorsCount: 22, createdAt: '2024-02-11', isActive: true },
  { id: 'list-7', businessId: 'biz-7', fundingGoal: 150000, amountRaised: 127500, equityOffered: 16, investorsCount: 35, createdAt: '2024-02-16', isActive: true },
  { id: 'list-8', businessId: 'biz-8', fundingGoal: 220000, amountRaised: 110000, equityOffered: 11, investorsCount: 16, createdAt: '2024-02-18', isActive: true },
  { id: 'list-9', businessId: 'biz-9', fundingGoal: 600000, amountRaised: 510000, equityOffered: 22, investorsCount: 64, createdAt: '2024-01-30', isActive: true },
  { id: 'list-10', businessId: 'biz-1', fundingGoal: 400000, amountRaised: 200000, equityOffered: 12, investorsCount: 22, createdAt: '2024-03-10', isActive: true },
  { id: 'list-11', businessId: 'biz-2', fundingGoal: 250000, amountRaised: 150000, equityOffered: 14, investorsCount: 30, createdAt: '2024-03-12', isActive: true },
  { id: 'list-12', businessId: 'biz-3', fundingGoal: 350000, amountRaised: 300000, equityOffered: 16, investorsCount: 40, createdAt: '2024-03-14', isActive: true },
  { id: 'list-13', businessId: 'biz-4', fundingGoal: 200000, amountRaised: 180000, equityOffered: 9, investorsCount: 18, createdAt: '2024-03-16', isActive: true },
  { id: 'list-14', businessId: 'biz-5', fundingGoal: 500000, amountRaised: 400000, equityOffered: 22, investorsCount: 55, createdAt: '2024-03-18', isActive: true },
  { id: 'list-15', businessId: 'biz-6', fundingGoal: 300000, amountRaised: 250000, equityOffered: 13, investorsCount: 28, createdAt: '2024-03-20', isActive: true },
  { id: 'list-16', businessId: 'biz-2', fundingGoal: 220000, amountRaised: 165000, equityOffered: 12, investorsCount: 20, createdAt: '2024-04-01', isActive: true },
  { id: 'list-17', businessId: 'biz-3', fundingGoal: 340000, amountRaised: 255000, equityOffered: 15, investorsCount: 30, createdAt: '2024-04-03', isActive: true },
  { id: 'list-18', businessId: 'biz-4', fundingGoal: 260000, amountRaised: 195000, equityOffered: 11, investorsCount: 22, createdAt: '2024-04-05', isActive: true },
  { id: 'list-19', businessId: 'biz-5', fundingGoal: 480000, amountRaised: 384000, equityOffered: 20, investorsCount: 48, createdAt: '2024-04-07', isActive: true },
  { id: 'list-20', businessId: 'biz-6', fundingGoal: 310000, amountRaised: 248000, equityOffered: 14, investorsCount: 35, createdAt: '2024-04-09', isActive: true },
  { id: 'list-21', businessId: 'biz-7', fundingGoal: 200000, amountRaised: 150000, equityOffered: 16, investorsCount: 40, createdAt: '2024-04-11', isActive: true },
  { id: 'list-22', businessId: 'biz-8', fundingGoal: 240000, amountRaised: 180000, equityOffered: 13, investorsCount: 28, createdAt: '2024-04-13', isActive: true },
];

export const mockInvestments: Investment[] = [
  { id: 'inv-1', userId: 'user-john', listingId: 'list-1', amount: 25000, equityReceived: 0.75, investedAt: '2024-02-01' },
  { id: 'inv-2', userId: 'user-john', listingId: 'list-5', amount: 30000, equityReceived: 1.33, investedAt: '2024-02-10' },
  { id: 'inv-3', userId: 'user-john', listingId: 'list-9', amount: 50000, equityReceived: 1.83, investedAt: '2024-02-15' },
  { id: 'inv-4', userId: 'user-dhruv', listingId: 'list-1', amount: 150000, equityReceived: 4.5, investedAt: '2024-02-18' },
  { id: 'inv-5', userId: 'user-dhruv', listingId: 'list-2', amount: 45000, equityReceived: 3.0, investedAt: '2024-02-20' },
  { id: 'inv-6', userId: 'user-dhruv', listingId: 'list-6', amount: 80000, equityReceived: 4.0, investedAt: '2024-02-25' },
  { id: 'inv-7', userId: 'user-alice', listingId: 'list-3', amount: 12000, equityReceived: 0.675, investedAt: '2024-03-01' },
  { id: 'inv-8', userId: 'user-alice', listingId: 'list-4', amount: 24000, equityReceived: 1.0, investedAt: '2024-03-05' },
  { id: 'inv-9', userId: 'user-bob', listingId: 'list-5', amount: 85000, equityReceived: 3.77, investedAt: '2024-03-10' },
  { id: 'inv-10', userId: 'user-bob', listingId: 'list-7', amount: 15000, equityReceived: 1.6, investedAt: '2024-03-12' },
  { id: 'inv-11', userId: 'user-charlie', listingId: 'list-8', amount: 55000, equityReceived: 2.75, investedAt: '2024-03-15' },
  { id: 'inv-12', userId: 'user-charlie', listingId: 'list-9', amount: 120000, equityReceived: 4.4, investedAt: '2024-03-18' },
  { id: 'inv-13', userId: 'user-sarah', listingId: 'list-3', amount: 45000, equityReceived: 2.53, investedAt: '2024-03-20' },
  { id: 'inv-14', userId: 'user-mike', listingId: 'list-6', amount: 32000, equityReceived: 1.6, investedAt: '2024-03-22' },
  { id: 'inv-15', userId: 'user-emma', listingId: 'list-7', amount: 75000, equityReceived: 8.0, investedAt: '2024-03-25' },
  { id: 'inv-16', userId: 'user-john', listingId: 'list-4', amount: 60000, equityReceived: 2.5, investedAt: '2024-03-28' },
  { id: 'inv-17', userId: 'user-john', listingId: 'list-10', amount: 50000, equityReceived: 2.0, investedAt: '2024-04-01' },
  { id: 'inv-18', userId: 'user-dhruv', listingId: 'list-11', amount: 60000, equityReceived: 2.4, investedAt: '2024-04-02' },
  { id: 'inv-19', userId: 'user-alice', listingId: 'list-12', amount: 30000, equityReceived: 1.875, investedAt: '2024-04-03' },
  { id: 'inv-20', userId: 'user-bob', listingId: 'list-13', amount: 40000, equityReceived: 2.0, investedAt: '2024-04-04' },
  { id: 'inv-21', userId: 'user-charlie', listingId: 'list-14', amount: 55000, equityReceived: 2.75, investedAt: '2024-04-05' },
  { id: 'inv-22', userId: 'user-sarah', listingId: 'list-15', amount: 70000, equityReceived: 5.38, investedAt: '2024-04-06' },
  { id: 'inv-23', userId: 'user-mike', listingId: 'list-10', amount: 25000, equityReceived: 1.0, investedAt: '2024-04-07' },
  { id: 'inv-24', userId: 'user-emma', listingId: 'list-11', amount: 35000, equityReceived: 2.1, investedAt: '2024-04-08' },
  { id: 'inv-25', userId: 'user-robert', listingId: 'list-12', amount: 45000, equityReceived: 2.8125, investedAt: '2024-04-09' },
  { id: 'inv-26', userId: 'user-lisa', listingId: 'list-13', amount: 30000, equityReceived: 1.5, investedAt: '2024-04-10' },
  { id: 'inv-27', userId: 'user-alice', listingId: 'list-16', amount: 50000, equityReceived: 2.73, investedAt: '2024-04-12' },
  { id: 'inv-28', userId: 'user-bob', listingId: 'list-17', amount: 60000, equityReceived: 2.65, investedAt: '2024-04-13' },
  { id: 'inv-29', userId: 'user-charlie', listingId: 'list-18', amount: 70000, equityReceived: 3.18, investedAt: '2024-04-14' },
  { id: 'inv-30', userId: 'user-dhruv', listingId: 'list-19', amount: 80000, equityReceived: 4.0, investedAt: '2024-04-15' },
  { id: 'inv-31', userId: 'user-emma', listingId: 'list-20', amount: 90000, equityReceived: 6.45, investedAt: '2024-04-16' },
  { id: 'inv-32', userId: 'user-robert', listingId: 'list-21', amount: 100000, equityReceived: 8.0, investedAt: '2024-04-17' },
  { id: 'inv-33', userId: 'user-lisa', listingId: 'list-22', amount: 110000, equityReceived: 9.52, investedAt: '2024-04-18' },
];

// Calculate equity per dollar for a listing
export const calculateEquityPerDollar = (listing: Listing): number => {
  return listing.equityOffered / listing.fundingGoal;
};

// Alias for backward compatibility with InvestModal
export const calculateEquityPerRupee = calculateEquityPerDollar;

// Calculate equity received for an investment amount
export const calculateEquityReceived = (amount: number, listing: Listing): number => {
  return amount * calculateEquityPerDollar(listing);
};

// Formatter helpers
export const formatEquity = (equity: number): string => {
  if (equity >= 1) {
    return `${equity.toFixed(2)}%`;
  } else if (equity >= 0.01) {
    return `${equity.toFixed(3)}%`;
  } else {
    return `${(equity * 100).toFixed(4)}%`;
  }
};