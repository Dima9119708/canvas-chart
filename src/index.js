import '@babel/polyfill'
import './styles.scss'
import data from './js/data/data'
import {searchMinMax} from "./js/utils";
import {drawArc, drawVerticalLine, line, toCoords, xAxis, yAxis} from "./js/draw";
import {DPI_HEIGHT, DPI_WIDTH, HEIGHT, PADDING, VIEW_HEIGHT, VIEW_WIDTH, WIDTH} from "./js/vars";
import {tooltip} from "./js/tooltiip";

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
    let rfa = null

    const mouse = {
        x: undefined,
        currentX: undefined,
        clientX: undefined,
        pointsArc: [],

        clear() {
            this.x = undefined
            this.currentX = undefined
            this.clientX = undefined
            this.pointsArc = []
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        mouse.pointsArc.length = 0
    }

    function render() {
        clearCanvas()

        yAxis(ctx, yMin, yMax)
        xAxis(ctx, xData, xRatio, mouse)

        yData.map(toCoords(xRatio, yRatio)).forEach( (coords, i) => {
            line(ctx, coords, data.colors[yData[i][0]], mouse)
        })

        drawVerticalLine(ctx, mouse)
        drawArc(ctx, mouse.pointsArc, yData)

        tooltip.left( mouse.clientX + 20).update(mouse, yData)
    }

    render()

    const { left } = canvas.getBoundingClientRect()

    canvas.addEventListener('mouseenter', mouseEnter)

    function mouseEnter(e) {
        tooltip.open().left(e.clientX + 20)
        canvas.addEventListener('mousemove',  mouseMove)
        canvas.addEventListener('mouseleave', mouseLeave)
    }

    function mouseMove({ clientX }) {
        rfa = requestAnimationFrame(render)

        const currentX = Math.floor(clientX - left) * (DPI_WIDTH / WIDTH)

        mouse.currentX = currentX
        mouse.clientX = clientX
    }

    function mouseLeave() {
        mouse.clear()
        tooltip.close()
        render()
        canvas.removeEventListener('mousemove', mouseMove)
        canvas.removeEventListener('mouseleave', mouseLeave)
        cancelAnimationFrame(rfa)
    }
}


chart(document.getElementById('chart'), data)