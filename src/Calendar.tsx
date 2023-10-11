import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

export const Calendar = (): JSX.Element => {
    const handleDateClick = (arg: any) => {
        // arg.date にクリックした日付の情報が含まれています
        console.log('クリックした日付:', arg.date);
    }
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locales={[jaLocale]}
      locale="ja"
    //   dateClick={handleDateClick} // 日付をクリックしたときに呼び出す関数を指定
    />
  )
}