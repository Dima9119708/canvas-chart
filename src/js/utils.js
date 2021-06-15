export function searchMinMax(arr) {
    const numbers = getOnlyNumbers(arr)
    return [Math.min(...numbers), Math.max(...numbers)]
}

export function getOnlyNumbers(arr) {
    return arr.filter(n => typeof n === 'number')
}

export function getDate(milliseconds) {
    const date = new Date(milliseconds).toString().split(' ')
    const dayOfWeek = date[0]
    const month = date[1]
    const day = date[2]
    return [month, day, dayOfWeek]
}

export function css(el, style = {}) {
    Object.assign(el.style, style)
}