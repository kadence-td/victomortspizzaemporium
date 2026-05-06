import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AddressCardComponent } from '../../shared/components/address-card/address-card.component';
import { UserService } from '../../shared/services/user.service';
import { UserProfile, Address } from '../../shared/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatSnackBarModule, AddressCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isEditing = false;
  isAddingAddress = false;
  lookupPhone = '';
  isLoading = false;

  editData = { displayName: '', phone: '' };
  newAddress: Address = { id: '', street: '', city: '', state: '', zip: '', label: '' };

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  async loadProfile(): Promise<void> {
    if (!this.lookupPhone) return;
    this.isLoading = true;
    this.profile = await this.userService.getProfile(this.lookupPhone);
    this.isLoading = false;
    if (!this.profile) {
      this.snackBar.open('No profile found for that phone number.', 'Close', { duration: 3000 });
    }
  }

  startEdit(): void {
    this.editData = { displayName: this.profile!.displayName, phone: this.profile!.phone };
    this.isEditing = true;
  }

  async saveEdit(): Promise<void> {
    await this.userService.updateProfile(this.profile!.phoneNumber, this.editData);
    this.profile = { ...this.profile!, ...this.editData };
    this.isEditing = false;
    this.snackBar.open('Profile updated!', 'Close', { duration: 2000 });
  }

  async addAddress(): Promise<void> {
    this.newAddress.id = Date.now().toString();
    await this.userService.addAddress(this.profile!.phoneNumber, this.newAddress, this.profile!);
    this.profile!.addresses = [...this.profile!.addresses, { ...this.newAddress }];
    this.newAddress = { id: '', street: '', city: '', state: '', zip: '', label: '' };
    this.isAddingAddress = false;
    this.snackBar.open('Address added!', 'Close', { duration: 2000 });
  }

  async deleteAddress(addressId: string): Promise<void> {
    await this.userService.deleteAddress(this.profile!.phoneNumber, addressId, this.profile!);
    this.profile!.addresses = this.profile!.addresses.filter(a => a.id !== addressId);
    this.snackBar.open('Address deleted.', 'Close', { duration: 2000 });
  }
}