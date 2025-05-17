export interface ScentNote {
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: 'prime' | 'premium';
  isBestSeller?: boolean;
  scentNotes?: ScentNote[];
}

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Grand Soir Eau de Parfum',
    brand: 'Amouage',
    price: 48000,
    imageUrl: '/images/products/grand_soir.png',
    category: 'prime',
    isBestSeller: true,
    scentNotes: [
      { name: 'Amber', imageUrl: '/images/scent_notes/amber.png' },
      { name: 'Vanilla', imageUrl: '/images/scent_notes/vanilla.png' },
      { name: 'Benzoin', imageUrl: '/images/scent_notes/benzoin.png' },
      { name: 'Tonka', imageUrl: '/images/scent_notes/tonka.png' },
    ]
  },
  {
    id: '2',
    name: 'Boadecia Complex',
    brand: 'Grand Soir',
    price: 48000,
    imageUrl: '/images/products/boadecia.png',
    category: 'prime',
    isBestSeller: true,
    scentNotes: [
      { name: 'Oud', imageUrl: '/images/scent_notes/oud.png' },
      { name: 'Rose', imageUrl: '/images/scent_notes/rose.png' },
      { name: 'Saffron', imageUrl: '/images/scent_notes/saffron.png' },
    ]
  },
  {
    id: '3',
    name: 'Whispers of Guilt',
    brand: 'Amouage',
    price: 48000,
    imageUrl: '/images/products/whispers_guilt.png',
    category: 'prime',
    isBestSeller: true,
    scentNotes: [
      { name: 'Incense', imageUrl: '/images/scent_notes/incense.png' },
      { name: 'Myrrh', imageUrl: '/images/scent_notes/myrrh.png' },
      { name: 'Vetiver', imageUrl: '/images/scent_notes/vetiver.png' },
      { name: 'Elemi', imageUrl: '/images/scent_notes/elemi.png' },
    ]
  },
  {
    id: '4',
    name: 'Special Edition Oud',
    brand: 'Amouage',
    price: 48000,
    imageUrl: '/images/products/special_oud.png',
    category: 'prime',
    scentNotes: [
      { name: 'Dark Oud', imageUrl: '/images/scent_notes/dark_oud.png' },
      { name: 'Patchouli', imageUrl: '/images/scent_notes/patchouli.png' },
      { name: 'Leather', imageUrl: '/images/scent_notes/leather.png' },
    ]
  },
  {
    id: '5',
    name: 'Desert Mirage',
    brand: 'Fragrance Du Bois',
    price: 52000,
    imageUrl: '/images/products/desert_mirage.png',
    category: 'premium',
    scentNotes: [
      { name: 'Sandalwood', imageUrl: '/images/scent_notes/sandalwood.png' },
      { name: 'Cardamom', imageUrl: '/images/scent_notes/cardamom.png' },
      { name: 'Jasmine', imageUrl: '/images/scent_notes/jasmine.png' },
    ]
  },
  {
    id: '6',
    name: 'Celestial Bloom',
    brand: 'Roja Parfums',
    price: 65000,
    imageUrl: '/images/products/celestial_bloom.png',
    category: 'premium',
    isBestSeller: true,
    scentNotes: [
      { name: 'Bergamot', imageUrl: '/images/scent_notes/bergamot.png' },
      { name: 'Neroli', imageUrl: '/images/scent_notes/neroli.png' },
      { name: 'White Musk', imageUrl: '/images/scent_notes/white_musk.png' },
      { name: 'Peony', imageUrl: '/images/scent_notes/peony.png' },
    ]
  }
];
