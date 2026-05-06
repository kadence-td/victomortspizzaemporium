import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pizza } from '../models';

@Injectable({ providedIn: 'root' })
export class PizzaService {
  constructor(private firestore: Firestore) {}

  getPizzas(): Observable<Pizza[]> {
    const pizzaRef = collection(this.firestore, 'pizzas');
    return collectionData(pizzaRef, { idField: 'id' }) as Observable<Pizza[]>;
  }
}