// ==UserScript==
// @name         Brightspace AU Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Make the Brightspace logo a little happier
// @namespace    https://github.com/johandegn/Brightspace-AU-Logo-Changer
// @match        https://brightspace.au.dk/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

const logo = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au.png';
const home = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-home-au.png';
const img_map = new Map();
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/780/view', logo);
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/779/view', home);

const fade_speed = 25;
const fade = true; // Change manually

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

async function init() {
    let img = document.getElementsByClassName('d2l-navigation-s-logo')[0].firstChild.shadowRoot.lastChild.firstChild.firstChild;
    if (img.src === undefined) {
        return;
    }
    let cur_src = img.src.split("?")[0];
    let new_src = img_map.get(cur_src);
    if (new_src === undefined) {
        return;
    }
    if (fade) {
        await fadeOut(img);
        img.addEventListener('load', async function () {
            await fadeIn(img);
        });
    }
    img.src = new_src;
}
init();
