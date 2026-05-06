import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartItemComponent } from '../../shared/components/cart-item/cart-item.component';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, CartItemComponent, OrderSummaryComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => this.items = items);
  }

  onQuantityChange(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.pizza.id, item.size, item.crust, quantity);
  }

  onRemoveItem(item: CartItem): void {
    this.cartService.removeItem(item.pizza.id, item.size, item.crust);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }
}