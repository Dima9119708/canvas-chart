import {DPI_WIDTH, VIEW_HEIGHT, VIEW_WIDTH, WIDTH} from "./vars";
import {line} from "./draw";
import {computeXRatio, computeYRatio, css, searchMinMax, toCoords} from "./utils";
import mouse from "./mouse";

const HEIGHT = 40
const DPI_HEIGHT = HEIGHT * 2
const MIN_WIDTH = WIDTH * 0.05;

export function sliderChart(root, data) {
    const canvas = root.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT

    const $left = root.querySelector('[data-el="left"]')
    const $window = root.querySelector('[data-el="window"]')
    const $right = root.querySelector('[data-el="right"]')

    root.addEventListener('mousedown', mousedown)
    root.addEventListener('mouseup', mouseup)

    let nextFN = () => {}

    function next() {
        mouse.resize = true
        nextFN(getPosition())
    }

    function mousedown(event) {
        const { target, pageX } = event
        const type = target.dataset.type

        const dimensions = {
            left: parseInt($window.style.left),
            right: parseInt($window.style.right),
            width: parseInt($window.style.width)
        }

        if (type === 'window') {
            document.onmousemove = e => {
                const delta = e.pageX - pageX
                const left = dimensions.left + delta
                const right = dimensions.right - delta
                setPosition(left, right)
                next()
            }
        }
        else if (type === 'left') {
            document.onmousemove = e => {
                const delta = e.pageX - pageX
                const left = dimensions.left + delta
                setPosition(left, dimensions.right)
                next()
            }
        }
        else if (type === 'right') {
            document.onmousemove = e => {
                const delta = e.pageX - pageX
                const right = dimensions.right - delta
                setPosition(dimensions.left, right)
                next()
            }
        }
    }

    function getPosition() {
        const left = parseInt($window.style.left)
        const right = WIDTH - parseInt($window.style.right)

        return [
            left * 100 / WIDTH,
            right * 100 / WIDTH,
        ]
    }

    function mouseup() {
        document.onmousemove = null
    }
    
    const defaultWidth = WIDTH * 0.3
    setPosition(0, WIDTH - defaultWidth)

    function setPosition(left, right) {
        const w = WIDTH - left - right

        if(w < MIN_WIDTH) {
            css($window, { width: MIN_WIDTH + 'px'})
            return
        }

        if (left < 0) {
            css($window, { left: '0px'})
            css($left, { width: '0px'})
            return
        }

        if (right < 0) {
            css($window, { right: '0px'})
            css($right, { width: '0px'})
            return
        }

        css($window, {
            width: w + 'px',
            right: right + 'px',
            left: left + 'px'
        })
        css($right, { width: right + 'px'})
        css($left, { width: left + 'px'})
    }

    const yData = data.columns.filter(col => data.types[col[0]] === 'line')

    const [yMin, yMax] = searchMinMax(yData.flat())

    const yRatio = computeYRatio(DPI_HEIGHT, yMax)
    const xRatio = computeXRatio(VIEW_WIDTH, data.columns[0].length - 1)

    yData.map(toCoords(xRatio, yRatio, DPI_HEIGHT, 0)).forEach( (coords, i) => {
        line(ctx, coords, data.colors[yData[i][0]])
    })

    return {
        subscribe(fn) {
            nextFN = fn
            fn(getPosition())
        }
    }
}