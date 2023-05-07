import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSignedIn: boolean = true;
  itemCount: number = 0;

  constructor(private router: Router, private cognitoService: CognitoService, private cartService: CartService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cognitoService.getUser().then((currentUser) => {
          if (currentUser) {
            this.isSignedIn = true;
          } else {
            this.isSignedIn = false;
          }
        });
      }
    });

    this.cartService.getItemCount().subscribe(count => {
      this.itemCount = count;
    });
  }

  signOut() {
    this.cognitoService.signOut();
    this.router.navigate(['/login']);
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}