document.addEventListener("DOMContentLoaded", function () {
    backGround = browser.extension.getBackgroundPage();
    backGround.updateIconClear();

    document.getElementById('popup_options').onclick = () => {
        openTab(browser.extension.getURL('/data/html/options.html'));
    }

    document.getElementById('popup_close').onclick = () => {
        window.close();
    }
    let sw_config = {};

    browser.runtime.sendMessage({name: 'getOptions'}, function(response){
        sw_config = response;
        if (sw_config['look_for_chyatik'] === true) {
            document.getElementById('popup_chatik_link').textContent = 'чятик';
            document.getElementById('popup_chatik_link').onclick = () => {
                openTab('http://sonic-world.ru/modules/chatik/chatik.php');
            }
        }
    });


});

function openTab(url) {
    browser.tabs.create({url: url});
    window.close();
}
