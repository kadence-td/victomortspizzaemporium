import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaListComponent } from '../../shared/components/pizza-list/pizza-list.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PizzaService } from '../../shared/services/pizza.service';
import { CartService } from '../../shared/services/cart.service';
import { Pizza, CartItem } from '../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, PizzaListComponent, SpinnerComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  pizzas: Pizza[] = [];
  isLoading = true;

  constructor(
    private pizzaService: PizzaService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe(pizzas => {
      console.log('Pizzas received:', pizzas);
      console.log('Count:', pizzas.length);
      pizzas.forEach(p => console.log(p.id, p.name, p.prices));
      this.pizzas = pizzas;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  onAddToCart(item: CartItem): void {
    this.cartService.addItem(item);
  }
}