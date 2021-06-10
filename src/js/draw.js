import {DPI_WIDTH, PADDING, ROWS_COUNT, VIEW_HEIGHT} from "./vars";
import {getOnlyNumbers} from "./utils";

export function yAxis(ctx, yMin, yMax) {
    const step = VIEW_HEIGHT / ROWS_COUNT
    const textStep = (yMax - yMin) / ROWS_COUNT

    Array(ROWS_COUNT).fill('').forEach((_, i) => {
        i += 1
        const y = i * step
        const text = Math.floor(yMax - textStep * i)

        ctx.beginPath()
        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillText(text.toString(), 0, y + PADDING - 10 );
        ctx.moveTo(0,  y + PADDING)
        ctx.lineTo(DPI_WIDTH, y + PADDING)
        ctx.strokeStyle = '#bbb'
        ctx.stroke()
    });
}

export function xAxis(ctx, xData) {
    const dates = getOnlyNumbers(xData)
    dates.forEach( (milliseconds, i) => {
        const date = new Date(milliseconds).toString()
        const month = date.split(' ')[1]
        const day = date.split(' ')[2]

        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillStyle = '#9f9f9f'
        ctx.fillText(`${month} ${day}`, VIEW_HEIGHT * i, VIEW_HEIGHT + PADDING + 25);
    })
}

export function drawLine(ctx, data, strokeColor = '#000') {
    ctx.beginPath()
    for (const [x, y] of data) {
        ctx.lineTo(x, y)
    }
    ctx.strokeStyle = strokeColor
    ctx.stroke()
}