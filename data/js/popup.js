document.addEventListener("DOMContentLoaded", function () {
    backGround = browser.extension.getBackgroundPage();
    backGround.updateIconClear();

    jQuery("#popup_options").click(function() { openTab(browser.extension.getURL('html/options.html')); });
    jQuery("#popup_close").click(function() { window.close(); });

    if (localStorage['look_for_chyatik'] == 'true') {
        jQuery("#popup_chatik_link").text('Ñ‡ÑÑ‚Ð¸Ðº').click(function() { openTab('http://sonic-world.ru/modules/chatik/chatik.php') });
    }
});

function openTab(url) {
    browser.tabs.create({url: url});
    window.close();
}
