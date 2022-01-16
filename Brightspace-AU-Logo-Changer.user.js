// ==UserScript==
// @name         Brightspace AU Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Make the Brightspace logo a little happier
// @namespace    https://github.com/johandegn/Brightspace-AU-Logo-Changer
// @match        https://brightspace.au.dk/*
// @grant        none
// ==/UserScript==

const logo = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au.png';
const home = 'https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-home-au.png';
const img_map = new Map();
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/780/view', logo);
img_map.set('https://brightspace.au.dk/d2l/lp/navbars/6606/theme/viewimage/779/view', home);

function init() {
    let img = document.getElementsByClassName("d2l-navigation-s-logo")[0].firstChild.shadowRoot.lastChild.firstChild.firstChild;
    if (img.src === undefined) {
        return;
    }
    let cur_src = img.src.split("?")[0];
    let new_src = img_map.get(cur_src);
    if (new_src !== undefined) {
        img.src = new_src;
    }
}
window.onload = init;
