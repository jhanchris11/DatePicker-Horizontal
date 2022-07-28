export interface IPositionChange {
  currentPosition: string
  previousPosition: string
  event?: Event
  waypointTop: number
  viewportTop: number
  viewportBottom: number
}
