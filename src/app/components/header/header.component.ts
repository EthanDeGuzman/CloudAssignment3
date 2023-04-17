import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IUser } from 'src/app/interfaces/users';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSignedIn: boolean = false;
  username: string = '';
  userImage: string = '';
  user: IUser | undefined;
  showDropdown: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cognitoService.getUser().then((currentUser) => {
          if (currentUser && currentUser.attributes?.preferred_username && currentUser.attributes?.given_name && currentUser.attributes?.family_name) {
            this.isSignedIn = true;
            this.username = currentUser.attributes.preferred_username;
            this.userImage = currentUser.attributes.given_name[0] + currentUser.attributes.family_name[0];
          } else {
            this.isSignedIn = false;
            this.username = '';
            this.userImage = '';
          }
        });
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  signOut() {
    this.cognitoService.signOut();
    this.router.navigate(['/login']);
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}