import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/User';
import { IProfile } from 'src/app/interfaces/profile';
import { CognitoService } from 'src/app/services/cognito.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = "https://wzf55yplk1.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit{

  user:IUser | undefined;
  profile:IProfile | undefined;
  isConfirm:boolean = false;
  alertMessage: string = '';
  showAlert:boolean = false;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = {} as IUser;
    this.isConfirm = false;
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        this.getProfile(user.attributes.preferred_username).subscribe(response => {
          this.profile = response;
          console.log(this.profile)
        });
      }
    })
  }
  
  getProfile(username:any): Observable<any>{
    console.log(username)
    return this.http.get(baseURL + 'getProfile/' + username)
  }

  postProfile(data: any): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    
    return this.http.post(baseURL + 'saveProfile', data, {headers: header})
  }

  public updateProfile(){
    if (this.profile && (this.profile.preferred_username || this.profile.email ||
       this.profile.givenName || this.profile.familyName || this.profile.description)){
        console.log(this.profile) 
        this.postProfile(this.profile).subscribe(response => {
          console.log(response);
        });
       }

    
    if (this.profile && (this.profile.preferred_username || this.profile.email)){
      const updatedUser: any = {
        preferred_username: this.profile.preferred_username,
        email: this.profile.email
      };

      this.cognitoService.updateUser(updatedUser)
      .then(() => {
        this.showAlert = false;
        this.isConfirm = true;
        this.alertMessage = "Successfully updated your profile"
      })
      .catch((error:any) =>{
        this.displayAlert(error.message)
      })
    }
    else{
      this.displayAlert("Input fields cannot be empty")
    }
  }

  private displayAlert(message: string){
    this.alertMessage = message;
    this.showAlert = true;
  }
}
