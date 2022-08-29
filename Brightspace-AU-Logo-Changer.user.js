// ==UserScript==
// @name         Brightspace AU Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Make the Brightspace logo a little happier
// @namespace    https://github.com/johandegn/Brightspace-AU-Logo-Changer
// @match        https://brightspace.au.dk/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// ==/UserScript==

const logo = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au.png';
const home = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-home-au.png';
const img_map = new Map();
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/780/view', logo);
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/779/view', home);

const fade_speed = 25;
let fade = true;
let cmdId = null;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fadeIn(elm) {
    let op = elm.style.opacity = 0;
    while(op < 1) {
        await sleep(fade_speed);
        op += 0.15;
        elm.style.opacity = op;
    }
    elm.style.opacity = 1;
}

async function fadeOut(elm) {
    let op = elm.style.opacity = 1;
    while(op > 0) {
        await sleep(fade_speed);
        op -= 0.15;
        elm.style.opacity = op;
    }
    elm.style.opacity = 0;
}

async function toggleFade() {
    fade = !fade;
    GM.setValue("fade", fade);
    await updateMenuCmd();
}

async function updateMenuCmd() {
    if (cmdId !== null) {
        GM.unregisterMenuCommand(cmdId);
    }
    cmdId = await GM.registerMenuCommand(fade ? "Disable Fade" : "Enable Fade", toggleFade, "");
}

(async function() {
    fade = await GM.getValue("fade", true);
    updateMenuCmd();
    while (document.readyState !== 'complete') {
        await sleep(25);
    }

    let img = document.getElementsByTagName('d2l-navigation-link-image')[0].shadowRoot.children[0].children[1].firstChild;
    let cur_src = img.currentSrc.split("?")[0];

    let new_src = img_map.get(cur_src);
    if (new_src === undefined) {
        console.log('Could not find matching image');
        return;
    }

    if (fade) {
        await fadeOut(img);
        img.addEventListener('load', async function () {
            await fadeIn(img);
        });
    }
    img.src = new_src;
})();
