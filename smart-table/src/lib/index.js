export function toggleFullScreen() {
    var doc = window.document
    var docEl = doc.documentElement
    var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen
    var cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen
    if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(docEl)
    } else {
        cancelFullScreen.call(doc)
    }
}

export class Spring {
    constructor({ mass, tension, friction, initVelocity, from, to, onUpdate, axis = null }) {
        this.mass = mass                 // Масса пружины
        this.tension = tension           // Коэффициент упругости
        this.friction = friction         // Коэффициент трения
        this.initVelocity = initVelocity // Начальная скорость

        this.from = from                 // От какого значения анимировать
        this.to = to                     // До какого значения анимировать
        this.onUpdate = onUpdate         // Каллбек, вызывающийся при обновлении значения
        this.axis = axis
    }

    startAnimation() {
        const callDoAnimationTick = () => {
            const isFinished = this.doAnimationTick()

            if (isFinished) {
                return
            }

            this.nextTick = window.requestAnimationFrame(callDoAnimationTick)
        }

        callDoAnimationTick()
    }

    stopAnimation() {
        const { nextTick } = this

        if (nextTick) {
            window.cancelAnimationFrame(nextTick)
        }

        this.isFinished = true
    }

    doAnimationTick() {
        const {
            mass, tension, friction, initVelocity, from, to,
            previousTimestamp, prevVelocity, prevValue, onUpdate,
        } = this

        // Считаем Δt
        const currentTimestamp = performance.now()
        const deltaT = (currentTimestamp - (previousTimestamp || currentTimestamp))
            / 1000
        const normalizedDeltaT = Math.min(deltaT, 0.046)

        let prevSafeVelocity = prevVelocity || initVelocity || 0
        let prevSafeValue = prevValue || from

        // Считаем силу упругости, силу трения и ускорение
        const springRestoringForce = -1 * tension * (prevSafeValue - to)
        const dampingForce = -1 * prevSafeVelocity * friction
        const acceleration = (springRestoringForce + dampingForce) / mass

        // Считаем новую скорость и новое значение анимации
        const newVelocity = prevSafeVelocity + acceleration * normalizedDeltaT
        const newValue = prevSafeValue + newVelocity * normalizedDeltaT


        // Проверяем анимацию на конец
        const precision = 0.001
        let isFinished = Math.abs(newVelocity) < precision
            && Math.abs(newValue - to) < precision

        if (this.axis === 'y') {
            if (Math.abs(newValue) > 500) {
                isFinished = true
            }
        }

        onUpdate({ value: newValue, isFinished })

        this.previousTimestamp = currentTimestamp
        this.prevValue = newValue
        this.prevVelocity = newVelocity
        this.isFinished = isFinished

        return isFinished
    }
}