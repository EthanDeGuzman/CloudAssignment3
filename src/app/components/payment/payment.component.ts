import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

const baseURL = "https://2j7d4uu5ja.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit{
  token: string = '';
  totalPrice:number = 0;
  cardNumber:string = '';
  fullName: string = '';
  id:string = '';
  currentDate: string;

  constructor(private route: ActivatedRoute, private cognitoService: CognitoService, 
    private http: HttpClient, private cartService: CartService, private datePipe: DatePipe) {
      const date = new Date();
      const formattedDate = this.datePipe.transform(date, 'EEE, MMM d, y');
      this.currentDate = formattedDate ?? '';
    }

  ngOnInit(): void {
    this.cognitoService.getCurrentSession()
    .then((res) => {
      this.token = res.getIdToken().getJwtToken();
      this.route.queryParams.subscribe(params => {
        const orderId = params['id'];
        this.getOrder(orderId, this.token).subscribe(response => {
          console.log(response);
          this.id = response.GUID
          this.totalPrice = response.totalPrice;
          this.cardNumber = response.cardNumber;
          this.fullName = response.fullName;
        });
      });
    })
  }
  
  getOrder(data: any, token: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.get(baseURL + 'getOrder/' + data, {headers: header})
  }

}
