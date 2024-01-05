// const monthNamesMap = new Map()
const monthNamesMap = new Map()
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
for (let i = 0; i < monthNames.length; i++) {
    monthNamesMap.set(String(i+1), monthNames[i])
}
const daysCodeMap = new Map()
const dayNamesMap = new Map()
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const dayNamesTranslateJapaneseMap = new Map()
const dayJapaneseNames = ["日", "月", "火", "水", "木", "金", "土"]
for (let i = 0; i < dayNames.length; i++) {
    daysCodeMap.set(dayNames[i], i)
    dayNamesMap.set(i, dayNames[i])
    dayNamesTranslateJapaneseMap.set(dayNames[i], dayJapaneseNames[i])
}
//
function getNamesOfMonths(months) {
    let result = []
    for (const month of months) {
        if (monthNamesMap.get(month)) {
            result.push(monthNamesMap.get(month))
        }
    }
    return result
}
function getCodeOfDays(days) {
    let result = []
    for (const day of days) {
        if (daysCodeMap.get(day).toLocaleString()) {
            result.push(daysCodeMap.get(day))
        }
    }
    return result
}
function getJapaneseNamesOfDays(days) {
    let result = []
    for (const day of days) {
        if (dayNamesTranslateJapaneseMap.get(day)) {
            result.push(dayNamesTranslateJapaneseMap.get(day))
        }
    }
    return result
}
const unavailableMonths = ["12", "1", "2"]
const unavailableMonthNames = getNamesOfMonths(unavailableMonths)
const unavailableDayNames = ["Sunday", "Tuesday", "Thursday" , "Saturday"]
const unavailableDayCodes = getCodeOfDays(unavailableDayNames)
const unavailableDayJapaneseNames = getJapaneseNamesOfDays(unavailableDayNames)
const language = ""
// const language = "Japanese"
//
const calenderEl = document.getElementById("calender")
//
function convertNumberToTwoDigitsString(number) {
    return (number).toLocaleString(undefined, {minimumIntegerDigits: 2})
}
function calcMinAvailableDay() {
    const currentDate = new Date()
    //
    const availableBookDayDelay = 3
    const offsetUTCtoJST = 9// [hour]
    const offsetUTCtoLocalTimeZone = currentDate.getTimezoneOffset()// [minutes]
    const factorMinutesToMillisecond = 60 * 1000
    const factorHourToMillisecond = 60 * factorMinutesToMillisecond
    //
    let offset = offsetUTCtoLocalTimeZone * factorMinutesToMillisecond;// [millisecond]
    offset += offsetUTCtoJST * factorHourToMillisecond;
    offset += (availableBookDayDelay * 24) * factorHourToMillisecond;
    //
    const minAvailableDate = new Date()
    minAvailableDate.setTime(currentDate.getTime() + offset)
    //
    return `${minAvailableDate.getFullYear()}-${convertNumberToTwoDigitsString(minAvailableDate.getMonth()+1)}-${convertNumberToTwoDigitsString(minAvailableDate.getDate())}`
}
calenderEl.min = calcMinAvailableDay()
//
function createEnglishMessage(values) {
    if (values.length < 2) {
        return values
    }
    return `${values.slice(0, values.length - 1).join(', ')} and ${values.slice(-1)}`
}
const validate = dateString => {
    const selectedDate = new Date(dateString)
    //
    const month = String(selectedDate.getUTCMonth() + 1)
    if (unavailableMonths.includes(month) && monthNamesMap.get(month)) {
        let errorMessage = `${createEnglishMessage(unavailableMonthNames)} are not available for this tour.`
        if (language == "Japanese") {
            errorMessage = `${unavailableMonths.join('、')}月はこのツアーをご利用いただけません。`
        }
        alert(errorMessage)
        return false
    }
    //
    const day = selectedDate.getUTCDay()
    if (unavailableDayCodes.includes(day) && dayNamesMap.get(day)) {
        let errorMessage = `${createEnglishMessage(unavailableDayNames)} are not available for this tour.`
        if (language == "Japanese") {
            errorMessage = `${unavailableDayJapaneseNames.join('、')}曜日はこのツアーをご利用いただけません。`
        }
        alert(errorMessage)
        return false    
    }
    //
    return true
}
calenderEl.onchange = evt => {
    if (!validate(evt.target.value)) {
        evt.target.value = ''
    }
    console.log(evt.target.value)
}