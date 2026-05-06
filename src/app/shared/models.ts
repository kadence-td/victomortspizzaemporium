import { Timestamp } from '@angular/fire/firestore';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prices: { small: number; medium: number; large: number };
}

export interface CartItem {
  pizza: Pizza;
  size: 'small' | 'medium' | 'large';
  crust: string;
  quantity: number;
}

export interface Address {
  id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface UserProfile {
  phoneNumber: string;
  displayName: string;
  phone: string;
  addresses: Address[];
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryAddress: Address;
  total: number;
  status: string;
  placedAt: Timestamp;
}