export class ListEvent{
  when?: WhenEventFilter = WhenEventFilter.ALL;
}

export enum WhenEventFilter{
  ALL = 1,
  TODAY,
  TOMORROW,
  THISWEEK,
  NEXTWEEK
}