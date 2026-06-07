export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  image: string;
  featured?: boolean;
}

export const categories = [
  {
    id: 'laptop-screens',
    name: 'Laptop Screens',
    description: 'High-quality replacement screens for all major laptop brands',
    icon: 'Monitor',
  },
  {
    id: 'monitor-parts',
    name: 'Monitor Components',
    description: 'Professional-grade monitor parts and components',
    icon: 'MonitorSpeaker',
  },
  {
    id: 'cctv-cameras',
    name: 'CCTV Cameras',
    description: 'Advanced surveillance camera systems',
    icon: 'Camera',
  },
  {
    id: 'cctv-accessories',
    name: 'CCTV Accessories',
    description: 'Complete range of CCTV mounting and connectivity solutions',
    icon: 'Cctv',
  },
  {
    id: 'ac-parts',
    name: 'AC Spare Parts',
    description: 'Genuine air conditioner components and parts',
    icon: 'Wind',
  },
  {
    id: 'electronic-components',
    name: 'Electronic Components',
    description: 'Quality electronic parts for various applications',
    icon: 'Cpu',
  },
];

export const products: Product[] = [
  // Laptop Screens
  {
    id: '1',
    name: '15.6" FHD LCD Display',
    category: 'laptop-screens',
    description: 'Full HD 1920x1080 replacement screen for most 15.6" laptops',
    specs: ['1920x1080 Resolution', 'IPS Panel', '60Hz Refresh Rate', 'LED Backlight'],
    image: 'laptop screen display',
    featured: true,
  },
  {
    id: '2',
    name: '14" HD Laptop Screen',
    category: 'laptop-screens',
    description: 'High-definition 1366x768 display panel',
    specs: ['1366x768 Resolution', 'TN Panel', 'Matte Finish', '30-pin Connector'],
    image: 'laptop monitor display',
  },
  {
    id: '3',
    name: '17.3" FHD Gaming Display',
    category: 'laptop-screens',
    description: 'Premium gaming laptop screen with high refresh rate',
    specs: ['1920x1080 Resolution', '120Hz Refresh Rate', 'IPS Panel', 'Anti-Glare'],
    image: 'gaming laptop screen',
    featured: true,
  },

  // Monitor Parts
  {
    id: '4',
    name: 'Monitor Power Board',
    category: 'monitor-parts',
    description: 'Universal monitor power supply board',
    specs: ['12V/5V Output', 'Universal Compatibility', 'Overcurrent Protection'],
    image: 'electronic circuit board',
  },
  {
    id: '5',
    name: 'LCD Controller Board',
    category: 'monitor-parts',
    description: 'HDMI/VGA/DVI compatible LCD controller',
    specs: ['Multiple Input Support', 'OSD Control', 'Audio Output'],
    image: 'monitor control board',
    featured: true,
  },
  {
    id: '6',
    name: 'LED Backlight Strips',
    category: 'monitor-parts',
    description: 'High-brightness LED backlight replacement strips',
    specs: ['Long Lifespan', 'Low Power Consumption', 'Various Sizes Available'],
    image: 'led light strip',
  },

  // CCTV Cameras
  {
    id: '7',
    name: '4MP Dome Camera',
    category: 'cctv-cameras',
    description: 'High-resolution dome camera with night vision',
    specs: ['4MP Resolution', 'IR Night Vision 30m', 'Weatherproof IP66', 'Wide Angle Lens'],
    image: 'security dome camera',
    featured: true,
  },
  {
    id: '8',
    name: '2MP Bullet Camera',
    category: 'cctv-cameras',
    description: 'Outdoor bullet camera with motion detection',
    specs: ['1080p Full HD', 'IR Night Vision 20m', 'Motion Detection', 'IP67 Rated'],
    image: 'security bullet camera',
  },
  {
    id: '9',
    name: 'PTZ Security Camera',
    category: 'cctv-cameras',
    description: 'Pan-Tilt-Zoom camera with auto-tracking',
    specs: ['5MP Resolution', '360° Pan Range', '4x Optical Zoom', 'Auto Tracking'],
    image: 'ptz security camera',
    featured: true,
  },

  // CCTV Accessories
  {
    id: '10',
    name: 'Camera Mounting Bracket',
    category: 'cctv-accessories',
    description: 'Heavy-duty wall/ceiling mount bracket',
    specs: ['Adjustable Angle', 'Weather Resistant', 'Universal Fit', 'Easy Installation'],
    image: 'camera wall mount',
  },
  {
    id: '11',
    name: 'Power Supply 12V 5A',
    category: 'cctv-accessories',
    description: 'Regulated power supply for CCTV systems',
    specs: ['12V DC Output', '5A Current', 'Short Circuit Protection', 'LED Indicator'],
    image: 'power adapter supply',
  },
  {
    id: '12',
    name: 'BNC Connector Pack',
    category: 'cctv-accessories',
    description: 'Professional BNC connectors for video cables',
    specs: ['50-Pack', 'Gold Plated', 'Crimp Type', 'High Quality Brass'],
    image: 'bnc connector cable',
  },

  // AC Spare Parts
  {
    id: '13',
    name: 'Universal AC Remote',
    category: 'ac-parts',
    description: 'Compatible remote control for multiple AC brands',
    specs: ['1000+ Models Supported', 'Large LCD Display', 'Auto Search Function', 'Low Battery Indicator'],
    image: 'air conditioner remote',
  },
  {
    id: '14',
    name: 'AC Capacitor 35µF',
    category: 'ac-parts',
    description: 'High-quality run capacitor for AC compressors',
    specs: ['35µF Capacitance', '450V Rating', 'Dual Terminal', 'Aluminum Case'],
    image: 'capacitor electronic component',
    featured: true,
  },
  {
    id: '15',
    name: 'PCB Control Board',
    category: 'ac-parts',
    description: 'Replacement PCB for split AC units',
    specs: ['Universal Design', 'LED Display', 'Remote Sensor', 'Temperature Control'],
    image: 'air conditioner circuit board',
  },

  // Electronic Components
  {
    id: '16',
    name: 'IC Chip Assortment',
    category: 'electronic-components',
    description: 'Mixed integrated circuit chips for repairs',
    specs: ['100-Piece Set', 'Various Models', 'DIP Package', 'Labeled Storage Box'],
    image: 'integrated circuit chips',
  },
  {
    id: '17',
    name: 'SMD Resistor Kit',
    category: 'electronic-components',
    description: 'Surface mount resistor assortment',
    specs: ['3000+ Pieces', '1/8W Power Rating', '0805 Package', 'All Common Values'],
    image: 'smd resistor components',
    featured: true,
  },
  {
    id: '18',
    name: 'Voltage Regulator Module',
    category: 'electronic-components',
    description: 'Adjustable DC-DC step-down converter',
    specs: ['Input: 4-40V', 'Output: 1.25-37V', '3A Max Current', 'High Efficiency'],
    image: 'voltage regulator module',
  },
];
