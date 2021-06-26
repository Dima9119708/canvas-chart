import mouse from "./mouse";

export function computeYRatio(height, yMax) {
    return height / yMax
}

export function computeXRatio(width, length) {
    return width / (length - 2)
}

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

export function toCoords(xRatio, yRatio, DPI_HEIGHT, PADDING) {
    return (col) => col.map((y, i) => [
        Math.floor(i * xRatio),
        typeof y === 'number'
            ? Math.floor(DPI_HEIGHT - PADDING - (y * yRatio))
            : DPI_HEIGHT - PADDING
    ])
}

export function rangeFN() {
    let range = true

    return (prev, next, x) => {

        const min = Math.floor( x - ((x - prev) / 2) )
        const max = Math.floor( ((next - x) / 2) + x)

        if (min <= mouse.currentX && mouse.currentX <= max && range) {
            range = false
            return true
        }

        return false
    }

}