console.log('<<<');

loadJavaScript('/vendor/jquery/jquery.min.js', function() {
    // Get config from background.js
    browser.runtime.sendMessage('getOptions', function(response){
        var s2 = document.createElement('script');
        options = response ? response : {};
        s2.text = 'var window.sw_config = ' + JSON.stringify(options) + ';';
        (document.head||document.documentElement).appendChild(s2);
        loadJavaScript('/data/js/common.js');

    });
});

loadJavaScript('js/photoswipe-init.js');

function loadJavaScript(js, callback) {
    var sv = document.createElement('script');
    sv.src = browser.extension.getURL(js);
    (document.head||document.documentElement).appendChild(sv);
    sv.onload = function() {
        sv.parentNode.removeChild(sv);
    };

    if (callback && typeof(callback) === "function") {
        callback();
    }
}
