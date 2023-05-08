import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { CartService } from 'src/app/services/cart.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Product } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';

const baseURL = "https://2j7d4uu5ja.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit{
  orderInfo: any = {};
  cartItems: Product[] = [];
  uniqueCartItems: { product: Product, count: number, price: number }[] = [];
  totalPrice:number = 0;
  token: string = '';
  alertMessage: string = '';
  showAlert:boolean = false;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient, private cartService: CartService){}

  ngOnInit(): void {
    this.cognitoService.getCurrentSession()
    .then((res) => {
      this.token = res.getIdToken().getJwtToken();
    })
    this.cartItems = this.cartService.getCartItems()
    this.cartItems.forEach((item) => {
      this.totalPrice += Number(item.Price)
    });
    this.uniqueCartItems = this.getUniqueCartItems(this.cartItems);
  }

  private getUniqueCartItems(cartItems: Product[]): { product: Product, count: number,  price: number }[] {
    const uniqueCartItems: { product: Product, count: number,  price: number }[] = [];
    cartItems.forEach((item) => {
      const existingItem = uniqueCartItems.find((uItem) => uItem.product.ID === item.ID);
      if (existingItem) {
        existingItem.count++;
        existingItem.price = item.Price * existingItem.count;
      } else {
        uniqueCartItems.push({ product: item, count: 1 ,  price: Number(item.Price)});
      }
    });
    return uniqueCartItems;
  }

  continue(){
    this.orderInfo.products = this.uniqueCartItems;
    this.orderInfo.totalPrice = this.totalPrice;
    console.log(this.orderInfo);
    this.saveOrder(this.orderInfo, this.token).subscribe(response => {
      const output = JSON.parse(response.output);
      const body = JSON.parse(output.GUID.Payload.body);
      const orderId = body.GUID;
      if (orderId != "-1") {
        this.router.navigate(['/payment'], { queryParams: { id: orderId } });
      }
      else{
        this.displayAlert("The card details could not be processed.")
      }
    });
  }

  saveOrder(data: any, token: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'saveOrder', data, {headers: header})
  }

  private displayAlert(message: string){
    this.alertMessage = message;
    this.showAlert = true;
  }
}
