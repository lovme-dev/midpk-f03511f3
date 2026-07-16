export interface CarPackage {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  description: string;
}

export const carPackages: CarPackage[] = [
  // NEW PORSCHE CARS - Added December 2024
  {
    id: 30,
    name: "Porsche Cayenne Turbo GT - Red",
    image: "/lovable-uploads/porsche-cayenne-red.jpeg",
    price: 6000,
    originalPrice: 31000,
    description: "Fiery red Porsche Cayenne Turbo GT"
  },
  {
    id: 31,
    name: "Porsche Panamera - Emerald Green",
    image: "/lovable-uploads/porsche-panamera-green.jpeg",
    price: 6000,
    originalPrice: 31000,
    description: "Stunning emerald green Porsche Panamera"
  },
  {
    id: 32,
    name: "Porsche 918 Spyder - Silver",
    image: "/lovable-uploads/porsche-918-silver.jpeg",
    price: 6000,
    originalPrice: 31000,
    description: "Classic silver Porsche 918 Spyder"
  },
  {
    id: 33,
    name: "Porsche Panamera - Neon Blue",
    image: "/lovable-uploads/porsche-panamera-blue.jpeg",
    price: 6000,
    originalPrice: 31000,
    description: "Electric neon blue Porsche Panamera"
  },
  {
    id: 34,
    name: "Porsche 918 Spyder - Pink Racing",
    image: "/lovable-uploads/porsche-918-pink-racing.jpeg",
    price: 12000,
    originalPrice: 31000,
    description: "Premium pink racing Porsche 918 Spyder #23"
  },
  {
    id: 35,
    name: "Porsche 911 Targa - Galaxy",
    image: "/lovable-uploads/porsche-911-galaxy.jpeg",
    price: 12000,
    originalPrice: 31000,
    description: "Rare galaxy glitter Porsche 911 Targa"
  },
  {
    id: 36,
    name: "Porsche Cayenne - Racing Livery",
    image: "/lovable-uploads/porsche-cayenne-racing.jpeg",
    price: 12000,
    originalPrice: 31000,
    description: "Premium Porsche Cayenne with racing livery"
  },
  // EXISTING CARS
  {
    id: 1,
    name: "Golden Thunder",
    image: "/lovable-uploads/2d9247e3-897b-434c-a2c5-4ad1c0c6db1d.png",
    price: 6000,
    originalPrice: 31000,
    description: "Ultimate golden racing machine"
  },
  {
    id: 2,
    name: "Bronze Beast",
    image: "/lovable-uploads/83aa45ec-0470-4651-91fb-1da9c3a6f088.png",
    price: 6000,
    originalPrice: 31000,
    description: "Powerful bronze combat vehicle"
  },
  {
    id: 3,
    name: "Purple Lightning",
    image: "/lovable-uploads/fce13bca-8899-4df8-a14b-f2e25528d1d8.png",
    price: 12000,
    originalPrice: 31000,
    description: "Electric purple speed demon"
  },
  {
    id: 4,
    name: "Silver Storm",
    image: "/lovable-uploads/6000e08f-2866-412e-81c8-a9e64173fde1.png",
    price: 12000,
    originalPrice: 31000,
    description: "Sleek silver racing machine"
  },
  {
    id: 5,
    name: "Cosmic Cruiser",
    image: "/lovable-uploads/2ae6baf3-46c9-4b5e-915b-dbbe5947ad00.png",
    price: 12000,
    originalPrice: 31000,
    description: "Futuristic cosmic vehicle"
  },
  {
    id: 6,
    name: "Shadow Racer",
    image: "/lovable-uploads/8b682cc0-b608-491a-8bbe-dbba8fce90de.png",
    price: 6000,
    originalPrice: 31000,
    description: "Dark red performance car"
  },
  {
    id: 7,
    name: "Blue Phantom",
    image: "/lovable-uploads/0c43c1f8-5fad-4868-aeac-0f1bf526896b.png",
    price: 6000,
    originalPrice: 31000,
    description: "Blue lightning speedster"
  },
  {
    id: 8,
    name: "Fire Phoenix",
    image: "/lovable-uploads/275aff6a-9d0d-47f9-b353-115622986e7f.png",
    price: 12000,
    originalPrice: 31000,
    description: "Fiery red sports car"
  },
  {
    id: 9,
    name: "Golden Eagle",
    image: "/lovable-uploads/ce075a04-5494-4ea4-925c-c8b9c1570a94.png",
    price: 6000,
    originalPrice: 31000,
    description: "White and gold luxury car"
  },
  {
    id: 10,
    name: "Midnight Ghost",
    image: "/lovable-uploads/fc89dc27-720b-4caa-9df2-886858acedf0.png",
    price: 6000,
    originalPrice: 31000,
    description: "Stealth black racing car"
  },
  {
    id: 11,
    name: "Holographic Veyron",
    image: "/lovable-uploads/2afc4898-f0a9-4c53-85f1-1dc32e6c274e.png",
    price: 12000,
    originalPrice: 31000,
    description: "Holographic luxury supercar"
  },
  {
    id: 12,
    name: "Blue Veyron Elite",
    image: "/lovable-uploads/edefc8c8-a2f9-4ff9-a193-3911930259f7.png",
    price: 6000,
    originalPrice: 31000,
    description: "Premium blue racing machine"
  },
  {
    id: 13,
    name: "Gold Edition Veyron",
    image: "/lovable-uploads/8372b291-e35e-4806-8edd-acdc64f5be74.png",
    price: 6000,
    originalPrice: 31000,
    description: "Limited gold edition supercar"
  },
  {
    id: 14,
    name: "McLaren Golden Beast",
    image: "/lovable-uploads/bb6a8ccb-09f2-4909-a3c7-57e1242fcd21.png",
    price: 12000,
    originalPrice: 31000,
    description: "Golden McLaren performance car"
  },
  {
    id: 15,
    name: "Pink Camo McLaren",
    image: "/lovable-uploads/6f512573-ba2b-4d67-819b-6c62636f9615.png",
    price: 12000,
    originalPrice: 31000,
    description: "Pink camouflage McLaren"
  },
  {
    id: 16,
    name: "Reflective Gold McLaren",
    image: "/lovable-uploads/5eedcb74-d706-43f7-8937-b20fe7aae39b.png",
    price: 12000,
    originalPrice: 31000,
    description: "Reflective gold McLaren supercar"
  },
  {
    id: 17,
    name: "Aurora McLaren",
    image: "/lovable-uploads/efba289c-37f1-4ce4-9af3-c29b8e199f5e.png",
    price: 6000,
    originalPrice: 31000,
    description: "Aurora colored McLaren"
  },
  {
    id: 18,
    name: "Purple McLaren GT",
    image: "/lovable-uploads/a50698f0-4bc0-465a-9209-3ae074bccb35.png",
    price: 6000,
    originalPrice: 31000,
    description: "Purple McLaren GT edition"
  },
  {
    id: 19,
    name: "Pearl White McLaren",
    image: "/lovable-uploads/b00c79e0-51e1-43f7-b38b-faba0335c283.png",
    price: 12000,
    originalPrice: 31000,
    description: "Pearl white McLaren luxury"
  },
  {
    id: 20,
    name: "Classic White McLaren",
    image: "/lovable-uploads/8b0fd12b-5c05-46fd-b82c-ff9d435f266a.png",
    price: 6000,
    originalPrice: 31000,
    description: "Classic white McLaren sports car"
  },
  {
    id: 21,
    name: "Stealth McLaren",
    image: "/lovable-uploads/53210373-5703-401a-aadd-2edfed9803c3.png",
    price: 6000,
    originalPrice: 31000,
    description: "Stealth black McLaren with orange interior"
  },
  {
    id: 22,
    name: "Hologram Lambo",
    image: "/lovable-uploads/ed82ef52-6e0b-445c-a5e9-59f806718679.png",
    price: 12000,
    originalPrice: 31000,
    description: "Holographic Lamborghini supercar"
  },
  {
    id: 23,
    name: "Red Thunder Lambo",
    image: "/lovable-uploads/80aa0867-0542-4612-babe-bd55676a0169.png",
    price: 12000,
    originalPrice: 31000,
    description: "Red Lamborghini racing beast"
  },
  {
    id: 24,
    name: "Aurora Lambo",
    image: "/lovable-uploads/6142f11a-0105-4308-b122-0a1feabad27d.png",
    price: 6000,
    originalPrice: 31000,
    description: "Aurora green Lamborghini"
  },
  {
    id: 25,
    name: "Emerald Lambo",
    image: "/lovable-uploads/ffa69916-c0a1-477f-a5dc-49b3205af04c.png",
    price: 6000,
    originalPrice: 31000,
    description: "Emerald green Lamborghini"
  },
  {
    id: 26,
    name: "Genesis Hologram",
    image: "/lovable-uploads/9150cdc2-aa7c-4e04-9faf-7bd9927508bc.png",
    price: 12000,
    originalPrice: 31000,
    description: "Holographic Genesis luxury sedan"
  },
  {
    id: 27,
    name: "Silver Genesis",
    image: "/lovable-uploads/187ba4a9-4a00-4ab9-8d19-3218a6ed7066.png",
    price: 6000,
    originalPrice: 31000,
    description: "Silver Genesis luxury coupe"
  },
  {
    id: 28,
    name: "Pagani Rainbow",
    image: "/lovable-uploads/ead67a31-6357-443c-91bd-805b9d210119.png",
    price: 12000,
    originalPrice: 31000,
    description: "Rainbow holographic Pagani"
  },
  {
    id: 29,
    name: "Pagani Chrome",
    image: "/lovable-uploads/38e9ce46-913f-491f-99d4-a5820366d20c.png",
    price: 12000,
    originalPrice: 31000,
    description: "Chrome finish Pagani hypercar"
  }
];

export const getCarPackageById = (id: number): CarPackage | undefined => {
  return carPackages.find(pkg => pkg.id === id);
};