browser.runtime.sendMessage({name: 'getOptions'}, function(response){
    const s2 = document.createElement('script');
    let options = response ? response : {};
    s2.text = 'window.sw_config = ' + JSON.stringify(options) + ';';
    document.body.appendChild(s2);

    const j = document.createElement('script');
    j.src = browser.extension.getURL('/vendor/jquery/jquery.min.js');
    document.body.appendChild(j);

    const ps = document.createElement('script');
    ps.src = browser.extension.getURL('/vendor/photoswipe/photoswipe.min.js');
    document.body.appendChild(ps);

    const psu = document.createElement('script');
    psu.src = browser.extension.getURL('/vendor/photoswipe/photoswipe-ui-default.min.js');
    document.body.appendChild(psu);

    const psi = document.createElement('script');
    psi.src = browser.extension.getURL('/data/js/photoswipe-init.js');
    document.body.appendChild(psi);

    const c = document.createElement('script');
    c.src = browser.extension.getURL('/data/js/common.js');
    document.body.appendChild(c);

});
