import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

export function createDateFormatter(locale: string = 'en-US'): DateFormatter {
  return new DateFormatter(locale, {
    dateStyle: 'medium',
  })
}

export function formatCalendarDate(date: CalendarDate, formatter: DateFormatter): string {
  return formatter.format(date.toDate(getLocalTimeZone()))
}

export function createInitialDate(): CalendarDate {
  return new CalendarDate(2022, 1, 10)
}
