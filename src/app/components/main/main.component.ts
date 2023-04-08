import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITwitter } from 'src/app/interfaces/twitter';

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

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient){}

  ngOnInit(): void {
    this.query = '';
    this.getUserDetails();
  }

  searchTwitterLambda(data: any): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    
    const body = {
      "message": data
    }

    return this.http.post(baseURL + 'getTweets', body, {headers: header})
  }

  getSentimentLambda(data: any): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
    });
  
    return this.http.post(baseURL + 'getSentiment', data, {headers: header})
  }

  public searchTwitter(){
    if (this.query){
        this.searchTwitterLambda(this.query).subscribe(response => {
          console.log(response);
          this.twitter = response;
          this.getSentimentLambda(this.twitter).subscribe(response => {
            console.log(response);
          });
        });
    }
  }

  private getUserDetails(){
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        console.log("Logged In")
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
