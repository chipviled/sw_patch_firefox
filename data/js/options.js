//
var sw_config = {};


function notification(msg) {
    jQuery('#message').html(msg).stop().fadeIn("slow").delay(3000).fadeOut("slow");
}

function closeOptions() {
    self.port.emit("options_hide", null);
}

function loadCheckbox(id) {
    document.getElementById(id).checked = typeof window.sw_config[id] == null ? false : window.sw_config[id] == true;
}

function saveCheckbox(id) {
    window.sw_config[id] = document.getElementById(id).checked;
}

// function loadText(id) {
//     document.getElementById(id).value = localStorage[id];
// }
//
// function saveText(id) {
//     localStorage[id] = document.getElementById(id).value;
// }



function loadOptions() {
    loadCheckbox("look_for_chyatik");
    loadCheckbox("play_beep");
    loadCheckbox("disable_commercial");
    loadCheckbox("change_layout");
    loadCheckbox("change_shadowbox");
    loadCheckbox("gallery_avatars");
    loadCheckbox("gallery_ignor_smiles");
    loadCheckbox("gallery_fix_cat_1");
    loadCheckbox("gallery_filmstrip_hide_line");
    loadCheckbox("correct_url");
    loadCheckbox("alternative_menu");
    loadCheckbox("forum_right_to_left");
    loadCheckbox("enable_photoswipe");
    loadCheckbox("forum_reputation_ignore");
}

function saveOptions() {
    saveCheckbox("look_for_chyatik");
    saveCheckbox("play_beep");
    saveCheckbox("disable_commercial");
    saveCheckbox("change_layout");
    saveCheckbox("change_shadowbox");
    saveCheckbox("gallery_avatars");
    saveCheckbox("gallery_ignor_smiles");
    saveCheckbox("gallery_fix_cat_1");
    saveCheckbox("gallery_filmstrip_hide_line");
    saveCheckbox("correct_url");
    saveCheckbox("alternative_menu");
    saveCheckbox("forum_right_to_left");
    saveCheckbox("enable_photoswipe");
    saveCheckbox("forum_reputation_ignore");

    self.port.emit("set_sw_config", sw_config);

    notification('Данные сохранены');
}


// Get version from manifest.
var version = (function () {
    return " 1.0.17.3 <br />(firefox unstable)";
}() );


// Get config
self.port.on("take_get_sw_config", function(conf) {
    sw_config = conf;
    loadOptions();
});


document.addEventListener('DOMContentLoaded', function () {
    jQuery("#version").html('v' + version);
    jQuery(".save").click(saveOptions);
    jQuery(".close").click(closeOptions);

    self.port.emit("get_sw_config", null);
});

