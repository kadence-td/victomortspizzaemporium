import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  cartCount$ = this.cart$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  addItem(item: CartItem): void {
    const current = this.cartSubject.value;
    const existing = current.find(
      i => i.pizza.id === item.pizza.id && i.size === item.size && i.crust === item.crust
    );
    if (existing) {
      this.updateQuantity(item.pizza.id, item.size, item.crust, existing.quantity + item.quantity);
    } else {
      this.cartSubject.next([...current, item]);
    }
  }

  removeItem(pizzaId: string, size: string, crust: string): void {
    const updated = this.cartSubject.value.filter(
      i => !(i.pizza.id === pizzaId && i.size === size && i.crust === crust)
    );
    this.cartSubject.next(updated);
  }

  updateQuantity(pizzaId: string, size: string, crust: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(pizzaId, size, crust);
      return;
    }
    const updated = this.cartSubject.value.map(i =>
      i.pizza.id === pizzaId && i.size === size && i.crust === crust
        ? { ...i, quantity }
        : i
    );
    this.cartSubject.next(updated);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (sum, item) => sum + item.pizza.prices[item.size] * item.quantity, 0
    );
  }
}