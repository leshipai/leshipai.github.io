/**
 * Sidebar cards: calendar (#card-widget-calendar) and
 * countdown + year/month/week progress bars (#card-widget-schedule).
 * Pure Date maths - no external date library.
 */
(function () {
  var calendarCard = document.getElementById('card-widget-calendar')
  var scheduleCard = document.getElementById('card-widget-schedule')
  if (!calendarCard && !scheduleCard) return

  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth()
  var date = now.getDate()
  var dayOfWeek = now.getDay()

  var leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  var daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  var daysInYear = leap ? 366 : 365
  var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  var dayOfYear = Math.round((new Date(year, month, date) - new Date(year, 0, 1)) / 86400000) + 1
  var firstDow = new Date(year, 0, 1).getDay()
  var weekOfYear = Math.ceil((dayOfYear + firstDow) / 7)

  if (calendarCard) {
    var weekEl = calendarCard.querySelector('#calendar-week')
    var dateEl = calendarCard.querySelector('#calendar-date')
    var solarEl = calendarCard.querySelector('#calendar-solar')
    var monthEl = calendarCard.querySelector('#calendar-month')
    var mainEl = calendarCard.querySelector('#calendar-main')

    if (weekEl) weekEl.textContent = 'Week ' + weekOfYear + ' · ' + weekNames[dayOfWeek]
    if (dateEl) dateEl.textContent = date < 10 ? '0' + date : String(date)
    if (solarEl) solarEl.textContent = monthNames[month] + ' ' + year
    if (monthEl) monthEl.textContent = 'Day ' + dayOfYear + ' of ' + daysInYear

    if (mainEl) {
      var firstCol = new Date(year, month, 1).getDay()
      var next = 1
      var row = null

      for (var i = 0; i < 42; i++) {
        if (i % 7 === 0) {
          row = document.createElement('div')
          row.className = 'calendar-r' + (i / 7)
          mainEl.appendChild(row)
        }

        var cell = document.createElement('div')
        cell.className = 'calendar-d' + (i % 7)

        if (i >= firstCol && next <= daysInMonth) {
          var a = document.createElement('a')
          a.textContent = String(next)
          if (next === date) a.className = 'now'
          cell.appendChild(a)
          next++
        }

        row.appendChild(cell)
      }
    }
  }

  if (scheduleCard) {
    var titleEl = scheduleCard.querySelector('#schedule-title')
    var daysEl = scheduleCard.querySelector('#schedule-days')
    var dateEl2 = scheduleCard.querySelector('#schedule-date')
    var target = new Date(year + 1, 0, 1)

    if (titleEl) titleEl.textContent = 'Until New Year'
    if (daysEl) daysEl.textContent = String(Math.max(0, Math.ceil((target - now) / 86400000)))
    if (dateEl2) dateEl2.textContent = (year + 1) + '-01-01'

    setBar(scheduleCard, 'year', dayOfYear, daysInYear)
    setBar(scheduleCard, 'month', date, daysInMonth)
    setBar(scheduleCard, 'week', ((dayOfWeek + 6) % 7) + 1, 7)
  }

  function setBar(scope, name, current, total) {
    var bar = scope.querySelector('#pBar_' + name)
    var num = scope.querySelector('#p_span_' + name)
    var pct = scope.querySelector('#p_spanpct_' + name)
    if (bar) {
      bar.max = total
      bar.value = current
    }
    if (num) num.textContent = current + ' / ' + total
    if (pct) pct.textContent = Math.round((current / total) * 1000) / 10 + '%'
  }
})()