import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
  brands: string[];
  getProductById: (id: string | number) => Product | undefined;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string | number, updatedData: Partial<Product>) => boolean;
  deleteProduct: (id: string | number) => boolean;
  resetCatalog: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);
const PRODUCTS_STORAGE_KEY = 'technova_products_v2';

// 8 Primary Enterprise Products directly from Stitch Spec & UI Reference
export const SEED_ENTERPRISE_PRODUCTS: Product[] = [
  {
    id: 'prod-macbook-pro-16',
    title: 'Apple MacBook Pro 16-inch M3 Max (16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD) - Space Black',
    brand: 'Apple',
    category: 'Laptops & Workstations',
    price: 3499.00,
    originalPrice: 3999.00,
    discountPercentage: 13,
    rating: 5.0,
    ratingCount: 4128,
    boughtCountText: '2K+ bought in past month',
    badge: 'Best Seller',
    badgeColor: 'amber',
    stock: 24,
    ram: '48 GB',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow, 2 PM',
    description: 'The most advanced Mac laptop ever engineered for pro workflows. Powered by M3 Max with up to 16 CPU cores and 40 GPU cores, featuring a breathtaking 16.2-inch Liquid Retina XDR display, up to 22 hours of battery life, and pro connectivity with 3x Thunderbolt 4 ports, HDMI, SDXC, and MagSafe 3.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': 'Apple M3 Max (16-core CPU)',
      'Graphics': '40-core GPU with Hardware Ray Tracing',
      'Memory': '48GB Unified Memory (300GB/s bandwidth)',
      'Storage': '1TB NVMe Solid State Drive',
      'Display': '16.2-inch Liquid Retina XDR (3456x2234 at 254 ppi, 1600 nits peak)',
      'Battery': '100Wh lithium-polymer with 140W USB-C Power Adapter',
      'Operating System': 'macOS Sequoia Enterprise'
    }
  },
  {
    id: 'prod-samsung-odyssey-g9',
    title: 'Samsung Odyssey G9 49-inch Dual QHD Curved Gaming Monitor, 240Hz, 1ms, DisplayHDR 1000, FreeSync Premium Pro',
    brand: 'Samsung',
    category: 'Monitors & Displays',
    price: 899.99,
    originalPrice: 1299.99,
    discountPercentage: 31,
    rating: 4.8,
    ratingCount: 3419,
    boughtCountText: '1K+ bought in past month',
    badge: 'Limited Time Deal',
    badgeColor: 'red',
    stock: 4,
    ram: 'N/A',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'Immerse yourself in a monumental visual workstation. The 49-inch 1000R curved dual QHD panel equals two 27-inch QHD monitors side by side, delivering a lightning 240Hz refresh rate, 1ms response time, and Quantum Mini-LED backlighting.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Screen Size': '49-inch 32:9 Super Ultrawide',
      'Resolution': '5120 x 1440 Dual QHD',
      'Curvature': '1000R Deep Curve',
      'Refresh Rate': '240Hz with 1ms (GtG)',
      'HDR': 'VESA DisplayHDR 1000 (1000 nits)',
      'Ports': '2x DisplayPort 1.4, 1x HDMI 2.1, 2x USB 3.0 Hub'
    }
  },
  {
    id: 'prod-asus-rog-g16',
    title: 'ASUS ROG Zephyrus G16 (2024) 16" OLED 240Hz Gaming Laptop, Intel Core Ultra 9 185H, NVIDIA RTX 4090, 32GB LPDDR5X, 2TB SSD',
    brand: 'ASUS',
    category: 'Laptops & Workstations',
    price: 2899.00,
    originalPrice: 3299.00,
    discountPercentage: 12,
    rating: 4.9,
    ratingCount: 876,
    boughtCountText: '500+ bought in past month',
    badge: 'Enterprise Choice',
    badgeColor: 'gray',
    stock: 18,
    ram: '32 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'Precision CNC-milled aluminum chassis packed with Intel Core Ultra 9 185H and GeForce RTX 4090 Laptop GPU. Features ROG Nebula 2.5K OLED 240Hz/0.2ms panel with 100% DCI-P3 color gamut and G-SYNC support.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': 'Intel Core Ultra 9 185H (16 Cores, up to 5.1GHz, Intel AI Boost NPU)',
      'Graphics': 'NVIDIA GeForce RTX 4090 (16GB GDDR6, 115W TGP)',
      'Display': '16.0" 2.5K (2560x1600) OLED 240Hz 0.2ms VESA True Black 500',
      'Memory': '32GB LPDDR5X-7467 MHz on board',
      'Storage': '2TB PCIe 4.0 NVMe M.2 Performance SSD'
    }
  },
  {
    id: 'prod-dell-xps-16',
    title: 'Dell XPS 16 9640 Laptop - 16.3" 4K+ Touch OLED, Intel Core Ultra 7 155H, 32GB RAM, 1TB SSD, NVIDIA GeForce RTX 4070',
    brand: 'Dell Technologies',
    category: 'Laptops & Workstations',
    price: 2449.00,
    originalPrice: 2749.00,
    discountPercentage: 11,
    rating: 4.8,
    ratingCount: 1245,
    boughtCountText: '800+ bought in past month',
    badge: 'Platinum Tech',
    badgeColor: 'gray',
    stock: 14,
    ram: '32 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'Iconic seamless glass touchpad and capacitive touch function row. Powered by Intel Core Ultra with integrated AI acceleration and NVIDIA RTX 4070 graphics for generative design and engineering.',
    image: 'https://images.unsplash.com/photo-1593642634361-8f3a38550d4f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642634361-8f3a38550d4f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': 'Intel Core Ultra 7 155H (16-core, 24MB Cache, up to 4.8GHz)',
      'Display': '16.3" 4K+ (3840x2400) OLED InfinityEdge Touch, 400-nit',
      'Graphics': 'NVIDIA GeForce RTX 4070 8GB GDDR6',
      'Memory': '32GB LPDDR5x 6400MT/s',
      'Weight': '4.8 lbs CNC Machined Aluminum'
    }
  },
  {
    id: 'prod-apple-studio-display',
    title: 'Apple Studio Display - Standard Glass - Tilt-Adjustable Stand, 27-inch 5K Retina display, 12MP Ultra Wide camera',
    brand: 'Apple',
    category: 'Monitors & Displays',
    price: 1599.00,
    originalPrice: 1599.00,
    discountPercentage: 0,
    rating: 4.9,
    ratingCount: 2890,
    boughtCountText: '1K+ bought in past month',
    badge: 'Top Rated',
    badgeColor: 'amber',
    stock: 19,
    ram: 'N/A',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'An expansive 27-inch 5K Retina window into your creative universe. Features 14.7 million pixels, 600 nits of brightness, P3 wide color, a 12MP camera with Center Stage, and a high-fidelity six-speaker sound system with Spatial Audio.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Display Size': '27-inch (diagonal) 5K Retina display',
      'Resolution': '5120 x 2880 at 218 pixels per inch',
      'Brightness': '600 nits, P3 Wide color gamut, True Tone',
      'Audio': 'Six-speaker system with force-cancelling woofers',
      'I/O': '1x Thunderbolt 3 (96W host charge), 3x USB-C (up to 10Gb/s)'
    }
  },
  {
    id: 'prod-samsung-book4-ultra',
    title: 'Samsung Galaxy Book4 Ultra 16" 3K AMOLED Laptop, Intel Core Ultra 9 185H, RTX 4070, 32GB RAM, 1TB SSD, S Pen Support',
    brand: 'Samsung',
    category: 'Laptops & Workstations',
    price: 2199.99,
    originalPrice: 2499.99,
    discountPercentage: 12,
    rating: 4.7,
    ratingCount: 634,
    boughtCountText: '400+ bought in past month',
    badge: 'Great Value',
    badgeColor: 'blue',
    stock: 9,
    ram: '32 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'Dynamic AMOLED 2X touchscreen with anti-reflective glass and Vision Booster. Seamless integration with Galaxy ecosystem and enterprise Knox security.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': 'Intel Core Ultra 9 185H',
      'Display': '16.0" 3K (2880 x 1800) Dynamic AMOLED 2X, 120Hz Touch',
      'Graphics': 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB',
      'Memory': '32GB LPDDR5X',
      'Storage': '1TB NVMe SSD with expansion slot'
    }
  },
  {
    id: 'prod-asus-proart-16',
    title: 'ASUS ProArt Studiobook 16 OLED Laptop, 16" 3.2K 120Hz Touch, Intel i9-13980HX, RTX 4070, 64GB DDR5, 2TB SSD',
    brand: 'ASUS',
    category: 'Laptops & Workstations',
    price: 2399.99,
    originalPrice: 2699.99,
    discountPercentage: 11,
    rating: 4.8,
    ratingCount: 412,
    boughtCountText: '300+ bought in past month',
    badge: 'ProArt Series',
    badgeColor: 'purple',
    stock: 11,
    ram: '64 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'Designed exclusively for digital content creators, CAD architects, and colorists. Features the physical ASUS Dial for pinpoint control in Adobe Creative Cloud and 3.2K 120Hz OLED certified Delta-E < 1.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': 'Intel Core i9-13980HX 2.2GHz (36M Cache, up to 5.6GHz, 24 cores)',
      'Memory': '64GB DDR5 SO-DIMM (Expandable)',
      'Display': '16.0" 3.2K (3200 x 2000) OLED 16:10 120Hz Touch Delta E < 1',
      'Storage': '2TB M.2 NVMe PCIe 4.0 Performance SSD',
      'Special Features': 'Rotary ASUS Dial, 3-Button Touchpad with Stylus Support'
    }
  },
  {
    id: 'prod-lenovo-thinkpad-p16s',
    title: 'Lenovo ThinkPad P16s Gen 2 Intel Workstation, 16" WQUXGA OLED, Core i7-1370P, 64GB RAM, 1TB SSD, NVIDIA RTX A500',
    brand: 'Lenovo',
    category: 'Laptops & Workstations',
    price: 1799.00,
    originalPrice: 2199.00,
    discountPercentage: 18,
    rating: 4.8,
    ratingCount: 789,
    boughtCountText: '600+ bought in past month',
    badge: 'Save $400 with Coupon',
    badgeColor: 'emerald',
    stock: 16,
    ram: '64 GB & Above',
    deliverySpeed: 'Get It Tomorrow',
    deliveryDateText: 'Tomorrow',
    description: 'MIL-SPEC tested enterprise mobility workhorse. Engineered for engineers, data analysts, and corporate IT fleets requiring ISV certifications, discrete NVIDIA RTX graphics, and legendary ThinkPad keyboard ergonomics.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Processor': '13th Gen Intel Core i7-1370P vPro (up to 5.20GHz, 14 cores)',
      'Graphics': 'NVIDIA RTX A500 Laptop GPU 4GB GDDR6',
      'Memory': '64GB LPDDR5X-4800MHz',
      'Display': '16.0" WQUXGA (3840 x 2400) OLED, Anti-Reflective, 400 nits, 100% DCI-P3',
      'Certifications': 'AutoCAD, SolidWorks, Revit, Adobe ISV Certified'
    }
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SEED_ENTERPRISE_PRODUCTS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch complementary products from DummyJSON API to enrich catalog with smartphones, tablets, laptops, accessories
  const enrichFromDummyJson = useCallback(async (currentBase: Product[]) => {
    try {
      const endpoints = [
        'https://dummyjson.com/products/category/laptops?limit=8',
        'https://dummyjson.com/products/category/smartphones?limit=8',
        'https://dummyjson.com/products/category/tablets?limit=6',
        'https://dummyjson.com/products/category/mobile-accessories?limit=8',
      ];

      const responses = await Promise.allSettled(endpoints.map((url) => fetch(url).then((r) => r.json())));
      
      const externalProducts: Product[] = [];

      responses.forEach((res, index) => {
        if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.products)) {
          let categoryName = 'Laptops & Workstations';
          if (index === 1) categoryName = 'Smartphones & Tablets';
          if (index === 2) categoryName = 'Smartphones & Tablets';
          if (index === 3) categoryName = 'Computer Components';

          res.value.products.forEach((p: any) => {
            // Check if already in base
            const alreadyExists = currentBase.some((existing) => String(existing.id) === `dj-${p.id}` || existing.title.toLowerCase() === p.title.toLowerCase());
            if (alreadyExists) return;

            const originalP = Math.round(p.price * (1 + (p.discountPercentage || 12) / 100));
            const ramOption = p.price > 1200 ? '32 GB & Above' : p.price > 600 ? '16 GB' : '8 GB';
            
            externalProducts.push({
              id: `dj-${p.id}`,
              title: p.title,
              brand: p.brand || (p.title.includes('Apple') ? 'Apple' : p.title.includes('Samsung') ? 'Samsung' : 'TechNova Essentials'),
              category: categoryName,
              price: Number(p.price) || 299,
              originalPrice: originalP,
              discountPercentage: Math.round(p.discountPercentage) || 10,
              rating: Number(p.rating) || 4.5,
              ratingCount: Math.floor(Math.random() * 800) + 120,
              boughtCountText: `${Math.floor(Math.random() * 500) + 100}+ bought in past month`,
              badge: p.discountPercentage > 15 ? 'Limited Time Deal' : p.rating > 4.7 ? 'Top Rated' : undefined,
              badgeColor: p.discountPercentage > 15 ? 'red' : 'amber',
              stock: p.stock || 20,
              ram: ramOption,
              deliverySpeed: Math.random() > 0.3 ? 'Get It Tomorrow' : 'Get It in 2 Days',
              deliveryDateText: 'Tomorrow',
              description: p.description || 'High performance enterprise computing hardware.',
              image: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
              images: p.images && p.images.length > 0 ? p.images : [p.thumbnail],
              specs: {
                'Brand': p.brand || 'Enterprise Grade',
                'Category': categoryName,
                'Stock Code': `SKU-DJ-${p.id}`,
                'Warranty': '2-Year Commercial Replacement'
              }
            });
          });
        }
      });

      if (externalProducts.length > 0) {
        setProducts((prev) => {
          // Keep custom products and seed products first
          const customOrSeeds = prev.filter((item) => !String(item.id).startsWith('dj-'));
          const combined = [...customOrSeeds, ...externalProducts];
          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(combined));
          } catch {
            // storage full safety
          }
          return combined;
        });
      }
    } catch (err: any) {
      console.warn('Could not load DummyJSON products, keeping default enterprise catalog', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    try {
      const cached = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!cached) {
        setLoading(true);
        enrichFromDummyJson(SEED_ENTERPRISE_PRODUCTS).finally(() => setLoading(false));
      }
    } catch {
      //
    }
  }, [enrichFromDummyJson]);

  // Persist products when updated
  const syncToStorage = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (e) {
      console.error('Failed to sync products to storage', e);
    }
  };

  const getProductById = (id: string | number) => {
    return products.find((p) => String(p.id) === String(id));
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
      isCustom: true,
      rating: productData.rating || 5.0,
      ratingCount: productData.ratingCount || 1,
      boughtCountText: productData.boughtCountText || 'New arrival',
      deliverySpeed: productData.deliverySpeed || 'Get It Tomorrow',
      deliveryDateText: productData.deliveryDateText || 'Tomorrow',
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    syncToStorage(updated);
    return newProduct;
  };

  const updateProduct = (id: string | number, updatedData: Partial<Product>): boolean => {
    let matched = false;
    const updated = products.map((item) => {
      if (String(item.id) === String(id)) {
        matched = true;
        return { ...item, ...updatedData };
      }
      return item;
    });

    if (matched) {
      setProducts(updated);
      syncToStorage(updated);
    }
    return matched;
  };

  const deleteProduct = (id: string | number): boolean => {
    const updated = products.filter((item) => String(item.id) !== String(id));
    setProducts(updated);
    syncToStorage(updated);
    return true;
  };

  const resetCatalog = async () => {
    setLoading(true);
    setProducts(SEED_ENTERPRISE_PRODUCTS);
    syncToStorage(SEED_ENTERPRISE_PRODUCTS);
    await enrichFromDummyJson(SEED_ENTERPRISE_PRODUCTS);
    setLoading(false);
  };

  // Derive unique categories and brands
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const brands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        categories,
        brands,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalog,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
