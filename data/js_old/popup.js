var sw_config = {};
var chatik_name = "чятик";

// When loaded
document.addEventListener("DOMContentLoaded", function () {
    jQuery("#popup_options").off("click").click(function() {
        self.port.emit("options_show", null);
        self.port.emit("popup_hide", null);
    });

    jQuery("#popup_close").off("click").click(function() {
        self.port.emit("popup_hide", null);
    });

    self.port.emit("get_sw_config", null);
});

// Get config
self.port.on("take_get_sw_config", function(conf) {
    sw_config = conf;

    if (sw_config.look_for_chyatik == true) {
        jQuery("#popup_chatik_link").text(chatik_name).off("click").click(function() {
            self.port.emit("open_chatik", null);
        });
    } else {
        jQuery("#popup_chatik_link").text('').off("click");
    }
});
