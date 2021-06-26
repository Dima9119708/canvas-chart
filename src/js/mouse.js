export default {
    x: undefined,
    currentX: undefined,
    clientX: undefined,
    pointsArc: [],
    pos: [],
    resize: false,

    clear() {
        this.x = undefined
        this.currentX = undefined
        this.clientX = undefined
        this.pointsArc = []
    }
}