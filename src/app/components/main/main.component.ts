import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITwitter } from 'src/app/interfaces/twitter';
import { IUser } from 'src/app/interfaces/User';

import {
  faTwitter
} from '@fortawesome/free-brands-svg-icons';

const baseURL = "https://wzf55yplk1.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  faTwitter = faTwitter;
  query: string = '';
  twitter: ITwitter | undefined;
  token: string = '';
  showAlert:boolean = false;
  showSuccess:boolean = false;
  alertMessage: string = "";
  user: IUser | undefined;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient){}

  ngOnInit(): void {
    this.query = '';
    this.getUserDetails();
    this.cognitoService.getCurrentSession()
    .then((res) => {
      this.token = res.getIdToken().getJwtToken();
    })
  }

  searchTwitterLambda(data: any, token:string, userID:any): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });
    
    const body = {
      "message": data,
      "userID": userID
    }

    return this.http.post(baseURL + 'getTweets', body, {headers: header})
  }

  getSentimentLambda(data: any, token:string): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'getSentiment', data, {headers: header})
  }

  public searchTwitter(){
    if (this.query){
        this.alertMessage = "Your result will be shown momentarily.";
        this.showSuccess = true;
        this.searchTwitterLambda(this.query, this.token, this.user?.username).subscribe(response => {
          console.log(response);
          response.UserID = this.user?.username;
          this.twitter = response;
          if (this.twitter?.error){
            this.alertMessage = this.twitter.error;
            this.showAlert = true;
            this.showSuccess = false;
          }
          else{
            this.getSentimentLambda(this.twitter, this.token).subscribe(response => {
             console.log(response);
             this.router.navigate(['/results'])
            });
          }
        });
    }
    else{
      this.displayAlert("Query cannot be empty")
    }
  }

  private displayAlert(message:string){
      this.alertMessage = message;
      this.showAlert = true;
  }

  private getUserDetails(){
    this.cognitoService.getUser()
    .then((user:IUser) => {
      if(user){
        this.user = user;
      }
      else{
        this.router.navigate(['/login'])
      }
    })
  }

  signOutWithCognito(){
    this.cognitoService.signOut()
    .then(() => {
      this.router.navigate(['/login'])
    })
  }
  
}
