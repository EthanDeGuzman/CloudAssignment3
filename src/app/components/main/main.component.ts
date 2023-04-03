import { Component } from '@angular/core';

import {
  faTwitter
} from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  faTwitter = faTwitter;
}
