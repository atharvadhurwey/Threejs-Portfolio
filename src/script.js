import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

disableScroll()

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x323333)

/**
 * Loaders
 */
// Loading Manager
const loadingManager = new THREE.LoadingManager();

// Loading Bar
const progressBar = document.getElementById('progressbar');

loadingManager.onProgress = function (url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progressbar-container');

loadingManager.onLoad = function () {
    progressBarContainer.style.display = 'none';
    enableScroll()
}

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('myRoomBaked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const katanaTexture = textureLoader.load('katanaBaked.jpg')
katanaTexture.flipY = false
katanaTexture.encoding = THREE.sRGBEncoding

const keyboardTexture = textureLoader.load('keyboardBaked.jpg')
keyboardTexture.flipY = false
keyboardTexture.encoding = THREE.sRGBEncoding

const macBookandAmongUsTexture = textureLoader.load('laptopBottomAndAmongUs.jpg')
macBookandAmongUsTexture.flipY = false
macBookandAmongUsTexture.encoding = THREE.sRGBEncoding

const lufyTexture = textureLoader.load('luffyHat.jpg')
lufyTexture.flipY = false
lufyTexture.encoding = THREE.sRGBEncoding

const chocoChipsTexture = textureLoader.load('chocoChips.jpg')
chocoChipsTexture.flipY = false
chocoChipsTexture.encoding = THREE.sRGBEncoding

const deathNoteTexture = textureLoader.load('deathNoteBook.jpg')
deathNoteTexture.flipY = false
deathNoteTexture.encoding = THREE.sRGBEncoding

const posterATexture = textureLoader.load('dragonBallPosterA.jpg')
posterATexture.flipY = false
posterATexture.encoding = THREE.sRGBEncoding

const posterBTexture = textureLoader.load('onePiecePosterB.jpg')
posterBTexture.flipY = false
posterBTexture.encoding = THREE.sRGBEncoding

const posterCTexture = textureLoader.load('narutoPosterC.jpg')
posterCTexture.flipY = false
posterCTexture.encoding = THREE.sRGBEncoding

const laptopScreenTexture = textureLoader.load('laptopScreen.jpg')
laptopScreenTexture.flipY = false
laptopScreenTexture.encoding = THREE.sRGBEncoding

const phoneScreenTexture = textureLoader.load('phoneScreen.jpg')
phoneScreenTexture.flipY = false
phoneScreenTexture.encoding = THREE.sRGBEncoding

// Video Texture
let monitorScreenVideo = document.getElementById('monitorScreenVideo')
let monitorScreenTexture = new THREE.VideoTexture(monitorScreenVideo)

monitorScreenTexture.minFilter = THREE.LinearFilter
monitorScreenTexture.magFilter = THREE.LinearFilter

var monitorScreenMaterial = new THREE.MeshBasicMaterial({
    map: monitorScreenTexture,
    side: THREE.FrontSide,
    toneMapped: false
})

let tvScreenVideo = document.getElementById('tvScreenVideo')
let tvScreenTexture = new THREE.VideoTexture(tvScreenVideo)

tvScreenTexture.minFilter = THREE.LinearFilter
tvScreenTexture.magFilter = THREE.LinearFilter

var tvScreenMaterial = new THREE.MeshBasicMaterial({
    map: tvScreenTexture,
    side: THREE.FrontSide,
    toneMapped: false
})

/** 
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const katanaMaterial = new THREE.MeshBasicMaterial({ map: katanaTexture })
const keyboardMaterial = new THREE.MeshBasicMaterial({ map: keyboardTexture })
const macBookandAmongUsMaterial = new THREE.MeshBasicMaterial({ map: macBookandAmongUsTexture })
const lufyMaterial = new THREE.MeshBasicMaterial({ map: lufyTexture })
const chocoChipsMaterial = new THREE.MeshBasicMaterial({ map: chocoChipsTexture })
const deathNoteMaterial = new THREE.MeshBasicMaterial({ map: deathNoteTexture })
const laptopScreenMaterial = new THREE.MeshBasicMaterial({ map: laptopScreenTexture })
const phoneScreenMaterial = new THREE.MeshBasicMaterial({ map: phoneScreenTexture })
const posterAMaterial = new THREE.MeshBasicMaterial({ map: posterATexture })
const posterBMaterial = new THREE.MeshBasicMaterial({ map: posterBTexture })
const posterCMaterial = new THREE.MeshBasicMaterial({ map: posterCTexture })


const windowLight = new THREE.MeshBasicMaterial({ color: 0xffd392 })
const greenLight = new THREE.MeshBasicMaterial({ color: 0x8eff3f })
const cabinetLight = new THREE.MeshBasicMaterial({ color: 0xffa308 })
const yellowLight = new THREE.MeshBasicMaterial({ color: 0xf6ff00 })
const windowShade = new THREE.MeshBasicMaterial({
    color: 0xE7CAAA,
    transparent: true,
    opacity: 0.8
})

/**
 * Model
 */

var model = false;

gltfLoader.load(
    'myRoomUnwrapped.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial;
        });

        const lowerWindowLight = gltf.scene.children.find(child => child.name === 'lowerWindowLight')
        const upperWindowLight = gltf.scene.children.find(child => child.name === 'upperWindowLight')
        const tubeLight = gltf.scene.children.find(child => child.name === 'tubeLight')
        const cabinetLights = gltf.scene.children.find(child => child.name === 'cabinetLights')
        const cabinetFanA = gltf.scene.children.find(child => child.name === 'cabinetFanA')
        const cabinetFanB = gltf.scene.children.find(child => child.name === 'cabinetFanB')
        const routerLights = gltf.scene.children.find(child => child.name === 'routerLights')
        const windowshade = gltf.scene.children.find(child => child.name === 'windowshade')
        const amongUsAngleHat = gltf.scene.children.find(child => child.name === 'amongUsAngleHat')
        const katanaBlade = gltf.scene.children.find(child => child.name === 'katanaBlade')
        const KeyBoard = gltf.scene.children.find(child => child.name === 'KeyBoard')
        const macBookBottom = gltf.scene.children.find(child => child.name === 'macBookBottom')
        const redBody = gltf.scene.children.find(child => child.name === 'redBody')
        const orangeBody = gltf.scene.children.find(child => child.name === 'orangeBody')
        const brownBody = gltf.scene.children.find(child => child.name === 'brownBody')
        const luffyHat = gltf.scene.children.find(child => child.name === 'hat_luffy')
        const chocoChips = gltf.scene.children.find(child => child.name === 'chocoChips')
        const deathNoteCover = gltf.scene.children.find(child => child.name === 'deathNoteCover')
        const deathNotePages = gltf.scene.children.find(child => child.name === 'deathNotePages')
        const posterScreen1 = gltf.scene.children.find(child => child.name === 'posterScreen1')
        const posterScreen2 = gltf.scene.children.find(child => child.name === 'posterScreen2')
        const posterScreen3 = gltf.scene.children.find(child => child.name === 'posterScreen3')
        const monitorScreen = gltf.scene.children.find(child => child.name === 'monitorScreen')
        const tvScreen = gltf.scene.children.find(child => child.name === 'tvScreen')
        const laptopScreen = gltf.scene.children.find(child => child.name === 'laptopScreen')
        const phoneScreen = gltf.scene.children.find(child => child.name === 'phoneScreen')

        lowerWindowLight.material = windowLight
        upperWindowLight.material = windowLight
        tubeLight.material = windowLight
        routerLights.material = greenLight
        cabinetLights.material = greenLight
        cabinetFanA.material = cabinetLight
        cabinetFanB.material = cabinetLight
        windowshade.material = windowShade
        amongUsAngleHat.material = yellowLight
        katanaBlade.material = katanaMaterial
        KeyBoard.material = keyboardMaterial
        macBookBottom.material = macBookandAmongUsMaterial
        redBody.material = macBookandAmongUsMaterial
        orangeBody.material = macBookandAmongUsMaterial
        brownBody.material = macBookandAmongUsMaterial
        luffyHat.material = lufyMaterial
        chocoChips.material = chocoChipsMaterial
        deathNoteCover.material = deathNoteMaterial
        deathNotePages.material = deathNoteMaterial
        posterScreen1.material = posterCMaterial
        posterScreen2.material = posterBMaterial
        posterScreen3.material = posterAMaterial
        monitorScreen.material = monitorScreenMaterial
        tvScreen.material = tvScreenMaterial
        laptopScreen.material = laptopScreenMaterial
        phoneScreen.material = phoneScreenMaterial

        model = gltf.scene;
        model.position.set(0, -1.5, 0);
        model.rotation.y = -(Math.PI / 4);
        const scale = 0.7;
        const range = 10;
        model.scale.set(scale, scale, scale);

        gui.add(model.position, 'x').min(-range).max(range).step(0.01).name('x')
        gui.add(model.position, 'y').min(-range).max(range).step(0.01).name('y')
        gui.add(model.position, 'z').min(-range).max(range).step(0.01).name('z')
        gui.add(model.rotation, 'x').min(-range).max(range).step(0.01).name('rotataion x')
        gui.add(model.rotation, 'y').min(-range).max(range).step(0.01).name('rotataion y')
        gui.add(model.rotation, 'z').min(-range).max(range).step(0.01).name('rotataion z')


        scene.add(model);
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const aspectRatio = sizes.width / sizes.height
const frustrum = 5
const camera = new THREE.OrthographicCamera(-aspectRatio * frustrum / 2, aspectRatio * frustrum / 2, frustrum / 2, -frustrum / 2, -50, 50)
camera.position.x = 10
camera.position.y = 5.56
camera.rotation.x = -Math.PI / 6;
camera.zoom = 1
camera.updateProjectionMatrix()
scene.add(camera)

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

monitorScreenVideo.play()
tvScreenVideo.play()
tvScreenVideo.playbackRate = 0.7;
document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        monitorScreenVideo.paused ? monitorScreenVideo.play() : monitorScreenVideo.pause()
        tvScreenVideo.paused ? tvScreenVideo.play() : tvScreenVideo.pause()
    }
};

