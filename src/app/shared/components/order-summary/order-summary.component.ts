import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CartItem } from '../../models';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, MatDividerModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  @Input() items: CartItem[] = [];

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.pizza.prices[item.size] * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * 0.06;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }
}