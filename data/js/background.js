

window.sw_config = {
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
    for (var key in window.sw_config) {
        tmp = window.sw_config[key]
        window.sw_config[key] = typeof localStorage[key] == "undefined" ? window.sw_config[key] : localStorage[key];
        if (window.sw_config[key] == 'true') window.sw_config[key] = true;
        if (window.sw_config[key] == 'false') window.sw_config[key] = false;
    }
}

function setConfig() {
    for (var key in window.sw_config) {
        localStorage[key] = window.sw_config[key];
    }
}

function beep() {
    var snd = new Audio('/data/wav/beep.wav');
    snd.play();
}



class Chyatick {

    constructor() {
        this.sw_lolresponse = {
            lastid: 0,
            min_dlayamount: 3000,
            max_dlayamount: 30000,
            delta_dlayamount: 1.3,
            dlayamount: 3000,
            not_first: false,
            number_beeps: 0
        }
        this.httpRequest = new XMLHttpRequest();
        this.url = 'http://sonic-world.ru/modules/chatik/chatik.php?chan=main';
        this.getSw();
    }

    lolresponse(response, status) {
        var m = response.match(/wohoo(\d+) (\d+)/);
        if (m !== null) {
            var new_start = m[1] || 0;
            var new_end = m[2] || 0;
            if (this.sw_lolresponse.lastid < new_end) {
                this.sw_lolresponse.lastid = new_end;
                this.sw_lolresponse.dlayamount = this.sw_lolresponse.min_dlayamount;
                if (this.sw_lolresponse.not_first) this.sw_lolresponse.number_beeps += 1;
                if((window.sw_config.play_beep) && (window.sw_lolresponse.not_first)) {
                    beep();
                }
                if (!this.sw_lolresponse.not_first) this.sw_lolresponse.not_first = true;
            }
        }

        var nb = '';
        if (this.sw_lolresponse.number_beeps > 0) {
            nb = this.sw_lolresponse.number_beeps.toString();
        }
        //button.badge = nb;
        console.log('>>> ', nb);

        if (this.sw_lolresponse.dlayamount < this.sw_lolresponse.max_dlayamount) {
            this.sw_lolresponse.dlayamount = this.sw_lolresponse.dlayamount * this.sw_lolresponse.delta_dlayamount;
        } else {
            this.sw_lolresponse.dlayamount = this.sw_lolresponse.max_dlayamount;
        }

        setTimeout(this.getSw, this.sw_lolresponse.dlayamount + 500);
    }


    getSw() {
        if (window.sw_config.look_for_chyatik) {
            var params = "ajax=1&lastid=" + this.sw_lolresponse.lastid;
            this.httpRequest.onreadystatechange = this.answerSw;
            this.httpRequest.open('POST', this.url, true);
            this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.httpRequest.setRequestHeader("Connection", "close");
            this.httpRequest.setRequestHeader("Content-length", params.length);
            this.httpRequest.send(params);
        } else {
            // Not work, just sleep.
            setTimeout(this.getSw, this.sw_lolresponse.max_dlayamount);
        }
    }


    answerSw() {
        if (this.httpRequest.readyState === 4) {
            if (this.httpRequest.status === 200) {
                // All OK.
                this.lolresponse(httpRequest.responseText);
            } else {
                // Some error (like 404).
                setTimeout(this.getSw, this.sw_lolresponse.max_dlayamount);
            }
        }
    }
}

window.sw_chyatick_watcher = new Chyatick();

