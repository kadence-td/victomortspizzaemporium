import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaCardComponent } from '../pizza-card/pizza-card.component';
import { Pizza, CartItem } from '../../models';

@Component({
  selector: 'app-pizza-list',
  standalone: true,
  imports: [CommonModule, PizzaCardComponent],
  templateUrl: './pizza-list.component.html',
  styleUrl: './pizza-list.component.scss'
})
export class PizzaListComponent {
  @Input() pizzas: Pizza[] = [];
  @Output() addToCart = new EventEmitter<CartItem>();

  onAddToCart(item: CartItem): void {
    this.addToCart.emit(item);
  }
}