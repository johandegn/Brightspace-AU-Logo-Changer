// ==UserScript==
// @name         Brightspace AU Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Make the Brightspace logo a little happier
// @namespace    https://github.com/johandegn/Brightspace-AU-Logo-Changer
// @match        https://brightspace.au.dk/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// ==/UserScript==

const og_logo = 'https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/780/view';
const og_home = 'https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/779/view';

const logo = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au.png';
const home = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-home-au.png';
const img_map = new Map();
img_map.set(og_logo, logo);
img_map.set(og_home, home);

const alt_logo = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au-alt.png';
const alt_home = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-home-au-alt.png';
const alt_img_map = new Map();
alt_img_map.set(og_logo, alt_logo);
alt_img_map.set(og_home, alt_home);

const fade_speed = 25;
let fade = true;
let fade_cmd_id = null;
let alt_img = false;
let alt_img_cmd_id = null;

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
    await updateFadeMenuCmd();
}

async function toggleAltImg() {
    alt_img = !alt_img;
    GM.setValue("alt_img", alt_img);
    await updateAltImgMenuCmd();
}

async function updateFadeMenuCmd() {
    if (fade_cmd_id !== null) {
        await GM.unregisterMenuCommand(fade_cmd_id);
    }
    fade_cmd_id = await GM.registerMenuCommand(fade ? "Disable Fade" : "Enable Fade", toggleFade, "");
}

async function updateAltImgMenuCmd() {
    if (alt_img_cmd_id !== null) {
        await GM.unregisterMenuCommand(alt_img_cmd_id);
    }
    alt_img_cmd_id = await GM.registerMenuCommand(alt_img ? "Use Default Image" : "Use Alternative Image", toggleAltImg, "");
}

(async function() {
    fade = await GM.getValue("fade", true);
    alt_img = await GM.getValue("alt_img", true);
    updateFadeMenuCmd();
    updateAltImgMenuCmd();
    while (document.readyState !== 'complete') {
        await sleep(25);
    }

    let imgs = document.getElementsByTagName('d2l-navigation-link-image');
    imgs[1].shadowRoot.children[0].children[1].firstChild.src = home;
    let img = imgs[0].shadowRoot.children[0].children[1].firstChild;
    let cur_src = img.currentSrc.split("?")[0];

    let new_src = alt_img ? alt_img_map.get(cur_src) : img_map.get(cur_src);
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
