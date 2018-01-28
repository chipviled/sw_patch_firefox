browser.runtime.sendMessage({name: 'getOptions'}, function(response){
    const s2 = document.createElement('script');
    let options = response ? response : {};
    s2.text = 'window.sw_config = ' + JSON.stringify(options) + ';';
    s2.async = false;
    document.body.appendChild(s2);

    const j = document.createElement('script');
    j.src = browser.extension.getURL('/vendor/jquery/jquery.min.js');
    j.async = false;
    document.body.appendChild(j);

    const ps = document.createElement('script');
    ps.src = browser.extension.getURL('/vendor/photoswipe/photoswipe.min.js');
    ps.async = false;
    document.body.appendChild(ps);

    const psi = document.createElement('script');
    psi.src = browser.extension.getURL('/data/js/photoswipe-init.js');
    psi.async = false;
    document.body.appendChild(psi);

    const c = document.createElement('script');
    c.src = browser.extension.getURL('/data/js/common.js');
    c.async = false;
    document.body.appendChild(c);

});
