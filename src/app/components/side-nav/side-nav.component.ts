import { Component, OnInit } from '@angular/core';

import {
  faDashboard,
  faCalendarDays,
  faSquarePollVertical,
  faUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  faDashboard = faDashboard;
  faCalendarDays = faCalendarDays;
  faSquarePollVertical = faSquarePollVertical;
  faUser = faUser;

  constructor() { }

  ngOnInit(): void {
  }

}
