export const mockProperties = [
  {
    id: "1",
    name: "Deluxe Garden Room",
    description: "Room with garden view",
    price: 500000,
    rooms: [
      { id: "r1", name: "King Bed", price: 500000, available: true },
      { id: "r2", name: "Queen Bed", price: 450000, available: false },
    ],
    availability: [
      { date: "2025-09-05", price: 500000 },
      { date: "2025-09-06", price: 550000 },
    ],
  },
  {
    id: "2",
    name: "Ocean View Suite",
    description: "Room with ocean view",
    price: 1000000,
    rooms: [
      { id: "r3", name: "Suite Room", price: 1000000, available: true },
    ],
    availability: [
      { date: "2025-09-05", price: 1000000 },
      { date: "2025-09-06", price: 1200000 },
    ],
  },
];
