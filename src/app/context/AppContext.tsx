import { createContext, useContext, useState, ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;           // DOC-XXXXX
  companyId: string;    // same as id, used to login
  password: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: string;
  hospital: string;
  hospitalAddress: string;
  city: string;
  state: string;
  zipCode: string;
  workingDays: string;
  workingHours: string;
  credits: number;
  totalCreditsEarned: number;
  totalCreditsUsed: number;
  status: 'active' | 'pending';
  assignedSalesRepId: string;
  memberSince: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  territory: string;
  credits: number;        // credits available to assign
  doctorIds: string[];
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  credits: number;
  stock: number;
  image: string;
  description: string;
  rating: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  credits: number;
  image: string;
}

export interface Order {
  id: string;
  doctorId: string;
  doctorName: string;
  salesRepId: string;
  salesRepName: string;
  items: OrderItem[];
  totalCredits: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
  address: string;
}

export interface CreditRequest {
  id: string;
  salesRepId: string;
  salesRepName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  adminNote?: string;
}

export interface DoctorAddRequest {
  id: string;
  salesRepId: string;
  salesRepName: string;
  doctorData: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
    licenseNumber: string;
    hospital: string;
    hospitalAddress: string;
    city: string;
    state: string;
    zipCode: string;
    workingDays: string;
    workingHours: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  adminNote?: string;
}

export type CurrentUser = { role: 'doctor'; data: Doctor } | { role: 'sales'; data: SalesRep } | { role: 'admin'; data: Admin };

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialDoctors: Doctor[] = [
  {
    id: 'DOC-12345', companyId: 'DOC-12345', password: 'password123',
    name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hospital.com', phone: '+1 (555) 123-4567',
    specialty: 'Cardiology', licenseNumber: 'MD-12345-CA', yearsOfExperience: '12',
    hospital: 'City General Hospital', hospitalAddress: '123 Medical Center Drive, San Francisco, CA 94102',
    city: 'San Francisco', state: 'California', zipCode: '94102',
    workingDays: 'Monday - Friday', workingHours: '9:00 AM - 5:00 PM',
    credits: 1250, totalCreditsEarned: 2500, totalCreditsUsed: 1250,
    status: 'active', assignedSalesRepId: 'SR-001', memberSince: 'Jan 2025',
  },
  {
    id: 'DOC-67890', companyId: 'DOC-67890', password: 'pass456',
    name: 'Dr. Emily Rodriguez', email: 'emily.r@medcenter.com', phone: '+1 (555) 345-6789',
    specialty: 'Neurology', licenseNumber: 'MD-67890-CA', yearsOfExperience: '9',
    hospital: 'Advanced Neurology Institute', hospitalAddress: '456 Brain Science Blvd, San Diego, CA 92103',
    city: 'San Diego', state: 'California', zipCode: '92103',
    workingDays: 'Monday - Saturday', workingHours: '8:00 AM - 4:00 PM',
    credits: 2100, totalCreditsEarned: 3500, totalCreditsUsed: 1400,
    status: 'active', assignedSalesRepId: 'SR-002', memberSince: 'Feb 2025',
  },
  {
    id: 'DOC-11111', companyId: 'DOC-11111', password: 'doc111',
    name: 'Dr. Michael Chen', email: 'michael.chen@clinic.com', phone: '+1 (555) 234-5678',
    specialty: 'Pediatrics', licenseNumber: 'MD-11111-CA', yearsOfExperience: '8',
    hospital: "Children's Medical Center", hospitalAddress: '789 Kids Health Ave, Los Angeles, CA 90001',
    city: 'Los Angeles', state: 'California', zipCode: '90001',
    workingDays: 'Tuesday - Saturday', workingHours: '10:00 AM - 6:00 PM',
    credits: 890, totalCreditsEarned: 1800, totalCreditsUsed: 910,
    status: 'active', assignedSalesRepId: 'SR-001', memberSince: 'Nov 2024',
  },
  {
    id: 'DOC-22222', companyId: 'DOC-22222', password: 'doc222',
    name: 'Dr. James Wilson', email: 'j.wilson@healthcare.com', phone: '+1 (555) 456-7890',
    specialty: 'Oncology', licenseNumber: 'MD-22222-CA', yearsOfExperience: '15',
    hospital: 'Cancer Treatment Center', hospitalAddress: '321 Hope Lane, Sacramento, CA 95814',
    city: 'Sacramento', state: 'California', zipCode: '95814',
    workingDays: 'Monday - Thursday', workingHours: '8:00 AM - 5:00 PM',
    credits: 450, totalCreditsEarned: 900, totalCreditsUsed: 450,
    status: 'active', assignedSalesRepId: 'SR-002', memberSince: 'Mar 2025',
  },
];

