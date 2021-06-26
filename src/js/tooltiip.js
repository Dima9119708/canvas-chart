import {css} from "./utils";
import data from "./data/data";
import mouse from "./mouse";

export const tooltip = {
    $tooltip : document.querySelector('[data-el="tooltip"]'),
    title: '',

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

    setTitle(text) {
        this.title = text
    },

    clear() {
        this.$tooltip.innerHTML = null
    },

    update(yData) {
       this.clear()
       this.$tooltip.innerHTML = `
           <div class="tooltip-title">${this.title}</div>
              <div class="tooltip-list">
                  ${ mouse.pointsArc.map(( [ ,,i ], index) => `
                      <div class="tooltip-list-item" style="color: ${data.colors[yData[index][0]]}">
                          <div class="name">${yData[index][i]}</div>
                          <div class="value">${Object.values(data.names)[index]}</div>
                      </div>
                  `).join(' ') }
              </div>
           </div>
       `
    }
}