import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/User';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: IUser | undefined;
  isForgotPassword:boolean = false;
  newPassword:string = '';
  alertMessage: string = '';
  showAlert:boolean = false;
  
  constructor(private router:Router, private cognitoService:CognitoService){}

  ngOnInit(): void {
    this.user = {} as IUser;
  }

  signIn(){
    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signIn(this.user)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Please enter a valid email address or password.")
    }
  }
  
  forgotPasswordClicked(){
    if (this.user && this.user.email){
      this.cognitoService.forgotPassword(this.user)
      .then(() => {
        this.isForgotPassword = true;
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Please enter a valid email address.")
    }
  }

  newPasswordSubmit(){
    if (this.user && this.user.code && this.newPassword.trim().length != 0){
      this.cognitoService.forgotPasswordSubmit(this.user, this.newPassword.trim())
      .then(() => {
        this.isForgotPassword = false;
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Please enter a valid password.")
    }
  }

  private displayAlert(message: string){
    this.alertMessage = message;
    this.showAlert = true;
  }
}