const initialSalesReps: SalesRep[] = [
  {
    id: 'SR-001', name: 'Michael Chen', email: 'michael@giftrep.com', password: 'sales123',
    phone: '+1 (555) 777-8888', territory: 'Northern California',
    credits: 50000, doctorIds: ['DOC-12345', 'DOC-11111'],
    status: 'active', joinDate: '2024-11-20',
  },
  {
    id: 'SR-002', name: 'Emily Davis', email: 'emily@giftrep.com', password: 'sales456',
    phone: '+1 (555) 999-0000', territory: 'Southern California',
    credits: 35000, doctorIds: ['DOC-67890', 'DOC-22222'],
    status: 'active', joinDate: '2025-01-05',
  },
];

const initialAdmin: Admin = {
  id: 'ADMIN-001', name: 'Admin User', email: 'admin@giftexchange.com', password: 'admin123',
};

const initialProducts: Product[] = [
  {
    id: 1, name: 'Premium Basmati Rice 10kg', category: 'groceries', credits: 50, stock: 15,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    description: 'High-quality aged basmati rice from the foothills of the Himalayas. Perfect for biryanis and daily cooking.',
    rating: 4.8,
  },
  {
    id: 2, name: 'Organic Cooking Oil Set', category: 'groceries', credits: 30, stock: 25,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    description: 'A curated set of premium organic cooking oils including olive, avocado, and coconut oil.',
    rating: 4.6,
  },
  {
    id: 3, name: 'Coffee Maker Deluxe', category: 'appliances', credits: 120, stock: 8,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    description: 'Professional-grade coffee maker with programmable settings and built-in grinder for a perfect brew every time.',
    rating: 4.7,
  },
  {
    id: 4, name: 'Wireless Headphones Pro', category: 'electronics', credits: 150, stock: 12,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Active noise-cancelling wireless headphones with 40-hour battery life and premium sound quality.',
    rating: 4.9,
  },
  {
    id: 5, name: 'Premium Tea Collection', category: 'groceries', credits: 40, stock: 20,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400',
    description: 'An exquisite collection of 12 premium teas from around the world, elegantly packaged.',
    rating: 4.5,
  },
  {
    id: 6, name: 'Fitness Tracker Watch', category: 'electronics', credits: 180, stock: 6,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, GPS, and 7-day battery life.',
    rating: 4.7,
  },
  {
    id: 7, name: 'Gourmet Spice Box', category: 'groceries', credits: 35, stock: 18,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400',
    description: 'A handcrafted wooden box with 20 premium spices from India, perfect for the culinary enthusiast.',
    rating: 4.6,
  },
  {
    id: 8, name: 'Smart Air Purifier', category: 'appliances', credits: 200, stock: 5,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    description: 'HEPA-certified smart air purifier with app control, perfect for home or clinic environments.',
    rating: 4.8,
  },
];

