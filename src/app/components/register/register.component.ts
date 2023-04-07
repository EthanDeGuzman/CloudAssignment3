import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/User';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit{

  user:IUser | undefined;
  isConfirm:boolean = false;
  alertMessage: string = '';
  showAlert:boolean = false;
  
  constructor(private router:Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.user = {} as IUser;
    this.isConfirm = false;
  }
  
  public signUpWithCognito(){
    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.isConfirm = true;
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Missing user information.")
    }
  }

  public confirmSignUp(){
    if (this.user){
      this.cognitoService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/login'])
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Missing email or password.")
    }
  }

  private displayAlert(message: string){
    this.alertMessage = message;
    this.showAlert = true;
  }
}
