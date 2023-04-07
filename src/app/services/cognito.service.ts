import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { IUser } from '../interfaces/User';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes:{
        email: user.email,
        given_name: user.givenName,
        family_name: user.familyName,
        preferred_username: user.preferred_username
      }
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password);
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public forgotPassword(user:IUser): Promise<any>{
    return Auth.forgotPassword(user.email);
  }

  public forgotPasswordSubmit(user:IUser, new_password:string){
    return Auth.forgotPasswordSubmit(user.email, user.code, new_password);
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

}