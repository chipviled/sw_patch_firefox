
function loadJavaScript(js, callback) {
    let sv = document.createElement('script');
    sv.src = browser.extension.getURL(js);
    (document.head||document.documentElement).appendChild(sv);
    sv.onload = function() {
        sv.parentNode.removeChild(sv);
    };
    if (callback && typeof(callback) === "function") {
        callback();
    }
}

browser.runtime.sendMessage({name: 'getOptions'}, function(response){
    let s2 = document.createElement('script');
    let options = response ? response : {};
    s2.text = 'window.sw_config = ' + JSON.stringify(options) + ';';
    (document.head||document.documentElement).appendChild(s2);
    loadJavaScript('/vendor/jquery/jquery.min.js',
        loadJavaScript('/data/js/Patch.js',
            loadJavaScript('/data/js/common.js')
        )
    );

});


loadJavaScript('/vendor/photoswipe/photoswipe.min.js',
    loadJavaScript('/data/js/photoswipe-init.js')
);
