import {DPI_HEIGHT, DPI_WIDTH, PADDING, ROWS_COUNT, VIEW_HEIGHT} from "./vars";
import {getDate} from "./utils";
import {tooltip} from "./tooltiip";
import data from "./data/data";

export function yAxis(ctx, yMin, yMax) {
    const step = VIEW_HEIGHT / ROWS_COUNT
    const textStep = (yMax - yMin) / ROWS_COUNT

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

export function xAxis(ctx, xData, xRadio, mouse) {
    const step = Math.round(xData.length / 6)
    const range = []

    for (let i = 1; i < xData.length; i += step) {
        const [month, day, dayOfWeek] = getDate(xData[i]);
        const x = Math.floor(xRadio * i)

        range.push([x, `${dayOfWeek}, ${month} ${day}`])

        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillStyle = '#9f9f9f'
        ctx.fillText(`${month} ${day}`, x, DPI_HEIGHT - 10);
    }

    for (const [i, [, date]] of range.entries()) {
        const prev = range[i - 1]?.[0] ?? 0
        const next = range[i + 1]?.[0] ?? DPI_WIDTH

        if ( prev <= mouse.currentX && mouse.currentX <= next) {
            tooltip.title(date)
            break
        }
    }
}

export function toCoords(xRatio, yRatio) {
    return (col) => col.map((y, i) => [
            Math.floor(i * xRatio),
            typeof y === 'number'
                ? Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
                : DPI_HEIGHT - PADDING
        ])
}

export function line(ctx, data, strokeColor = '#000', mouse) {
    let range = true

    ctx.beginPath()
    for (const [i, [x, y]] of data.entries()) {
        const prev = data[i - 1]?.[0] ?? 0
        const next = data[i + 1]?.[0] ?? x

        const min = Math.floor( x - ((x - prev) / 2) )
        const max = Math.floor( ((next - x) / 2) + x)

        if ( min <= mouse.currentX && mouse.currentX <= max && range) {
            mouse.x = x
            mouse.pointsArc.push({ x, y })
            range = false
        }

        ctx.lineTo(x, y)
    }

    ctx.lineWidth = 2
    ctx.strokeStyle = strokeColor
    ctx.stroke()
}

export function drawArc(ctx, pointsArc, yData) {
    for (const [i, { x, y }] of pointsArc.entries()) {
        if (!yData[i]?.[0]) break

        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.strokeStyle = data.colors[yData[i][0]]
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.stroke()
    }
}

export function drawVerticalLine(ctx, mouse) {
    ctx.beginPath()
    ctx.moveTo(mouse.x, 0)
    ctx.lineTo(mouse.x, VIEW_HEIGHT + PADDING)
    ctx.strokeStyle = '#bbb'
    ctx.stroke()
}