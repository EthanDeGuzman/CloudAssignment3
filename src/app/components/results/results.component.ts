import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CognitoService } from 'src/app/services/cognito.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/User';
import { IlineChartData } from 'src/app/interfaces/lineChart';
import { IpieChart } from 'src/app/interfaces/pieChart';
import { IbarChartData } from 'src/app/interfaces/barChart';
import { IscatterData } from 'src/app/interfaces/scatterChart';

const baseURL = "https://wzf55yplk1.execute-api.eu-west-1.amazonaws.com/dev/";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  public LineChart: any;
  public PieChart: any;
  public ScatterChart: any;
  public BarChart: any;
  token: string = '';
  user: IUser | undefined;
  lineChartData: IlineChartData | undefined;
  pieChartData: IpieChart | undefined;
  barChartData: IbarChartData | undefined;
  scatterChartData: IscatterData | undefined;
  defaultQuery: string = '';
  showResults: boolean = false;
  selected: string = "";
  queries: string[] = [];
  isLoading: boolean = true;

  constructor(private router:Router, private cognitoService: CognitoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user:IUser) => {
      if(user){
        this.user = user;
        this.cognitoService.getCurrentSession()
        .then((res) => {
          this.token = res.getIdToken().getJwtToken();
          
          this.getQueriesLambda(this.user?.username, this.token).subscribe(response => {
            console.log(response);
            this.queries = response.Queries;
            this.defaultQuery = response.Queries[0];
            this.generateAllCharts(this.defaultQuery);
          });
        })
      }
    })
  }

  generateAllCharts(query: string){
    this.isLoading = true;
    let numChartsLoaded = 0; // Initialize the counter for loaded charts
    const totalCharts = 4; // Set the total number of charts to load
  
    this.createLineChartLambda(this.user?.username, this.token, query).subscribe(response => {
      console.log(response);
      this.lineChartData = response;
      if (this.lineChartData) {
        this.lineChart(this.lineChartData);
        numChartsLoaded++; // Increment the counter
        if (numChartsLoaded === totalCharts) {
          this.isLoading = false; // Set isLoading to false when all charts have loaded
        }
      }
    });
  
    this.createPieChartLambda(this.user?.username, this.token, query).subscribe(response => {
      console.log(response);
      this.pieChartData = response;
      if (this.pieChartData) {
        this.pieChart(this.pieChartData);
        numChartsLoaded++; // Increment the counter
        if (numChartsLoaded === totalCharts) {
          this.isLoading = false; // Set isLoading to false when all charts have loaded
        }
      }
    });
  
    this.createBarChartLambda(this.user?.username, this.token, query).subscribe(response => {
      console.log(response);
      this.barChartData = response;
      if (this.barChartData){
        this.horinzotalBarChart(this.barChartData);
        numChartsLoaded++; // Increment the counter
        if (numChartsLoaded === totalCharts) {
          this.isLoading = false; // Set isLoading to false when all charts have loaded
        }
      }
    });
  
    this.createScatterLambda(this.user?.username, this.token, query).subscribe(response => {
      console.log(response);
      this.scatterChartData = response;
      if (this.scatterChartData){
        this.scatterChart(this.scatterChartData);
        numChartsLoaded++; // Increment the counter
        if (numChartsLoaded === totalCharts) {
          this.isLoading = false; // Set isLoading to false when all charts have loaded
        }
      }
    });
  }

  getQueriesLambda(data:any, token:string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'getQueries', {"UserID": data}, {headers: header})
  }

  createScatterLambda(data:any, token:string, query: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'createScatterChart', {"UserID": data, "Query": query}, {headers: header})
  }

  createBarChartLambda(data:any, token:string, query: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'createBarChart', {"UserID": data, "Query": query}, {headers: header})
  }

  createPieChartLambda(data:any, token:string, query: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'createPieChart', {"UserID": data, "Query": query}, {headers: header})
  }

  createLineChartLambda(data:any, token:string, query: string): Observable<any> {
    const header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this.http.post(baseURL + 'createLineChart', {"UserID": data, "Query": query}, {headers: header})
  }

  scatterChart(data: IscatterData){
    if (this.ScatterChart) { // check if the chart instance exists
      this.ScatterChart.data.datasets[0].data = data.Items; // update the chart data
      this.ScatterChart.update(); // update the chart
    }
    else{
      this.ScatterChart = new Chart("ScatterChart", {
        type: 'scatter',
  
        data: {
          datasets: [{
            label: 'Relationship between Retweets and Sentiment',
            data: data.Items,
            backgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Number of Retweets'
              }
            },
            y: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Sentiment Values'
              }
            }
          }
        }
      });
    }
  }

  pieChart(data: IpieChart){
    if (this.PieChart) {
      this.PieChart.data.datasets[0].data = [data.Positive, data.Negative, data.Neutral];
      this.PieChart.update();
    }
    else{
      this.PieChart = new Chart("PieChart", {
        type: 'pie', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: [
            'Positive',
            'Negative',
            'Neutral'
          ],
          datasets: [{
            label: 'Distribution of Sentiments',
            data: [data.Positive, data.Negative, data.Neutral],
            backgroundColor: [
              'rgb(0,255,127)',
              'rgb(220,20,60)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }],
        },
        options: {
          maintainAspectRatio: false,
        }
      });
    }
  }

  lineChart(data: IlineChartData) {
    // Sort the data items by date in ascending order
    const sortedItems = data.Items.sort((a, b) => a.Date.localeCompare(b.Date));

    const chartData = {
    labels: sortedItems.map(item => item.Date),
    datasets: [
        {
          label: 'Positive',
          data: sortedItems.map(item => item.Positive),
          fill: false,
          borderColor: 'rgb(0,255,127)',
          tension: 0.4
        },
        {
          label: 'Negative',
          data: sortedItems.map(item => item.Negative),
          fill: false,
          borderColor: 'rgb(220,20,60)',
          tension: 0.4
        },
        {
          label: 'Neutral',
          data: sortedItems.map(item => item.Neutral),
          fill: false,
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.4
        }
      ]
    };
    if(this.LineChart){
      this.LineChart.data = chartData;
      this.LineChart.update();
    }
    else{
      this.LineChart = new Chart("LineChart", {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
        }
      });
    }
  }

  horinzotalBarChart(data: IbarChartData){
    if (this.BarChart) {
      // Update the data for the chart
      this.BarChart.data.labels = data.Top_Words;
      this.BarChart.data.datasets[0].data = data.Word_Frequencies;
  
      // Call the update method to render the updated chart
      this.BarChart.update();
    } 
    else{
      this.BarChart = new Chart("HorizontalBarChart", {
        type: 'bar',
  
        data: {
          labels: data.Top_Words,
          datasets: [{
            label: 'Top 10 Word Frequencies',
            data: data.Word_Frequencies,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
        }
      });
    }
  }

  //Gets the value of selected option in dropdown
  getSelectedOption(event: Event){
    //Logs the selected value for debugging
    console.log((event.target as HTMLSelectElement).value);
    
    this.selected = (event.target as HTMLSelectElement).value;
    this.generateAllCharts(this.selected);
  }
}
