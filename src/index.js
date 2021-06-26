import '@babel/polyfill'
import './styles.scss'
import data from './js/data/data'
import {computeXRatio, computeYRatio, getOnlyNumbers, searchMinMax, toCoords} from "./js/utils";
import {drawArc, drawVerticalLine, line, xAxis, yAxis} from "./js/draw";
import {DPI_HEIGHT, DPI_WIDTH, HEIGHT, PADDING, VIEW_HEIGHT, VIEW_WIDTH, WIDTH} from "./js/vars";
import {tooltip} from "./js/tooltiip";
import mouse from "./js/mouse";
import {sliderChart} from "./js/slider";

function chart(root, data) {
    const canvas = root.querySelector('[data-el="main"]')
    const slider = sliderChart(root.querySelector('[data-el="slider"]'), data)
    const ctx = canvas.getContext('2d')

    let rfa

    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT

    let count = 100

    slider.subscribe(pos => {
        mouse.pos = pos
        render()
    })

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        mouse.pointsArc.length = 0
    }

    function render(timestamp) {
        clearCanvas()

        const length = data.columns[0].length
        const leftIndex =  Math.round((length * mouse.pos[0] / 100))
        const rightIndex = Math.round((length * mouse.pos[1] / 100))

        const columns = data.columns.map((col,i) => {
            const res = col.slice(leftIndex, rightIndex)
            if (typeof res[0] !== 'string') {
                res.unshift(col[0])
            }
            return res
        })

        const yData = columns.filter(col => data.types[col[0]] === 'line')
        const xData = columns.filter(col => data.types[col[0]] !== 'line')[0]

        const [yMin, yMax] = searchMinMax(yData.flat())

        const yRatio = computeYRatio(VIEW_HEIGHT, yMax)
        const xRatio = computeXRatio(VIEW_WIDTH, columns[0].length)

        yAxis(ctx, yMax)
        xAxis(ctx, xData, xRatio)

        yData.map(toCoords(xRatio, yRatio, DPI_HEIGHT, PADDING))
             .forEach( (coords, i) => {
                if (mouse.pos[0] !== 0) {
                    coords.splice(0, 1);
                }

                line(ctx, coords, data.colors[yData[i][0]])
             })

        drawVerticalLine(ctx)
        drawArc(ctx, yData)

        tooltip.left( mouse.clientX + 20).update(yData)
    }

    render()

    const { left } = canvas.getBoundingClientRect()

    canvas.addEventListener('mouseenter', mouseEnter)

    function mouseEnter({ clientX }) {
        tooltip.open().left(clientX)
        canvas.addEventListener('mousemove',  mouseMove)
        canvas.addEventListener('mouseleave', mouseLeave)
    }

    function mouseMove({ clientX }) {
        rfa = requestAnimationFrame(render)

        const currentX = Math.floor(clientX - left) * (DPI_WIDTH / WIDTH)

        mouse.currentX = currentX
        mouse.clientX = clientX - left
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