function checkVisible(elm, threshold, mode) {
    threshold = threshold || 0;
    mode = mode || 'visible';

    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    var above = rect.bottom - threshold < 0;
    var below = rect.top - viewHeight + threshold >= 0;

    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

let lastScrollTop = 0;
let scrollDirection = 'down';
window.addEventListener("scroll", function () {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        // downscroll code
        scrollDirection = 'down'
    } else if (st < lastScrollTop) {
        // upscroll code
        scrollDirection = 'up'
    } // else was horizontal scroll
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

const firstSectionBreak = document.querySelector('.first-SectionBreak')
const firstSection = document.querySelector('.first-Section')
const secondSectionBreak = document.querySelector('.second-SectionBreak')
const secondSection = document.querySelector('.second-Section')
const thirdSectionBreak = document.querySelector('.third-SectionBreak')
const thirdSection = document.querySelector('.third-Section')
const fourthSectionBreak = document.querySelector('.fourth-SectionBreak')
const fourthSection = document.querySelector('.fourth-Section')

let firstSectionBreakBool, firstSectionBool
let secondSectionBreakBool, secondSectionBool
let thirdSectionBreakBool, thirdSectionBool
let fourthSectionBreakBool, fourthSectionBool

let moveDistanceX = 0;
let moveDistanceY = -1.5;
let rotateAngleY = -(Math.PI / 4);
let rotateAngleX = 0;
let cameraZoom = 1;
// console.log(-(Math.PI / 4))

document.body.onscroll = function () {
    const t = document.body.getBoundingClientRect().top;
    firstSectionBreakBool = checkVisible(firstSectionBreak, 0, 'below')
    firstSectionBool = checkVisible(firstSection, 0, 'below')
    secondSectionBreakBool = checkVisible(secondSectionBreak, 0, 'below')
    secondSectionBool = checkVisible(secondSection, 0, 'below')
    thirdSectionBreakBool = checkVisible(thirdSectionBreak, 0, 'below')
    thirdSectionBool = checkVisible(thirdSection, 0, 'below')
    fourthSectionBreakBool = checkVisible(fourthSectionBreak, 0, 'below')
    fourthSectionBool = checkVisible(fourthSection, 0, 'below')


    if (model) {

        // console.log(moveDistanceX, moveDistanceY, rotateAngleY, cameraZoom)
        // console.log(firstSectionBreakBool, firstSectionBool, scrollDirection)
        // console.log(secondSectionBreakBool, secondSectionBool, scrollDirection)
        // console.log(thirdSectionBreakBool, thirdSectionBool, scrollDirection)

        if (t == 0) {
            moveDistanceX = 0;
            moveDistanceY = -1.5;
            rotateAngleY = -(Math.PI / 4);
            rotateAngleX = 0;
            cameraZoom = 1;
        }

        if (!fourthSectionBreakBool && !fourthSectionBool) {
            moveDistanceX = -0.4
            moveDistanceY = -2.5
            rotateAngleY = -1.3
            rotateAngleX = 0
            cameraZoom = 3
        } else if (!fourthSectionBreakBool && fourthSectionBool) {
            /**
             * moveDistanceX: 1 to -0.4
             * moveDistanceY: -0.85 to -2.5
             * rotateAngleY: -1.3 to -1.3
             * rotateAngleX: 1 to 0
             * cameraZoom: 7 to 3
            */
            if (scrollDirection === 'down') {
                moveDistanceX = Math.max(moveDistanceX - 0.1, -0.4);
                moveDistanceY = Math.max(moveDistanceY - 0.2, -2.5);
                rotateAngleX = Math.max(rotateAngleX - 0.1, 0);
                cameraZoom = Math.max(cameraZoom - 0.5, 3);
            } else if (scrollDirection === 'up') {
                moveDistanceX = Math.min(moveDistanceX + 0.1, 1);
                moveDistanceY = Math.min(moveDistanceY + 0.2, -0.85);
                rotateAngleX = Math.min(rotateAngleX + 0.1, 1);
                cameraZoom = Math.min(cameraZoom + 0.5, 7);
            }
        } else if (!thirdSectionBreakBool && !thirdSectionBool) {
            moveDistanceX = 1
            moveDistanceY = -0.85
            rotateAngleY = -1.3
            rotateAngleX = 1
            cameraZoom = 7
        } else if (!thirdSectionBreakBool && thirdSectionBool) {
            /**
             * moveDistanceX: -1.1 to 1
             * moveDistanceY: -1.5 to -0.85
             * rotateAngleY: 0 to -1.3
             * rotateAngleX: -0.3 to 1
             * cameraZoom: 4 to 7
            */
            if (scrollDirection === 'down') {
                moveDistanceX = Math.min(moveDistanceX + 0.2, 1);
                moveDistanceY = Math.min(moveDistanceY + 0.1, -0.85);
                rotateAngleY = Math.max(rotateAngleY - 0.1, -1.3);
                rotateAngleX = Math.min(rotateAngleX + 0.1, 1);
                cameraZoom = Math.min(cameraZoom + 0.2, 7);
            } else if (scrollDirection === 'up') {
                moveDistanceX = Math.max(moveDistanceX - 0.2, -1.1);
                moveDistanceY = Math.max(moveDistanceY - 0.1, -1.5);
                rotateAngleY = Math.min(rotateAngleY + 0.1, 0);
                rotateAngleX = Math.max(rotateAngleX - 0.1, -0.3);
                cameraZoom = Math.max(cameraZoom - 0.2, 4);
            }
        } else if (!secondSectionBreakBool && !secondSectionBool) {
            moveDistanceX = -1.1
            moveDistanceY = -1.5
            rotateAngleY = 0
            rotateAngleX = -0.3
            cameraZoom = 4
        } else if (!secondSectionBreakBool && secondSectionBool) {
            /**
             * moveDistanceX: 0.8 to -1.1
             * rotateAngleY: -1.4 to 0
             * cameraZoom: 3 to 4
             * rotateAngleX: 0 to -0.3
            */
            if (scrollDirection === 'down') {
                moveDistanceX = Math.max(moveDistanceX - 0.2, -1.1);
                rotateAngleY = Math.min(rotateAngleY + 0.1, 0);
                rotateAngleX = Math.max(rotateAngleX - 0.05, -0.3);
                cameraZoom = Math.min(cameraZoom + 0.2, 4);
            } else if (scrollDirection === 'up') {
                moveDistanceX = Math.min(moveDistanceX + 0.2, .8);
                rotateAngleY = Math.max(rotateAngleY - 0.1, -1.4);
                rotateAngleX = Math.min(rotateAngleX + 0.05, 0);
                cameraZoom = Math.max(cameraZoom - 0.2, 3);
            }
        } else if (!firstSectionBreakBool && !firstSectionBool) {
            moveDistanceX = 0.8
            rotateAngleY = -1.4
            cameraZoom = 3
        } else if (!firstSectionBreakBool && firstSectionBool) {
            /**
             * moveDistanceX: 0 to 0.8
             * rotateAngleY: -0.7 to -1.4
             * cameraZoom: 1 to 3
             */
            if (scrollDirection === 'down') {
                moveDistanceX = Math.min(moveDistanceX + 0.5, .8);
                rotateAngleY = Math.max(rotateAngleY - 0.1, -1.4);
                cameraZoom = Math.min(cameraZoom + 0.5, 3);
            } else if (scrollDirection === 'up') {
                moveDistanceX = Math.max(moveDistanceX - 0.5, 0);
                rotateAngleY = Math.min(rotateAngleY + 0.1, -(Math.PI / 4));
                cameraZoom = Math.max(cameraZoom - 0.5, 1);
            }
        }
    }
}

//Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

camera.position.x = 0
camera.position.y = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    // controls.update()

    if (model) {

        // const parallaxX = 0
        // const parallaxY = -0
        const parallaxX = cursor.x * 0.5
        // const parallaxY = cursor.y * 0.5
        model.rotation.y += (parallaxX - camera.position.y) * 1 * deltaTime
        // camera.position.x += (parallaxX - camera.position.x) * 5 * deltaTime
        // camera.position.y += (parallaxY - camera.position.y) * 5 * deltaTime

        model.position.x += (moveDistanceX - model.position.x) * 5 * deltaTime
        model.position.y += (moveDistanceY - model.position.y) * 5 * deltaTime
        camera.zoom += (cameraZoom - camera.zoom) * 5 * deltaTime
        model.rotation.y += (rotateAngleY - model.rotation.y) * 5 * deltaTime
        model.rotation.x += (rotateAngleX - model.rotation.x) * 5 * deltaTime
        camera.updateProjectionMatrix()
    }

    // Render
    renderer.render(scene, camera)

    monitorScreenTexture.needsUpdate = true

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()