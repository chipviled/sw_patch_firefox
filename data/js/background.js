sw_config = {
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

function getConfig() {
    var tmp;
    console.log('<<<', localStorage);
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

function beep() {
    var snd = new Audio('/data/wav/beep.wav');
    snd.play();
}


var sw_lolresponse = {
    lastid: 0,
    min_dlayamount: 3000,
    max_dlayamount: 30000,
    delta_dlayamount: 1.3,
    dlayamount: 3000,
    not_first: false,
    number_beeps: 0
}
var httpRequest = new XMLHttpRequest();


function lolresponse(response, status) {

    var m = response.match(/wohoo(\d+) (\d+)/);

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
    browser.browserAction.setBadgeText ( { text: nb } );

    if (sw_lolresponse.dlayamount < sw_lolresponse.max_dlayamount) {
        sw_lolresponse.dlayamount = sw_lolresponse.dlayamount * sw_lolresponse.delta_dlayamount;
    } else {
        sw_lolresponse.dlayamount = sw_lolresponse.max_dlayamount;
    }

    setTimeout(getSw, sw_lolresponse.dlayamount + 500);
}


function getSw(){
    if (sw_config.look_for_chyatik) {
        //console.log('>>>', sw_config);

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



//*****************************************************************************
//External functions

function updateIconClear() {
    sw_lolresponse.number_beeps = 0;
    browser.browserAction.setBadgeText({
        text: ''
    });
}

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    if (msg.name == 'getOptions'){
         response = sw_config;
         sendResponse(response);
         return;
    }

    if (msg.name == 'setOptions'){
         sw_config = msg.data;
         sendResponse(null);
         return;
    }
});
