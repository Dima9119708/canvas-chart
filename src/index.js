import '@babel/polyfill'
import data from './js/data/data'
import {searchMinMax} from "./js/utils";
import {drawLine, xAxis, yAxis} from "./js/draw";
import {DPI_HEIGHT, DPI_WIDTH, HEIGHT, PADDING, VIEW_HEIGHT, VIEW_WIDTH, WIDTH} from "./js/vars";

function chart(canvas, data) {
    const ctx = canvas.getContext('2d')

    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT

    const yData = data.columns.filter(col => data.types[col[0]] === 'line')
    const xData = data.columns.filter(col => data.types[col[0]] !== 'line')[0]

    const [yMin, yMax] = searchMinMax(yData.flat())
    const yRatio = VIEW_HEIGHT / (yMax - yMin)
    const xRatio = VIEW_WIDTH / (data.columns[0].length - 1)

    yAxis(ctx, yMin, yMax)
    xAxis(ctx, xData)

    yData.map(toCoords(xRatio, yRatio)).forEach( (coords, i) => {
        drawLine(ctx, coords, data.colors[yData[i][0]])
    })
}

function toCoords(xRatio, yRatio) {
    return (col) => col.map((y, i) => [
        Math.floor(i * xRatio),
        typeof y === 'number'
            ? Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
            : DPI_HEIGHT - PADDING
    ])
}

chart(document.getElementById('chart'), data)