const initialOrders: Order[] = [
  {
    id: 'ORD-045', doctorId: 'DOC-12345', doctorName: 'Dr. Sarah Johnson',
    salesRepId: 'SR-001', salesRepName: 'Michael Chen',
    items: [
      { productId: 1, productName: 'Premium Basmati Rice 10kg', quantity: 2, credits: 50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
      { productId: 2, productName: 'Organic Cooking Oil Set', quantity: 1, credits: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100' },
    ],
    totalCredits: 130, status: 'pending', date: '2026-04-24',
    address: '123 Medical Center Drive, San Francisco, CA 94102',
  },
  {
    id: 'ORD-044', doctorId: 'DOC-22222', doctorName: 'Dr. James Wilson',
    salesRepId: 'SR-002', salesRepName: 'Emily Davis',
    items: [
      { productId: 3, productName: 'Coffee Maker Deluxe', quantity: 1, credits: 120, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100' },
    ],
    totalCredits: 120, status: 'processing', date: '2026-04-23',
    address: '321 Hope Lane, Sacramento, CA 95814',
  },
  {
    id: 'ORD-043', doctorId: 'DOC-67890', doctorName: 'Dr. Emily Rodriguez',
    salesRepId: 'SR-001', salesRepName: 'Michael Chen',
    items: [
      { productId: 4, productName: 'Wireless Headphones Pro', quantity: 1, credits: 150, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
      { productId: 5, productName: 'Premium Tea Collection', quantity: 2, credits: 40, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=100' },
    ],
    totalCredits: 230, status: 'delivered', date: '2026-04-22',
    address: '456 Brain Science Blvd, San Diego, CA 92103',
  },
  {
    id: 'ORD-042', doctorId: 'DOC-11111', doctorName: 'Dr. Michael Chen',
    salesRepId: 'SR-002', salesRepName: 'Emily Davis',
    items: [
      { productId: 6, productName: 'Fitness Tracker Watch', quantity: 1, credits: 180, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100' },
    ],
    totalCredits: 180, status: 'processing', date: '2026-04-21',
    address: '789 Kids Health Ave, Los Angeles, CA 90001',
  },
  {
    id: 'ORD-041', doctorId: 'DOC-12345', doctorName: 'Dr. Sarah Johnson',
    salesRepId: 'SR-001', salesRepName: 'Michael Chen',
    items: [
      { productId: 1, productName: 'Premium Basmati Rice 10kg', quantity: 1, credits: 50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    ],
    totalCredits: 50, status: 'delivered', date: '2026-04-18',
    address: '123 Medical Center Drive, San Francisco, CA 94102',
  },
];

const initialCreditRequests: CreditRequest[] = [
  {
    id: 'CR-001', salesRepId: 'SR-001', salesRepName: 'Michael Chen',
    amount: 10000, reason: 'Q2 campaign – need additional credits for new doctor onboarding in Northern CA region.',
    status: 'pending', date: '2026-04-24',
  },
  {
    id: 'CR-002', salesRepId: 'SR-002', salesRepName: 'Emily Davis',
    amount: 5000, reason: 'Credits for Dr. James Wilson\'s monthly allocation top-up.',
    status: 'approved', date: '2026-04-20', adminNote: 'Approved for Q2 budget.',
  },
];

const initialDoctorAddRequests: DoctorAddRequest[] = [
  {
    id: 'DAR-001', salesRepId: 'SR-001', salesRepName: 'Michael Chen',
    doctorData: {
      name: 'Dr. Lisa Anderson', email: 'lisa.anderson@clinic.com', phone: '+1 (555) 888-9999',
      specialty: 'Dermatology', licenseNumber: 'MD-55555-CA',
      hospital: 'Skin & Wellness Clinic', hospitalAddress: '500 Beauty Lane, San Francisco, CA 94110',
      city: 'San Francisco', state: 'California', zipCode: '94110',
      workingDays: 'Monday - Friday', workingHours: '10:00 AM - 7:00 PM',
    },
    status: 'pending', date: '2026-04-24',
  },
];

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextType {
  currentUser: CurrentUser | null;
  doctors: Doctor[];
  salesReps: SalesRep[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  creditRequests: CreditRequest[];
  doctorAddRequests: DoctorAddRequest[];

  // Auth
  login: (identifier: string, password: string) => { success: boolean; role?: string; error?: string };
  logout: () => void;
  updateDoctorProfile: (doctorId: string, data: Partial<Doctor>) => void;
  updateDoctorPassword: (doctorId: string, newPassword: string) => void;

  // Cart
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (address: string) => string;

  // Sales
  addCreditRequest: (salesRepId: string, salesRepName: string, amount: number, reason: string) => void;
  submitDoctorAddRequest: (salesRepId: string, salesRepName: string, doctorData: DoctorAddRequest['doctorData']) => void;

  // Admin
  approveCreditRequest: (requestId: string, note?: string) => void;
  rejectCreditRequest: (requestId: string, note?: string) => void;
  approveDoctorAddRequest: (requestId: string) => void;
  rejectDoctorAddRequest: (requestId: string, note?: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: number, data: Partial<Product>) => void;
  deleteProduct: (productId: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addUser: (role: 'doctor' | 'sales', data: any) => void;
  deleteUser: (role: 'doctor' | 'sales', userId: string) => void;
  assignCreditsToDoctor: (doctorId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [salesReps, setSalesReps] = useState<SalesRep[]>(initialSalesReps);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>(initialCreditRequests);
  const [doctorAddRequests, setDoctorAddRequests] = useState<DoctorAddRequest[]>(initialDoctorAddRequests);

  const login = (identifier: string, password: string): { success: boolean; role?: string; error?: string } => {
    const trimId = identifier.trim().toUpperCase();
    // Doctor login: company ID format
    if (trimId.startsWith('DOC-')) {
      const doctor = doctors.find(d => d.companyId.toUpperCase() === trimId && d.password === password);
      if (doctor) {
        setCurrentUser({ role: 'doctor', data: doctor });
        return { success: true, role: 'doctor' };
      }
      const doctorExists = doctors.find(d => d.companyId.toUpperCase() === trimId);
      if (doctorExists) return { success: false, error: 'Incorrect password. Please try again.' };
      return { success: false, error: 'Doctor ID not found. Please check your company-assigned ID.' };
    }
    // Admin login
    if (identifier.trim().toLowerCase() === initialAdmin.email && password === initialAdmin.password) {
      setCurrentUser({ role: 'admin', data: initialAdmin });
      return { success: true, role: 'admin' };
    }
    // Sales Rep login
    const salesRep = salesReps.find(s => s.email.toLowerCase() === identifier.trim().toLowerCase() && s.password === password);
    if (salesRep) {
      setCurrentUser({ role: 'sales', data: salesRep });
      return { success: true, role: 'sales' };
    }
    // Check if email exists for better error message
    const emailExists = salesReps.find(s => s.email.toLowerCase() === identifier.trim().toLowerCase()) ||
      identifier.trim().toLowerCase() === initialAdmin.email;
    if (emailExists) return { success: false, error: 'Incorrect password. Please try again.' };
    return { success: false, error: 'Account not found. Contact your administrator for access.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const updateDoctorProfile = (doctorId: string, data: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, ...data } : d));
    if (currentUser?.role === 'doctor' && currentUser.data.id === doctorId) {
      setCurrentUser({ role: 'doctor', data: { ...currentUser.data, ...data } });
    }
  };

  const updateDoctorPassword = (doctorId: string, newPassword: string) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, password: newPassword } : d));
    if (currentUser?.role === 'doctor' && currentUser.data.id === doctorId) {
      setCurrentUser({ role: 'doctor', data: { ...currentUser.data, password: newPassword } });
    }
  };

  const addToCart = (productId: number, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.productId !== productId));

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (address: string): string => {
    if (!currentUser || currentUser.role !== 'doctor') return '';
    const doctor = currentUser.data as Doctor;
    const orderItems: OrderItem[] = cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId)!;
      return { productId: product.id, productName: product.name, quantity: cartItem.quantity, credits: product.credits, image: product.image };
    });
    const totalCredits = orderItems.reduce((sum, i) => sum + i.credits * i.quantity, 0);
    const salesRep = salesReps.find(s => s.id === doctor.assignedSalesRepId);
    const newOrderId = `ORD-${String(orders.length + 46).padStart(3, '0')}`;
    const newOrder: Order = {
      id: newOrderId, doctorId: doctor.id, doctorName: doctor.name,
      salesRepId: doctor.assignedSalesRepId, salesRepName: salesRep?.name || 'N/A',
      items: orderItems, totalCredits, status: 'pending',
      date: new Date().toISOString().split('T')[0], address,
    };
    setOrders(prev => [newOrder, ...prev]);
    setDoctors(prev => prev.map(d => d.id === doctor.id ? {
      ...d, credits: d.credits - totalCredits, totalCreditsUsed: d.totalCreditsUsed + totalCredits
    } : d));
    setCurrentUser({ role: 'doctor', data: { ...doctor, credits: doctor.credits - totalCredits, totalCreditsUsed: doctor.totalCreditsUsed + totalCredits } });
    clearCart();
    return newOrderId;
  };

  const addCreditRequest = (salesRepId: string, salesRepName: string, amount: number, reason: string) => {
    const req: CreditRequest = {
      id: `CR-${String(creditRequests.length + 3).padStart(3, '0')}`,
      salesRepId, salesRepName, amount, reason, status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setCreditRequests(prev => [req, ...prev]);
  };

  const submitDoctorAddRequest = (salesRepId: string, salesRepName: string, doctorData: DoctorAddRequest['doctorData']) => {
    const req: DoctorAddRequest = {
      id: `DAR-${String(doctorAddRequests.length + 2).padStart(3, '0')}`,
      salesRepId, salesRepName, doctorData, status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setDoctorAddRequests(prev => [req, ...prev]);
  };

  const approveCreditRequest = (requestId: string, note?: string) => {
    setCreditRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved', adminNote: note } : r));
    const req = creditRequests.find(r => r.id === requestId);
    if (req) {
      setSalesReps(prev => prev.map(s => s.id === req.salesRepId ? { ...s, credits: s.credits + req.amount } : s));
    }
  };

  const rejectCreditRequest = (requestId: string, note?: string) => {
    setCreditRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', adminNote: note } : r));
  };

  const approveDoctorAddRequest = (requestId: string) => {
    const req = doctorAddRequests.find(r => r.id === requestId);
    if (!req) return;
    const newId = `DOC-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    const newDoctor: Doctor = {
      id: newId, companyId: newId, password: 'changeme123',
      name: req.doctorData.name, email: req.doctorData.email, phone: req.doctorData.phone,
      specialty: req.doctorData.specialty, licenseNumber: req.doctorData.licenseNumber,
      yearsOfExperience: '0', hospital: req.doctorData.hospital,
      hospitalAddress: req.doctorData.hospitalAddress, city: req.doctorData.city,
      state: req.doctorData.state, zipCode: req.doctorData.zipCode,
      workingDays: req.doctorData.workingDays, workingHours: req.doctorData.workingHours,
      credits: 0, totalCreditsEarned: 0, totalCreditsUsed: 0,
      status: 'active', assignedSalesRepId: req.salesRepId,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setDoctors(prev => [...prev, newDoctor]);
    setSalesReps(prev => prev.map(s => s.id === req.salesRepId ? { ...s, doctorIds: [...s.doctorIds, newId] } : s));
    setDoctorAddRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
  };

  const rejectDoctorAddRequest = (requestId: string, note?: string) => {
    setDoctorAddRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', adminNote: note } : r));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts(prev => [...prev, { ...product, id: newId }]);
  };

  const updateProduct = (productId: number, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...data } : p));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addUser = (role: 'doctor' | 'sales', data: any) => {
    if (role === 'doctor') {
      const newId = `DOC-${String(Math.floor(Math.random() * 90000) + 10000)}`;
      setDoctors(prev => [...prev, { ...data, id: newId, companyId: newId, credits: 0, totalCreditsEarned: 0, totalCreditsUsed: 0, status: 'active', memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }]);
    } else {
      const newId = `SR-${String(salesReps.length + 3).padStart(3, '0')}`;
      setSalesReps(prev => [...prev, { ...data, id: newId, credits: 0, doctorIds: [], status: 'active', joinDate: new Date().toISOString().split('T')[0] }]);
    }
  };

  const deleteUser = (role: 'doctor' | 'sales', userId: string) => {
    if (role === 'doctor') setDoctors(prev => prev.filter(d => d.id !== userId));
    else setSalesReps(prev => prev.filter(s => s.id !== userId));
  };

  const assignCreditsToDoctor = (doctorId: string, amount: number) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? {
      ...d, credits: d.credits + amount, totalCreditsEarned: d.totalCreditsEarned + amount
    } : d));
    // Deduct from the assigned sales rep's credits
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setSalesReps(prev => prev.map(s => s.id === doctor.assignedSalesRepId
        ? { ...s, credits: Math.max(0, s.credits - amount) }
        : s
      ));
      // If current user is the sales rep, update their session
      if (currentUser?.role === 'sales' && currentUser.data.id === doctor.assignedSalesRepId) {
        setCurrentUser({ role: 'sales', data: { ...currentUser.data, credits: Math.max(0, currentUser.data.credits - amount) } });
      }
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, doctors, salesReps, products, cart, orders, creditRequests, doctorAddRequests,
      login, logout, updateDoctorProfile, updateDoctorPassword,
      addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
      addCreditRequest, submitDoctorAddRequest,
      approveCreditRequest, rejectCreditRequest, approveDoctorAddRequest, rejectDoctorAddRequest,
      addProduct, updateProduct, deleteProduct, updateOrderStatus, addUser, deleteUser, assignCreditsToDoctor,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}