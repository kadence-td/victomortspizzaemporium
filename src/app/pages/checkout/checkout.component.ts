import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { CartService } from '../../shared/services/cart.service';
import { UserService } from '../../shared/services/user.service';
import { CartItem, Address, UserProfile, Order } from '../../shared/models';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule, MatIconModule,
    OrderSummaryComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  existingProfile: UserProfile | null = null;
  saveAddress = false;
  isPlacingOrder = false;

  formData = {
    displayName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    selectedAddressId: ''
  };

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => this.items = items);
  }

  async onPhoneBlur(): Promise<void> {
    if (this.formData.phone.length >= 10) {
      this.existingProfile = await this.userService.getProfile(this.formData.phone);
      if (this.existingProfile) {
        this.formData.displayName = this.existingProfile.displayName;
        this.snackBar.open('Profile found! Saved addresses loaded.', 'Close', { duration: 2000 });
      }
    }
  }

  onSelectSavedAddress(): void {
    if (!this.existingProfile || !this.formData.selectedAddressId) return;
    const addr = this.existingProfile.addresses.find(a => a.id === this.formData.selectedAddressId);
    if (addr) {
      this.formData.street = addr.street;
      this.formData.city = addr.city;
      this.formData.state = addr.state;
      this.formData.zip = addr.zip;
    }
  }

  async placeOrder(): Promise<void> {
    if (!this.formData.displayName || !this.formData.phone || !this.formData.street) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isPlacingOrder = true;

    const address: Address = {
      id: Date.now().toString(),
      street: this.formData.street,
      city: this.formData.city,
      state: this.formData.state,
      zip: this.formData.zip
    };

    // create or update profile
    if (!this.existingProfile) {
      await this.userService.createProfile({
        phoneNumber: this.formData.phone,
        displayName: this.formData.displayName,
        phone: this.formData.phone,
        addresses: this.saveAddress ? [address] : [],
        createdAt: Timestamp.now()
      });
    } else if (this.saveAddress) {
      await this.userService.addAddress(this.formData.phone, address, this.existingProfile);
    }

    // write order to firestore
    const order = {
      items: this.items,
      deliveryAddress: address,
      total: this.cartService.getTotal(),
      status: 'placed',
      placedAt: Timestamp.now()
    };
    await addDoc(collection(this.firestore, 'orders'), order);

    this.cartService.clearCart();
    this.isPlacingOrder = false;
    this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
    this.router.navigate(['/menu']);
  }
}