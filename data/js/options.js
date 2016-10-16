//
var version = "1.0.24";
var sw_config = {};
var commercial_warning = "Включая эту опцию вы поступаете вообще-то не очень хорошо.";


function notification(msg) {
    jQuery('#message').html(msg).stop().fadeIn("slow").delay(3000).fadeOut("slow");
}

function closeOptions() {
    self.port.emit("options_hide", null);
}

function loadCheckbox(id) {
    document.getElementById(id).checked = typeof window.sw_config[id] === null ? false : window.sw_config[id] == true;
}

function saveCheckbox(id) {
    window.sw_config[id] = document.getElementById(id).checked;
}

function loadText(id) {
    document.getElementById(id).value = typeof localStorage[id] === 'undefined' ? window.sw_config[id] : localStorage[id];
}

function saveText(id) {
    window.sw_config[id] = document.getElementById(id).value;
}



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
    loadCheckbox("forum_avards_ignore");
    loadCheckbox("forum_filter_status");

    loadCheckbox("custom_style");
    loadText("custom_style_text");
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
    saveCheckbox("forum_avards_ignore");
    saveCheckbox("forum_filter_status");

    saveCheckbox("custom_style");
    saveText("custom_style_text");

    self.port.emit("set_sw_config", sw_config);

    notification('Данные сохранены');
}

// Show commercial warning
function commercialWarning(disable_commercial) {
    if (disable_commercial == true) jQuery("#disable_commercial_warning").text(commercial_warning).show();

    jQuery("#disable_commercial").change(function() {
        if (jQuery(this).prop('checked')) {
            jQuery("#disable_commercial_warning").text(commercial_warning).stop().fadeIn();
        } else {
            jQuery("#disable_commercial_warning").stop().fadeOut();
        }
    });
}


// Get config
self.port.on("take_get_sw_config", function(conf) {
    sw_config = conf;
    loadOptions();
    commercialWarning(conf["disable_commercial"]);
});


document.addEventListener('DOMContentLoaded', function () {
    jQuery("#version").html('v ' + version);
    jQuery(".save").click(saveOptions);
    jQuery(".close").click(closeOptions);

    self.port.emit("get_sw_config", null);
});
