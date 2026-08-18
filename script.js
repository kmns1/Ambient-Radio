const radio = document.querySelector('.radio')
const background = document.querySelector('.background')
const volume = document.querySelectorAll('.volumeSet')
const soundInner = document.querySelector('.inner')
const soundSet = document.querySelector('.soundSet')
const timeText = document.querySelector('#time')
const soundBtn = document.querySelectorAll('.soundBtn')
const soundSetBtn = document.querySelectorAll('.soundSetBtn')

let setting = false

let clickBtn = 0

const selected = [0, 0, 0]

let selectedAudio = [
    "",
    "",
    ""
]

let audio = [
    new Audio(''),
    new Audio(''),
    new Audio('')
]

let audioVolume = [
    0.5,
    0.5,
    0.5
]


radio.addEventListener('click', () => {
    radio.style.transform = "translateX(-50%) translateY(-80%) scale(1.5)"
    soundBtn.forEach(btn => {
        btn.style.pointerEvents = "auto"
    })

    volume.forEach(btn => {
        btn.style.pointerEvents = "auto"
    })
    background.style.filter = "blur(5px)"
    setting = true
})

background.addEventListener('click', () => {
    if (setting) {
        radio.style.transform = "translateX(-50%) translateY(0) scale(1)"
        soundBtn.forEach(btn => {
            btn.style.pointerEvents = "none"
        })

        volume.forEach(btn => {
            btn.style.pointerEvents = "none"
        })
        background.style.filter = "blur(0px)"
        setting = false
    }
})

volume.forEach((btn, index) => {
    let preesed = false
    let startx
    let endx
    let rotation = 0
    btn.addEventListener('pointerdown', e => {
        preesed = true
        startx = e.clientX
    })
    window.addEventListener('pointerup', () => {
        preesed = false
    })
    window.addEventListener('pointermove', e => {
        if (!preesed) return;

        endx = e.clientX

        let x = endx - startx

        let rotate = x * 0.8
        rotation += rotate
        rotation = Math.max(-135, Math.min(rotation, 135))
        btn.querySelector('.volumeObj').style.transform =
            `rotate(${rotation}deg)`
        startx = e.clientX

        audioVolume[index] = ((100 / 270) * rotation + 50) * 0.01
        audio[index].volume = audioVolume[index]
    })
})

const soundIcons = [
    document.querySelector('#soundBtn1 i'),
    document.querySelector('#soundBtn2 i'),
    document.querySelector('#soundBtn3 i')
]

soundBtn.forEach((btn, index) => {

    btn.addEventListener('click', () => {

        clickBtn = index

        timeText.style.opacity = 0
        timeText.style.pointerEvents = "none"

        soundSet.style.opacity = 1
        soundSet.style.pointerEvents = "auto"
    })
})

soundSetBtn.forEach((btn, index) => {

    btn.addEventListener('click', () => {

        const duplicated =
            selected.some((value, i) =>
                i !== clickBtn &&
                value === index &&
                index !== 0
            )

        if (duplicated) return

        soundSetBtn[selected[clickBtn]]
            .style.borderColor = "black"

        selected[clickBtn] = index

        soundSetBtn[index]
            .style.borderColor = "gray"

        soundIcons[clickBtn].className =
            btn.querySelector('i').className

        switch (selected[clickBtn]) {
            case 0:
                selectedAudio[clickBtn] = ""
                break;
            case 1:
                selectedAudio[clickBtn] = "Rain"
                break;
            case 2:
                selectedAudio[clickBtn] = "Thunder"
                break;
            case 3:
                selectedAudio[clickBtn] = "Music"
                break;
            case 4:
                selectedAudio[clickBtn] = "Wind"
                break;
            case 5:
                selectedAudio[clickBtn] = "Campfire"
                break;
            case 6:
                selectedAudio[clickBtn] = "People"
                break;
            default:
                selectedAudio[clickBtn] = ""
                break;
        }

        audio.forEach((sound, Sindex) => {

            if (selectedAudio[Sindex] === "") {

                sound.pause()
                sound.currentTime = 0

                return
            }

            const src =
                `./Sound/${selectedAudio[Sindex]}.mp3`

            if (sound.src.includes(selectedAudio[Sindex])) {

                if (sound.paused) {
                    sound.play()
                }

                return
            }

            sound.pause()

            audio[Sindex] = new Audio(src)

            audio[Sindex].loop = true

            audio[Sindex].play()

        })

        timeText.style.opacity = 1
        timeText.style.pointerEvents = "auto"

        soundSet.style.opacity = 0
        soundSet.style.pointerEvents = "none"
    })
})

let soundPreesed = false
let soundStartX
let soundX = 0

soundInner.addEventListener('pointerdown', e => {
    soundPreesed = true
    soundStartX = e.clientX - soundX
})
window.addEventListener('pointerup', () => {
    soundPreesed = false
})
window.addEventListener('pointermove', e => {
    if (!soundPreesed) return;

    soundX = e.clientX - soundStartX
    soundInner.style.left = `${soundX}px`
    checkboundary()
})

function checkboundary() {

    let outerRect = soundSet.getBoundingClientRect()
    let innerRect = soundInner.getBoundingClientRect()
    if (parseInt(soundInner.style.left) > 0) {
        soundInner.style.left = `0px`
    } else if (innerRect.right < outerRect.right) {
        soundInner.style.left = `${(soundSet.offsetWidth - soundInner.offsetWidth)}px`
    }
}

setInterval(() => {

    const now = new Date()

    timeText.textContent =
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

}, 1000)