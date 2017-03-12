require('./calendar.css')
import createCalendarHTML from './calendar'

module.exports = function calendarPlugin (md, options) {
  let name = 'calendar',
    startMarkerStr = '::: ' + name + ' ',
    endMarkerStr = ':::',
    PARAM_REGEX = /^(\d+)[ ]+(\d+)$/,
    DATE_REGEX = /^[+*-]\s+(\d{1,2})(\s(.*))?$/,
    EVENT_REGEX = /^[-*+]\s*\[(.*)\]\s*(.*)$/

  options = options || {}
  let render = options.render || renderDefault
  /*************************************************************
   * Default validate and render function
   */

  function renderDefault (tokens, idx, _options, env, self) {
    const data = tokens[idx].info
    const table = createCalendarHTML(data)
    return '<div class="markdown-it-calendar">' + table + '</div>'
  }

  /*************************************************************
   * Helper functions
   */
  function isValidDate (d) {
    // time structure must be {year: 2017, month: 12, date: 30, time: "13:14"}
    try {
      let result = new Date(d.year, d.month - 1, d.date)
      result.setFullYear(d.year) // ensure every year can be used
      let valid = d.year === result.getFullYear() &&
              d.month === (result.getMonth() + 1) &&
              d.date === result.getDate()
      return valid ? result : 'Invalid'
    } catch (err) {
      return false
    }
    return false
  }

  function isValidParams (params) {
    // return true if params is valid
    try {
      params = params.trim()
      params = params.match(PARAM_REGEX)
      if (params) {
        var year = parseInt(params[1])
        var month = parseInt(params[2])
        return year >= 0 && year <= 100000 && month >= 1 && month <= 12
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  function parseStartLine (src, start, end) {
    // Return earlier if not match
    let valid = src.substring(start, start + startMarkerStr.length).toLowerCase() === startMarkerStr
    if (!valid) {
      return false
    }

    valid = isValidParams(src.substring(start + startMarkerStr.length, end))
    if (!valid) {
      return false
    }
    let params = src.substring(start + startMarkerStr.length, end).trim().match(PARAM_REGEX)

    return {
      year: parseInt(params[1]),
      month: parseInt(params[2])
    }
  }

  function parseEndLine (src, start, end) {
    return src.substring(start, end).trim() == endMarkerStr
  }

  function parseDate (src, start, end, time) {
    // extract a valid Date
    let lineStr = src.substring(start, end).trim()
    try {
      let date = lineStr.match(DATE_REGEX)
      let localTime = Object.assign({}, time)
      localTime['date'] = parseInt(date[1])
      return isValidDate(localTime)
    } catch (err) {
      return false
    }
    return false
  }

  function parseEvent (src, start, end) {
    let lineStr = src.substring(start, end).trim()
    try {
      let event = lineStr.match(EVENT_REGEX)
      return {
        title: event[1],
        description: event[2]
      }
    } catch (err) {
      return false
    }
    return false
  }

  function addToken (state, params) {
    let token = state.push(params.type, params.tag || 'div', params.nesting)
    token.markup = params.markup || ''
    token.block = params.block || true
    token.content = params.content || ''
    if ('info' in params) {
      token.info = params.info
    }
    if ('map' in params) {
      token.map = params.map
    }
    return token
  }

  /*************************************************************
   * Rule function
   */
  function calendarRule (state, startLine, endLine, silent) {
    let currentLine, currentDay,
      autoClosed = 0,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      end = state.eMarks[startLine],
      renderInfo = {
        Date: {},
        Content: {}
      }

    // check the first line is correct
    let date = parseStartLine(state.src, start, end)
    if (date === false) {
      return false
    }
    if (silent) {
      return true
    }

    renderInfo['Date'] = date

    // iterate the lines
    for (currentLine = startLine + 1; currentLine < endLine; ++currentLine) {
      start = state.bMarks[currentLine] + state.tShift[currentLine]
      end = state.eMarks[currentLine]

      // Meet day line
      let day = parseDate(state.src, start, end, date)
      if (day === 'Invalid') {
        currentDay = undefined
      } else if (day) {
        currentDay = day
        continue
      } // ======================================================

      // Meet event line
      event = parseEvent(state.src, start, end)
      if (currentDay && event) {
        renderInfo['Content'][currentDay] = renderInfo['Content'][currentDay] || []
        renderInfo['Content'][currentDay].push(event)
        continue
      } // ======================================================

      // Meet End of line
      if (state.src[start] === endMarkerStr[0] && parseEndLine(state.src, start, end)) {
        autoClosed = 1
        break
      } // ======================================================
    } // end for (iterate the lines)

    state.line = currentLine + autoClosed
    // add token(calendar_open) to [tokens ...]
    token = addToken(state, {
      type: name,
      nesting: 0,
      markup: startMarkerStr,
      info: renderInfo,
      map: [startLine, state.line],
      content: ''
    })

    return true
  }

  md.block.ruler.before('fence', name, calendarRule, {
    alt: ['paragraph', 'blockquote', 'list']
  })
  md.renderer.rules[name] = renderDefault
}
