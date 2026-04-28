// Sample data for TechHaven
export interface Product {
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  images: string[];
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
  specifications?: Record<string, any>;
}

export const sampleProducts: Product[] = [
  // Laptops
  {
    name: "MacBook Pro 16",
    brand: "Apple",
    category: "Laptops",
    price: 2499,
    discountPrice: 2699,
    stock: 15,
    description: "MacBook Pro 16-inch with M3 Max chip, 36GB RAM, 1TB SSD.",
    images: ["https://images.unsplash.com/photo-1517336714460-d1b16dd1906d?q=80&w=1000"],
    rating: 4.9,
    numReviews: 120,
    isFeatured: true,
    specifications: { CPU: "M3 Max", RAM: "36GB", Storage: "1TB SSD", Display: "16-inch Liquid Retina XDR" }
  },
  {
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    price: 1899,
    stock: 10,
    description: "Powerful performance laptop with infinity display.",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"],
    rating: 4.7,
    numReviews: 85,
    specifications: { CPU: "Intel i9", RAM: "32GB", Storage: "1TB SSD", GPU: "RTX 4050" }
  },
  {
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    category: "Laptops",
    price: 1599,
    stock: 8,
    description: "Small size, massive performance gaming laptop.",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000"],
    rating: 4.8,
    numReviews: 210,
    isFeatured: true,
    specifications: { CPU: "AMD Ryzen 9", RAM: "16GB", Storage: "1TB SSD", GPU: "RTX 4060" }
  },
  // GPUs
  {
    name: "NVIDIA GeForce RTX 4090",
    brand: "MSI",
    category: "GPUs",
    price: 1999,
    stock: 5,
    description: "The ultimate GeForce GPU. Beyond fast.",
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000"],
    rating: 4.9,
    numReviews: 45,
    isFeatured: true,
    specifications: { Memory: "24GB GDDR6X", Interface: "PCI-E 4.0", TDP: "450W" }
  },
  {
    name: "AMD Radeon RX 7900 XTX",
    brand: "PowerColor",
    category: "GPUs",
    price: 999,
    stock: 12,
    description: "High-performance RDNA 3 architecture.",
    images: ["https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=1000"],
    rating: 4.6,
    numReviews: 30,
    specifications: { Memory: "24GB GDDR6", Interface: "PCI-E 4.0", TDP: "355W" }
  },
  // CPUs
  {
    name: "Intel Core i9-14900K",
    brand: "Intel",
    category: "CPUs",
    price: 589,
    stock: 20,
    description: "Desktop Processor with 24 cores (8 P-cores + 16 E-cores).",
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000"],
    rating: 4.8,
    numReviews: 150,
    specifications: { Cores: "24", Threads: "32", Socket: "LGA1700", Base: "3.2 GHz" }
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "CPUs",
    price: 449,
    stock: 25,
    description: "The world's fastest gaming processor.",
    images: ["https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=1000"],
    rating: 4.9,
    numReviews: 300,
    isFeatured: true,
    specifications: { Cores: "8", Threads: "16", Socket: "AM5", L3Cache: "96MB" }
  },
  // Adding more to reach requirements
  { name: "Lenovo Legion 5i", brand: "Lenovo", category: "Laptops", price: 1299, stock: 15, description: "Solid gaming performance.", images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000"], rating: 4.5, numReviews: 60 },
  { name: "HP Spectre x360", brand: "HP", category: "Laptops", price: 1499, stock: 10, description: "Premium 2-in-1 experience.", images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000"], rating: 4.6, numReviews: 40 },
  { name: "MSI Raider GE78", brand: "MSI", category: "Laptops", price: 2999, stock: 5, description: "Titan of gaming laptops.", images: ["https://images.unsplash.com/photo-1517336714460-d1b16dd1906d?q=80&w=1000"], rating: 4.7, numReviews: 25 },
  { name: "Corsair Vengeance 32GB", brand: "Corsair", category: "RAM", price: 120, stock: 50, description: "DDR5 6000MHz memory.", images: ["https://images.unsplash.com/photo-1541029071473-0ce468355080?q=80&w=1000"], rating: 4.8, numReviews: 400 },
  { name: "Samsung 990 Pro 2TB", brand: "Samsung", category: "Storage", price: 180, stock: 40, description: "NVMe Gen4 SSD.", images: ["https://images.unsplash.com/photo-1544244015-0cd4b3ff569d?q=80&w=1000"], rating: 4.9, numReviews: 500 },
  { name: "ASUS ROG Maximus Z790", brand: "ASUS", category: "Motherboards", price: 650, stock: 10, description: "Extreme performance motherboard.", images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000"], rating: 4.7, numReviews: 45 },
  { name: "Logitech G Pro X Superlight", brand: "Logitech", category: "Accessories", price: 150, stock: 100, description: "Ultralight gaming mouse.", images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000"], rating: 4.9, numReviews: 1200 },
  { name: "Razer Huntsman V3 Pro", brand: "Razer", category: "Accessories", price: 250, stock: 30, description: "Analog optical keyboard.", images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000"], rating: 4.7, numReviews: 80 }
];
