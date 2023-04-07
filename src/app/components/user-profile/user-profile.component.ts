import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/User';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit{

  user:IUser | undefined;
  isConfirm:boolean = false;

  constructor(private router:Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.user = {} as IUser;
    this.isConfirm = false;
  }

  public updateProfile(){
    if (this.user){
      this.cognitoService.updateUser(this.user)
      .then(() => {
        this.isConfirm = true;
      })
    }
  }

}
