export interface IScheduleList {
    ScheduleList: IscheduleItem[]
}
  
export interface IscheduleItem {
    GUID: string;
    Title: string;
    RuleName: string;
}