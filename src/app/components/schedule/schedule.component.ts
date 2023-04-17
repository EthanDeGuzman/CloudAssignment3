import { Component, OnInit} from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISchedule } from 'src/app/interfaces/schedule';
import { IUser } from 'src/app/interfaces/User';
import { IScheduleList } from 'src/app/interfaces/scheduleList';
import { IscheduleItem } from 'src/app/interfaces/scheduleList';

const baseURL = "https://wzf55yplk1.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit{

  selectedOption:string = '';
  schedule: ISchedule | undefined;
  repeat: string = '';
  scheduleList: IScheduleList | undefined;
  token: string = '';
  user: IUser | undefined;
  isConfirm:boolean = false;
  alertMessage: string = '';
  showAlert:boolean = false;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient){}

  ngOnInit(): void {
    this.schedule = {number:1} as ISchedule;
    this.selectedOption = 'Minutes';
    this.repeat = this.selectedOption.charAt(0).toLowerCase() + this.selectedOption.slice(1);
    this.cognitoService.getUser()
    .then((user:IUser) => {
      if(user){
        this.user = user;
        this.cognitoService.getCurrentSession()
        .then((res) => {
          this.token = res.getIdToken().getJwtToken();

          this.getScheduleLambda(this.user?.username, this.token).subscribe(res =>
            {
              this.scheduleList = res;
            })
        })
      }
    })
  }

  deleteItem(item: IscheduleItem): void {
    this.deleteEventLambda(item.GUID, this.token, item.RuleName).subscribe(res =>
    {
      console.log(res)
      this.getScheduleLambda(this.user?.username, this.token).subscribe(res =>
        {
          this.scheduleList = res;
        })
    })
  }

  deleteEventLambda(GUID:any, token:string, RuleName: any): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    const data = {
      "GUID": GUID,
      "RuleName": RuleName
    }

    return this.http.post(baseURL + 'deleteSchedule', data, {headers: header})
  }

  getScheduleLambda(userID:any, token:string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.get(baseURL + 'getSchedule/' + userID, {headers: header})
  }

  updateRepeatValue() {
    this.repeat = this.selectedOption.charAt(0).toLowerCase() + this.selectedOption.slice(1);
    console.log(this.repeat);
  }

  createEventLambda(data:any, token:string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'saveSchedule', data, {headers: header})
  }

  createEvent() {
    if (this.schedule && this.schedule.title && this.schedule.query && this.schedule.number && this.repeat && this.user){
      this.schedule.UserID = this.user.username;
      this.schedule.username = this.user.attributes.preferred_username;
      this.schedule.repeat = this.repeat;
      this.createEventLambda(this.schedule, this.token).subscribe(response => {
        console.log(response);
        this.showAlert = false;
        this.getScheduleLambda(this.user?.username, this.token).subscribe(res =>
          {
            this.scheduleList = res;
          })
      });
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
