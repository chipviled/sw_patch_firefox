document.body.style.border = "5px solid red";


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



//var page = pageMod.PageMod({
//    include: [ sity ],
//    //contentScript: 'var sw_config = ' + JSON.stringify(sw_config),
//    contentScriptFile: c_scripts,
//    contentScriptWhen: "ready",
//
//    onAttach: function(worker) {
//        page.port.on("get_sw_config", function() {
//            page.port.emit("take_get_sw_config", sw_config);
//        });
//    },
//
//    contentStyleFile: c_css,
//    contentStyleWhen: "ready"
//});

browser.tabs.executeScript(null, {
    file: "/data/js/common.js"
  });

var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});











