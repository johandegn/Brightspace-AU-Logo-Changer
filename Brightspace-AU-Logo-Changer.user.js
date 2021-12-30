// ==UserScript==
// @name         Brightspace AU Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the Brightspace logo a little happier
// @author        
// @namespace    https://github.com/johandegn/Brightspace-AU-Logo-Changer
// @match        https://brightspace.au.dk/*
// @grant        none
// ==/UserScript==

var new_url = "https://raw.githubusercontent.com/johandegn/Brightspace-AU-Logo-Changer/main/smiley-logo-au.png";

function init() {
    document.getElementsByClassName("d2l-navigation-s-logo")[0].firstChild.shadowRoot.lastChild.firstChild.firstChild.src = new_url;
}
window.onload = init;
