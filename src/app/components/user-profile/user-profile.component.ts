import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/users';
import { IProfile } from 'src/app/interfaces/profile';
import { CognitoService } from 'src/app/services/cognito.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = "https://2j7d4uu5ja.execute-api.eu-west-1.amazonaws.com/dev/";

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
  token: string = '';
  isLoading: boolean = true;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = {} as IUser;
    this.isConfirm = false;
    this.cognitoService.getCurrentSession()
    .then((res) => {
      this.token = res.getIdToken().getJwtToken();
    })
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        this.user = user;
        this.getProfile(user.attributes.preferred_username, this.token).subscribe(response => {
          this.profile = response;
          console.log(this.profile);
          this.isLoading = false;
        });
      }
    })
  }
  
  getProfile(username:any, token:string): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.get(baseURL + 'getProfile/' + username, {headers:header})
  }

  postProfile(data: any, token:string): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });
    
    return this.http.post(baseURL + 'saveProfile', data, {headers: header})
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        if (this.profile && reader.result !== null && reader.result !== undefined){
          const base64String = reader.result.toString().split(',')[1];
          this.saveImageLambda(base64String, this.token, file.name, this.profile.GUID).subscribe(response => {
            console.log(response);
            this.getProfile(this.user?.attributes.preferred_username, this.token).subscribe(response => {
              this.profile = response;
              console.log(this.profile);
              this.isLoading = false;
            });
          });
        }
      };
  
      reader.onerror = (evt) => {
        console.error("Error reading file");
      };
    }
  }

  saveImageLambda(fileContent: any, token:string, fileName: string, guid: string): Observable<any>{
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });
    
    const data ={
      "file_content": fileContent,
      "fileName": fileName,
      "GUID": guid
    }
    return this.http.post(baseURL + 'saveImage', data, {headers: header})
  }
  public updateProfile(){
    if (this.profile && (this.profile.preferred_username || this.profile.email ||
       this.profile.givenName || this.profile.familyName || this.profile.description)){
        console.log(this.profile) 
        this.postProfile(this.profile, this.token).subscribe(response => {
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
        this.alertMessage = "Successfully updated your profile";
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
