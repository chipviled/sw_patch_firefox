// Deprecated
//const {Cc,Ci} = require("chrome");

const {XMLHttpRequest} = require("sdk/net/xhr");

//var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var { setTimeout } = require("sdk/timers");
var localStorage = require("sdk/simple-storage").storage;
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var worker = require("sdk/page-worker");
var url = require("sdk/url");

var sity = "*.sonic-world.ru";
var url_chatik = "http://sonic-world.ru/modules/chatik/chatik.php?chan=main";

var c_scripts = [data.url("../vendor/photoswipe/photoswipe.min.js"),
                 data.url("../vendor/photoswipe/photoswipe-ui-default.min.js"),
                 data.url("../vendor/jquery/jquery.min.js"),
                 data.url("js/photoswipe-init.js"),
                 data.url("js/common.js")
];

var c_css = [data.url("../vendor/photoswipe/photoswipe.css"),
             data.url("../vendor/photoswipe/default-skin/default-skin.css"),
             data.url("css/add.css")
];

var sw_config = {                // default config;
    look_for_chyatik: false,
    play_beep: false,
    disable_commercial: false,
    change_layout: true,
    change_shadowbox: true,
    gallery_avatars: true,
    gallery_ignor_smiles: false,
    gallery_fix_cat_1: true,
    gallery_filmstrip_hide_line: false,
    correct_url: true,
    alternative_menu: true,
    enable_photoswipe: false,
    forum_right_to_left: false,
    forum_reputation_ignore: false,
    forum_avards_ignore: false,
    forum_filter_status: false,
    forum_multiquote_in_closed_themes: false,
    custom_style: false,
    custom_style_text: '/* Demo */ \na { color: #FF0000 !important; }'
};

getConfig();
setConfig();



//*****************************************************************************

var page = pageMod.PageMod({
    include: [ sity ],
    //contentScript: 'var sw_config = ' + JSON.stringify(sw_config),
    contentScriptFile: c_scripts,
    contentScriptWhen: "ready",

    onAttach: function(worker) {
        page.port.on("get_sw_config", function() {
            page.port.emit("take_get_sw_config", sw_config);
        });
    },

    contentStyleFile: c_css,
    contentStyleWhen: "ready"
});


var button = ToggleButton({
    id: "sw_patch_f",
    label: "SW patch",
    icon: {
        "16": "./img/16x16.png",
        "32": "./img/32x32.png",
        "48": "./img/48x48.png"
    },
    onClick: handleClick,
    badge: '',
    badgeColor: "#CC0000",
    onChange: handleChange
});

function handleClick(state) {
    sw_lolresponse.number_beeps = 0;
    button.badge = '';
}

//*****************************************************************************

var popup = panels.Panel({
    contentURL: self.data.url("html/popup.html"),
    contentScriptFile: [data.url("../vendor/jquery/jquery.min.js"),
                        data.url("js/popup.js")],
    contentScriptWhen: "start",
    onHide: handleHide,
    width: 220,
    height: 120
});

function handleChange(state) {
  if (state.checked) {
        popup.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

popup.port.on("popup_hide", function() {
    popup.hide();
});

popup.port.on("get_sw_config", function() {
    popup.port.emit("take_get_sw_config", sw_config);
});

popup.port.on("open_chatik", function() {
    tabs.open(url_chatik);
    popup.hide();
});

//*****************************************************************************

var options = panels.Panel({
    contentURL: self.data.url("html/options.html"),
    contentScriptFile: [data.url("../vendor/jquery/jquery.min.js"),
                        data.url("js/options.js")],
    contentScriptWhen: "start",
    width: 360,
    height: 480,
    position: button
});

popup.port.on("options_show", function() {
    options.show();
});

options.port.on("options_hide", function() {
    options.hide();
});

options.port.on("get_sw_config", function() {
    options.port.emit("take_get_sw_config", sw_config);
});

options.port.on("set_sw_config", function(conf) {
    sw_config = conf;
    options.port.emit("take_get_sw_config", conf);
    //page.port.emit("take_get_sw_config", conf);
    popup.port.emit("take_get_sw_config", conf);
    setConfig();
});


//*****************************************************************************


function getConfig() {
    var tmp;
    for (var key in sw_config) {
        tmp = sw_config[key]
        sw_config[key] = typeof localStorage[key] == "undefined" ? sw_config[key] : localStorage[key];
        if (sw_config[key] == 'true') sw_config[key] = true;
        if (sw_config[key] == 'false') sw_config[key] = false;
    }
}


function setConfig() {
    for (var key in sw_config) {
        localStorage[key] = sw_config[key];
    }
}

// Deprecated
//function beep(path) {
//    var sound = Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound);
//    var uri = Cc["@mozilla.org/network/io-service;1"]
//            .getService(Ci.nsIIOService)
//            .newURI(data.url('wav/beep.wav'), null, null);
//    sound.play(uri);
//}

//-----------------------------

var beepPage = worker.Page({
    contentURL: data.url("html/empty.html"),
    contentScriptFile: data.url("js/beep.js"),
    contentScriptWhen: "ready"
});


function beep() {
    beepPage.port.emit("play_beep", null);
}


//*****************************************************************************
//  Looking for Chatik

var sw_lolresponse = {
    lastid: 0,
    min_dlayamount: 3000,
    max_dlayamount: 30000,
    delta_dlayamount: 1.3,
    dlayamount: 3000,
    not_first: false,
    number_beeps: 0
}


function lolresponse(response, status) {

    var m = response.match(/wohoo(\d+) (\d+)/);

    //console.log(response, m);

    if (m !== null) {

        var new_start = m[1];
        var new_end = m[2];

        if (sw_lolresponse.lastid < new_end) {
            sw_lolresponse.lastid = new_end;

            sw_lolresponse.dlayamount = sw_lolresponse.min_dlayamount;

            if (sw_lolresponse.not_first) sw_lolresponse.number_beeps += 1;

            if((sw_config.play_beep) && (sw_lolresponse.not_first)) {
                beep();
            }

            if (!sw_lolresponse.not_first) sw_lolresponse.not_first = true;
        }
    }

    var nb = '';
    if (sw_lolresponse.number_beeps > 0) nb = sw_lolresponse.number_beeps.toString();
    button.badge = nb;

    if (sw_lolresponse.dlayamount < sw_lolresponse.max_dlayamount) {
        sw_lolresponse.dlayamount = sw_lolresponse.dlayamount * sw_lolresponse.delta_dlayamount;
    } else {
        sw_lolresponse.dlayamount = sw_lolresponse.max_dlayamount;
    }

    setTimeout(getSw, sw_lolresponse.dlayamount + 500);
}



//
var httpRequest = new XMLHttpRequest();

function getSw(){
    if (sw_config.look_for_chyatik) {
        var url = 'http://sonic-world.ru/modules/chatik/chatik.php?chan=main';
        var params = "ajax=1&lastid=" + sw_lolresponse.lastid;

        httpRequest.onreadystatechange = answerSw;
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpRequest.setRequestHeader("Connection", "close");
        httpRequest.setRequestHeader("Content-length", params.length);

        httpRequest.send(params);
    } else {
        // Not work.
        setTimeout(getSw, sw_lolresponse.max_dlayamount);
    }
}


function answerSw() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            // All OK.
            lolresponse(httpRequest.responseText);
        } else {
            // Some error (like 404).
            setTimeout(getSw, sw_lolresponse.max_dlayamount);
        }
    }
}

getSw();
