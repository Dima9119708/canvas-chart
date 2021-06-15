import {css} from "./utils";
import data from "./data/data";

export const tooltip = {
    $tooltip : document.querySelector('.js--tooltip'),
    titleText: '',

    open() {
        css(this.$tooltip, { display: 'block' })
        css(this.$tooltip, { transition: 'all .2s linear' })
        return this
    },

    close() {
        css(this.$tooltip, { display: 'none' })
        return this
    },

    left(x) {
        css(this.$tooltip, { left: x + 'px' })
        return this
    },

    title(text) {
        this.titleText = text
    },

    clear() {
        this.$tooltip.innerHTML = null
    },

    update(mouse, yData) {
       this.clear()
       this.$tooltip.innerHTML = `
           <div class="tooltip-title">${this.titleText}</div>
              <div class="tooltip-list">
                  ${ mouse.pointsArc.map(({ y }, i) => `
                      <div class="tooltip-list-item" style="color: ${data.colors[yData[i][0]]}">
                          <div class="name">${y}</div>
                          <div class="value">${i < 1 ? 'Join' : 'Left'}</div>
                      </div>
                  `).join(' ') }
              </div>
           </div>
       `
    }
}