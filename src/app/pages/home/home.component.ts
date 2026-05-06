import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  features = [
    { icon: '✦', title: 'Fresh Ingredients', description: 'Every pizza made with locally sourced, fresh ingredients.' },
    { icon: '✦', title: 'Stone Fired', description: 'Cooked in our signature stone oven for that perfect crispy crust.' },
    { icon: '✦', title: 'Fast Delivery', description: 'Hot and fresh to your door in 30 minutes or less.' },
  ];
}