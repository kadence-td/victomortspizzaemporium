import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Pizza, CartItem } from '../../models';

@Component({
  selector: 'app-pizza-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './pizza-card.component.html',
  styleUrl: './pizza-card.component.scss'
})
export class PizzaCardComponent {
  @Input() pizza!: Pizza;
  @Output() addToCart = new EventEmitter<CartItem>();

  selectedSize: 'small' | 'medium' | 'large' = 'medium';
  selectedCrust: string = 'original';

  get computedPrice(): number {
    if (!this.pizza?.prices) return 0;
    return this.pizza.prices[this.selectedSize];
  }

  onAddToCart(): void {
    this.addToCart.emit({
      pizza: this.pizza,
      size: this.selectedSize,
      crust: this.selectedCrust,
      quantity: 1
    });
  }

}
