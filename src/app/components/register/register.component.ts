import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/User';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = "https://wzf55yplk1.execute-api.eu-west-1.amazonaws.com/dev/";

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

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = {} as IUser;
    this.isConfirm = false;
  }

  postProfile(data: any): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    
    return this.http.post(baseURL + 'saveProfile', data, {headers: header})
  }

  public signUpWithCognito(){
    this.postProfile(this.user).subscribe(response => {
      console.log(response);
    });
    
    if (this.user && this.user.email && this.user.password){
      
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.showAlert = false;
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
      this.displayAlert("Invalid verification code.")
    }
  }

  private displayAlert(message: string){
    this.alertMessage = message;
    this.showAlert = true;
  }
}
