export interface IlineChartData {
    message: string;
    Items: IlineChartItem[];
  }
  
  export interface IlineChartItem {
    Positive: number;
    Negative: number;
    Neutral: number;
    Date: string;
  }