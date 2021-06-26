import {DPI_HEIGHT, DPI_WIDTH, PADDING, ROWS_COUNT, VIEW_HEIGHT} from "./vars";
import {getDate, rangeFN} from "./utils";
import {tooltip} from "./tooltiip";
import data from "./data/data";
import mouse from "./mouse";

export function yAxis(ctx, yMax) {
    const step = VIEW_HEIGHT / ROWS_COUNT
    const textStep = yMax / ROWS_COUNT

    Array(ROWS_COUNT).fill('').forEach((_, i) => {
        i += 1
        const y = i * step
        const text = Math.floor(yMax - textStep * i)

        ctx.beginPath()
        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillStyle = '#9f9f9f'
        ctx.fillText(text.toString(), 0, y + PADDING - 10 );
        ctx.moveTo(0,  y + PADDING)
        ctx.lineTo(DPI_WIDTH, y + PADDING)
        ctx.lineWidth = 1
        ctx.strokeStyle = '#bbb'
        ctx.stroke()
    });
}

export function xAxis(ctx, xData, xRadio) {
    const step = Math.round(xData.length / 6)
    const range = rangeFN()

    for (let i = 1; i < xData.length; i++) {
        const [month, day, dayOfWeek] = getDate(xData[i]);
        const x = Math.floor(xRadio * i)

        const prev = xRadio * (i - 1) ?? 0
        const next = xRadio * (i + 1) ?? DPI_WIDTH

        if ( range(prev, next, x) ) {
            tooltip.setTitle(`${dayOfWeek}, ${month} ${day}`)
        }

        if ( (i - 1) % step === 0) {
            ctx.font = 'normal 20px Helvetica, sans-serif';
            ctx.fillStyle = '#9f9f9f'
            ctx.fillText(`${month} ${day}`, x, DPI_HEIGHT - 10);
        }
    }

}

export function line(ctx, data, strokeColor = '#000') {
    const range = rangeFN()

    ctx.beginPath()
    for (const [i, [x, y]] of data.entries()) {
        const prev = data[i - 1]?.[0] ?? 0
        const next = data[i + 1]?.[0] ?? x

        if ( range(prev, next, x) ) {
            mouse.x = x
            mouse.pointsArc.push([ x, y, i ])
        }

        ctx.lineTo(x, y)
    }

    ctx.lineWidth = 2
    ctx.strokeStyle = strokeColor
    ctx.stroke()
}

export function drawArc(ctx, yData) {
    mouse.pointsArc.forEach(([x, y], i) => {
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.strokeStyle = data.colors[yData[i][0]]
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.stroke()
    })
}

export function drawVerticalLine(ctx) {
    ctx.beginPath()
    ctx.moveTo(mouse.x, 0)
    ctx.lineTo(mouse.x, VIEW_HEIGHT + PADDING)
    ctx.strokeStyle = '#bbb'
    ctx.stroke()
}