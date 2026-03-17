export interface FranchiseStore {
  id: string;
  sellerId: string;
  name: string;
  city: string;
  state: string;
  address: string;
}

export const FRANCHISE_STORES: FranchiseStore[] = [
  { id: 'hmartusqaca', sellerId: 'hmartusqaca', name: 'H Mart Lakewood', city: 'Lakewood', state: 'CA', address: 'Lakewood, CA' },
  { id: 'hmartusqanls', sellerId: 'hmartusqanls', name: 'H Mart Niles', city: 'Niles', state: 'IL', address: 'Niles, IL' },
  { id: 'hmartusqahsv', sellerId: 'hmartusqahsv', name: 'H Mart New Jersey', city: 'New Jersey', state: 'NJ', address: 'New Jersey, NJ' },
  { id: 'hmartusqaord', sellerId: 'hmartusqaord', name: 'H Mart Orlando', city: 'Orlando', state: 'FL', address: 'Orlando, FL' },
  { id: 'hmartusqahrh', sellerId: 'hmartusqahrh', name: 'H Mart Dallas', city: 'Dallas', state: 'TX', address: 'Dallas – Harry Hines, TX' },
];

export const DEFAULT_STORE = FRANCHISE_STORES[0];
