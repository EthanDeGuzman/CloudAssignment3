import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';

import {
  faTwitter
} from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  faTwitter = faTwitter;

  constructor(private router: Router, private cognitoService: CognitoService){}

  ngOnInit(): void {
    this.getUserDetails();
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
