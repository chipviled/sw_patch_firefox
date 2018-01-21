console.log('<<<');

loadJavaScript('/vendor/jquery/jquery.min.js', function() {
    // Get config from background.js
    console.log('<<< 2');
    browser.runtime.sendMessage('getOptions', function(response){
        console.log('<<< 3', response);
        var s2 = document.createElement('script');
        options = response ? response : {};
        s2.text = 'var window.sw_config = ' + JSON.stringify(options) + ';';
        (document.head||document.documentElement).appendChild(s2);
        loadJavaScript('/data/js/common.js');
        console.log('<<< 5');

    });
});

loadJavaScript('/vendor/phoposwipe/photoswipe.min.js',
    loadJavaScript('/data/js/photoswipe-init.js')
);

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
