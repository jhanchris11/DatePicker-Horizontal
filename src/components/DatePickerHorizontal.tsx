import { LeftIcon } from '../icons/left'
import { RightIcon } from '../icons/right'
import { Waypoint } from 'react-waypoint'
import es from 'date-fns/locale/es'
import { memo, useRef, useState } from 'react'
import { IPositionChange } from '../types'
import {
  format,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  isBefore
} from 'date-fns'
interface MyProps {
  selectedDay: (t: Date) => void
  enableScroll: boolean
  enableDays: number
}

export const DatePickerHorizontal = memo(
  ({ selectedDay, enableScroll, enableDays }: MyProps) => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [headingDate, setHeadingDate] = useState(new Date())
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [currentDate] = useState(new Date())
    const container = useRef<HTMLDivElement>(null)
    const scrollWidth = 295

    enableScroll = enableScroll || false
    enableDays = enableScroll === true ? enableDays || 90 : 7

    const handleNextScroll = () => {
      let containerLeft = container.current
      if (!enableScroll) return setCurrentWeek(addWeeks(currentWeek, 1))
      if (containerLeft) return (containerLeft.scrollLeft += scrollWidth)
    }

    const handlePrevScroll = () => {
      let containerLeft = container.current
      if (!enableScroll) return setCurrentWeek(subWeeks(currentWeek, 1))
      if (containerLeft) return (containerLeft.scrollLeft -= scrollWidth)
    }

    const _handlePosition = (pos: IPositionChange, date: Date) => {
      let currentPosition = pos.currentPosition
      let previousPosition = pos.previousPosition

      if (previousPosition == 'inside' && currentPosition == 'above') {
        setHeadingDate(date)
      }
      if (previousPosition == 'above' && currentPosition == 'inside') {
        setHeadingDate(addDays(date, -1))
      }
    }

    const onDateClick = (day: Date) => {
      setSelectedDate(day)
      selectedDay(selectedDate)
    }

    const applyStyles = (day: Date) => {
      const classes = []
      if (isSameDay(day, selectedDate)) {
        classes.push(' date-day-Item-selected')
      }

      if (isBefore(day, currentDate)) {
        classes.push(' date-day-item-disabled')
      }
      return classes.join(' ')
    }

    const listDays = (): JSX.Element => {
      const _dayFormat = 'E'
      const _dateFormat = 'dd'

      const _verticalListItems = []
      const _startDay = subDays(currentWeek, 1)

      for (let i = 0; i < enableDays; i++) {
        let _day = format(addDays(_startDay, i), _dayFormat, { locale: es }) //mar
        let _date = format(addDays(_startDay, i), _dateFormat) //14

        _verticalListItems.push(
          <Waypoint
            key={i}
            horizontal={true}
            onPositionChange={(pos) => {
              return _date ? _handlePosition(pos, addDays(_startDay, i)) : ''
            }}
          >
            <div className="wrapper">
              {format(addDays(_startDay, i), _dateFormat) == '01' ? (
                <div className="scroll-head">
                  {format(addDays(_startDay, i), 'MMM')}
                </div>
              ) : (
                <div className="blank-space-div"></div>
              )}
              <div
                className={`datepicker-date-day-Item wrapper ${applyStyles(
                  addDays(_startDay, i)
                )}`}
                onClick={() => onDateClick(addDays(_startDay, i))}
              >
                <div className="datepicker-day-label ">{_day}</div>
                <div className="datepicker-date-label ripple ">{_date}</div>
              </div>
            </div>
          </Waypoint>
        )
      }

      return (
        <div
          id="container"
          ref={container}
          className={
            enableScroll === true
              ? ' datepicker-datelist-scrollable'
              : ' datepicker-dateList'
          }
        >
          {_verticalListItems}
        </div>
      )
    }

    return (
      <div className="datepicker-strip">
        <div className="datepicker-wrapper-label">
          <span className="datepicker-month-label ">
            {format(selectedDate, 'dd MMM yyy', { locale: es })}
          </span>
          <div className="wrapper-icon">
            <button className="icon" onClick={handlePrevScroll}>
              <LeftIcon fill={'#000'} />
            </button>
            <button className="icon" onClick={handleNextScroll}>
              <RightIcon fill={'#000'} />
            </button>
          </div>
        </div>

        <div className="datepicker">{listDays()}</div>
      </div>
    )
  }
)
