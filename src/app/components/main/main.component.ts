import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { CartService } from 'src/app/services/cart.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducts, Product} from 'src/app/interfaces/product';

const baseURL = "https://sznv3gzehj.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit{

  products:IProducts | undefined;
  random_numbers: Number[] = [];

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient, private cartService: CartService){}

  ngOnInit(): void {
    this.getProducts().subscribe(response => {
      this.products = response;
      console.log(this.products);
    });
  }

  getProducts(): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    
    return this.http.get(baseURL + 'getProducts', {headers:header})
  }

  signOutWithCognito(){
    this.cognitoService.signOut()
    .then(() => {
      this.router.navigate(['/login'])
    })
  }
  

  addToCart(item: Product) {
    this.cartService.addToCart(item);
    console.log(this.cartService.getCartItems())
  }

}
