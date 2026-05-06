import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, deleteField, Timestamp } from '@angular/fire/firestore';
import { UserProfile, Address } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore) {}

  async getProfile(phoneNumber: string): Promise<UserProfile | null> {
    const ref = doc(this.firestore, 'users', phoneNumber);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  async createProfile(profile: UserProfile): Promise<void> {
    const ref = doc(this.firestore, 'users', profile.phoneNumber);
    await setDoc(ref, profile);
  }

  async updateProfile(phoneNumber: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, 'users', phoneNumber);
    await updateDoc(ref, { ...data });
  }

  async addAddress(phoneNumber: string, address: Address, profile: UserProfile): Promise<void> {
    const updated = [...profile.addresses, address];
    await this.updateProfile(phoneNumber, { addresses: updated });
  }

  async deleteAddress(phoneNumber: string, addressId: string, profile: UserProfile): Promise<void> {
    const updated = profile.addresses.filter(a => a.id !== addressId);
    await this.updateProfile(phoneNumber, { addresses: updated });
  }
}