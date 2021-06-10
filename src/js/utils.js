export function searchMinMax(arr) {
    const numbers = getOnlyNumbers(arr)
    return [Math.min(...numbers), Math.max(...numbers)]
}

export function getOnlyNumbers(arr) {
    return arr.filter(n => typeof n === 'number')
}