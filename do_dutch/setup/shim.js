global.requestAnimationFrame = callback => {
    setTimeout(callback, 0)
}

import 'whatwg-fetch'
