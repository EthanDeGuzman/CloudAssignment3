import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems: Product[] = [];
  private itemCount = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(item: Product) {
    this.cartItems.push(item);
    this.itemCount.next(this.cartItems.length);
  }

  getItemCount() {
    return this.itemCount.asObservable();
  }

  getCartItems(): Product[] {
    return this.cartItems;
  }
}
