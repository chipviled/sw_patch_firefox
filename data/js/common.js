/*
 *
 */

// jQuery no conflict.
jQuery.noConflict();


// Get param from url.
function getUrlParameter(sUrl, sParam) {
    if (sUrl == undefined) return 0;
    var sPageURL = sUrl.split('?')[1];
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

// Get param from url [special e107].
function getE107UrlParameter(sUrl, sParam) {
    if (sUrl == undefined) return 0;
    var sPageURL = sUrl.split('?')[1];
    var sURLVariables = sPageURL.split('.');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        if (sURLVariables[i] == sParam)
        {
            return sURLVariables[i+1] || 0;
        }
    }
}

// Add avatar for gallery user.
function getGalleryAvatarPict(uid) {
    if (uid == undefined) return false;
    jQuery.ajax({
        url:'http://sonic-world.ru/files/public/avatars/av'+ uid +'.jpg',
        type:'HEAD',
        error:
            function(){
                jQuery.ajax({
                url:'http://sonic-world.ru/files/public/avatars/av'+ uid +'.png',
                type:'HEAD',
                error:
                    function(){
                        jQuery.ajax({
                        url:'http://sonic-world.ru/files/public/avatars/av'+ uid +'.gif',
                        type:'HEAD',
                        error:
                            function(){
                                jQuery('.sw_gallery_avatar_'+ uid)
                                    .css('background-color', '#E0E0E0');
                            },
                        success:
                            function(){
                                jQuery('.sw_gallery_avatar_'+ uid)
                                    .css('background-image', 'url(../files/public/avatars/av'+ uid +'.gif)');
                            }
                        });
                    },
                success:
                    function(){
                        jQuery('.sw_gallery_avatar_'+ uid)
                            .css('background-image', 'url(../files/public/avatars/av'+ uid +'.png)');
                    }
                });
            },
        success:
            function(){
                jQuery('.sw_gallery_avatar_'+ uid)
                .css('background-image', 'url(../files/public/avatars/av'+ uid +'.jpg)');
            }
    });
}


// Get status page.
function getStatusPages(ul, rol, limit, recursion) {

    var limit_recursion = 3;

    if (recursion === null || recursion === undefined) {
        recursion = 1;
    }
    var bard = null;
    var st = '';

    if (rol !== null && rol !== 0) {
        st = '?st=' + (rol * 15);
    }

    jQuery.ajax({
        url:'http://sonic-world.ru/forum/statuses/all/' + st,
        type:'GET',
//        error:
//            function(){
//                consola.log('ERROR');
//            },
        success:
            function(data, textStatus, jqXHR){
                bard = limit - setFiltredStatus(ul, data, limit);
                recursion++;
                if (bard > 0 && recursion <= limit_recursion){
                    getStatusPages(ul, rol+1, bard, recursion)
                } else if (bard === limit) {
                    ul.append(jQuery('<li><span>Пусто</span></li>'));
                }
            }
        });
    return 0;
}


// Filtring and insert statuses.
function setFiltredStatus(ul, data, limit) {
    var stats_lists = jQuery(data).find('#status_wrapper > .ipsBox_container');
    var li = null;
    var liw = null;
    var stats_rel = 0;
    var message = '';

    stats_lists.each(function (){
        li = jQuery(jQuery(this).html());
        message = li.find('.status_status').html();

        if (stats_rel < limit && /topic.\d+.*?(конкурс|голос|дуэл)/.test(message)) {

            li.find('ul.ipsList_withtinyphoto').remove();
            li.find('.status_feedback').remove();

            li.find('.ipsUserPhoto_medium')
                .removeClass('ipsUserPhoto_medium')
                .addClass('ipsUserPhoto_mini');

            liw = jQuery('<li class="clearfix"></li>');
            liw.wrapInner(li);

            liw.find('.ipsBox_withphoto')
                .removeClass('status_content')
                .removeClass('ipsBox_withphoto')
                .addClass('list_content');

            ul.append(liw);
            stats_rel++;
        }
    });

    return stats_rel;
}


//*****************************************************************************

// Main patch run
function swPatchRun(sw_config) {

    // Add fxied layout and background color.
    if (sw_config.change_layout  && (document.location.pathname != '') ) {
        jQuery("body").addClass("body").addClass("wrap");

        var $wrap = jQuery("#wrap");
        $wrap.prepend("<div id='wrap_content'></div>");

        var $wrap_content = jQuery("#wrap_content");
        $wrap_content.append( jQuery("#sw_c1") );
        $wrap_content.append( jQuery("#sw_c3") );
        $wrap_content.append( jQuery("#sw_c2") );
        $wrap_content.append( jQuery("#sw_f") );
        $wrap.prepend( jQuery("#toplogo") );

        $wrap.addClass("wrap");

        jQuery("#sw_c1").addClass("sw_top");
        jQuery("#sw_c3").addClass("sw_top");
    }


    // Correct some problam on Shadowbox.
    if ( sw_config.change_shadowbox && (document.location.pathname != '') ) {
        var loading_gif = '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';
        jQuery("a[rel*='shadowbox'] img").addClass("shadowbox_add");
        jQuery('body').append('<style>#sb-body,#sb-loading{background-color: #FFFFFF !important;}</style>');
        jQuery('body').append('<style>\
        #sb-loading-inner span{background:url(data:image/gif;base64,'+loading_gif+') no-repeat;}\
        #sb-loading-inner{position:absolute;font-size:14px;line-height:34px;height:34px;top:50%;margin-top:-17px;width:100%;text-align:center;}\
        </style>');
        //console.log(/\/forum\//.test(document.location.pathname), '"'+document.location.pathname+'"');
    }


    // Hide _some_ commercial banners.
    if (sw_config.disable_commercial) {
        jQuery(".slza").hide();
        jQuery("#swz1, #swz2").hide();
        jQuery("#sw_f div").first().hide();
        jQuery("#board_statistics").next().hide();
        jQuery(".c410d1").hide();                       // New testing commercial banner.
        jQuery("#swz1").parent("th").hide();            // Banner after first line in forum.
    }


    // Hide forum reputation.
    if ( sw_config.forum_reputation_ignore && (/\/\/sonic-world\.ru\/forum/.test(document.location.href))  ) {
        jQuery(".reputation, .rep_bar").hide();
        jQuery('[data-tabid="reputation"]').hide();
    }


    // Hide forum avards.
    if ( sw_config.forum_avards_ignore && (/\/\/sonic-world\.ru\/forum/.test(document.location.href))  ) {
        jQuery(".author_info").find('fieldset').hide();
        jQuery('[data-tabid="awards"]').hide();
    }


    // Hide filmstripper black lines.
    if ( sw_config.gallery_filmstrip_hide_line && (/\/gallery\/displayimage.php/.test(document.location.pathname)) ) {
        jQuery('#filmstrip').children('table').children('tbody').children('tr:nth-child(2n-1)').hide();
    }


    // Add some images to main link gallery.
    if ( sw_config.gallery_fix_cat_1
        && ( (/\/gallery\/$/.test(document.location.pathname)) || (/\/gallery\/index.php$/.test(document.location.pathname)) )
    ) {
        var tmp = '\
<div class="image" style="display:inline-block;">\
<img src="albums/userpics/12670/picthumb_onya.png" class="" width="93" height="100" border="0" alt="">\
<img src="albums/userpics/27370/picthumb_img_1225.jpg" class="" width="68" height="100" border="0" alt="">\
<img src="albums/userpics/10441/picthumb_irma_th.jpg" class="" width="92" height="100" border="0" alt="">\
<img src="albums/userpics/10594/picthumb_linjkatejlza.jpg" class="" width="99" height="100" border="0" alt="">\
</div><br />\
';
        jQuery('span.catlink').first().css('text-align','center').find('a[href="index.php?cat=1"]').prepend(tmp);
    }


    // Disable image smiles in gallery.
    if ( sw_config.gallery_ignor_smiles && (/\/gallery\//.test(document.location.pathname)) ) {
        jQuery("img[alt^='Laughing']").replaceWith(" <b>lol</b> ");
        jQuery("img[alt^='Razz']").replaceWith(" <b>:-P</b> ");
        jQuery("img[alt^='Very Happy']").replaceWith(" <b>:-D</b> ");
        jQuery("img[alt^='Smile']").replaceWith(" <b>:-)</b> ");
        jQuery("img[alt^='Neutral']").replaceWith(" <b>:-|</b> ");
        jQuery("img[alt^='Sad']").replaceWith(" <b>:-(</b> ");
        jQuery("img[alt^='Crying or Very sad']").replaceWith(" <b>:cry:</b> ");
        jQuery("img[alt^='Cool']").replaceWith(" <b>8-)</b> ");
        jQuery("img[alt^='Surprised']").replaceWith(" <b>:-o</b> ");
        jQuery("img[alt^='Confused']").replaceWith(" <b>:-?</b> ");
        jQuery("img[alt^='Embarrassed']").replaceWith(" <b>:oops:</b> ");
        jQuery("img[alt^='Shocked']").replaceWith(" <b>:shock:</b> ");
        jQuery("img[alt^='Mad']").replaceWith(" <b>:-x</b> ");
        jQuery("img[alt^='Rolling Eyes']").replaceWith(" <b>:roll:</b> ");
        jQuery("img[alt^='Wink']").replaceWith(" <b>;-)</b> ");
        jQuery("img[alt^='Idea']").replaceWith(" <b>:idea:</b> ");
        jQuery("img[alt^='Exclamation']").replaceWith(" <b>:!:</b> ");
        jQuery("img[alt^='Question']").replaceWith(" <b>:?:</b> ");
    }


    // Add user avatars in gallery.
    if ( sw_config.gallery_avatars && (/\/gallery\/displayimage.php/.test(document.location.pathname)) ) {
        jQuery('#comments').children('table').each(function() {
                    var text = jQuery(this).find('a').first().attr("href");
                    if (getUrlParameter(text,'uid') != undefined) {
                        jQuery(this).wrap('<div class="sw_gallery_comment"><div class="sw_gallery_comment_text"></div></div>');
                    }
                });

        jQuery('.sw_gallery_comment').each(function() {
            var text = jQuery(this).find('a').first().attr("href");
            var uid = getUrlParameter(text,'uid');

            if (uid != undefined) {
                var text_swga =
                      '<a href="../user.php?id.'+uid+'">'
                    + '   <div class="sw_gallery_avatar sw_gallery_avatar_'+uid+'"></div>'
                    + '</a>';
                if (uid != 0) {
                    jQuery(this).prepend(text_swga);
                    getGalleryAvatarPict(uid);
                } else {
                    jQuery(this).prepend(text_swga);
                }
            }
        });

    }


    // Correct some bad url.
    if ( sw_config.correct_url ) {
        // Correct url for edit comments in user profile.
        if ( /\/user\.php\?/.test(document.location.href) ) {
            var sw_user_id = getE107UrlParameter(document.location.href, 'id');
            var sw_edit_id = 0;
            jQuery('a[href*="/comment.php?.edit."]').each(function() {
                sw_edit_id = getE107UrlParameter(jQuery(this).attr('href'), 'edit');
                jQuery(this).attr('href','/comment.php?comment.user.'+sw_user_id+'.edit.'+sw_edit_id);
            });
        }

        // Correct url in bottom chatik (to mobile version).
        if ( /\/modules\/chatik\/chatik\.php/.test(document.location.pathname) ) {
            jQuery('a[href*="/modules/chatik/chatik.php??"]').each(function() {
                jQuery(this).attr('href', jQuery(this).attr('href').replace(/\?+/g, '?') );
            });
        }
    }


    // Add alternative menu in top.
    if ( (sw_config.alternative_menu) && (/\/\/sonic-world\.ru/.test(document.location.href)) &&
            !(  // Without mobile version chatik.
                ( /\/modules\/chatik\/chatik\.php/.test(document.location.href) )
                && ( /mobile=1/.test(document.location.href) )
            )
        ) {
        var menu_block = '';
        var submenu_block = '';
        var select = '';
        var i = 1;
        var other_select = '';

        menu_block += '<div class="cv_mainmenu_container"><div class="cv_mainmenu_container_2">';
        menu_block += '<div id="cv_mainmenu" class="cv_mainmenu cv_clrearfix"><ul>';
        jQuery('#sw_c1 .cwp:first span').each( function() {
            select = ''
            if (jQuery(this).css('font-weight') == '700') select = 'cv_mainmenu_select ';


            // Correct VK link
            if (jQuery(this).find('a').text() == 'Группа ВКонтакте') {
                jQuery(this).find('a').text('Группа ВК');
            }

            // Move img.
            jQuery(this).find('a').prepend(jQuery(this).find('img'));

            if (i <= 8) {
                menu_block += '<li class="topmenu ' + select + '">';
                menu_block += jQuery(this).html();
                menu_block += '</li>';
            } else {
                submenu_block += '<li class="' + select + '">';
                submenu_block += jQuery(this).html();
                submenu_block += '</li>';
                if (jQuery(this).css('font-weight') == '700') other_select = 'cv_mainmenu_select ';
            }
            i++;

        });

        menu_block += '<li class="topmenu submenu ' + other_select + '">';
        menu_block += '<img src="/e107_images/icons/e7.png" alt=""> <a href=#>Остальное</a>'
        menu_block += '<ul>' + submenu_block + '</ul>';
        menu_block += '</li>';

        menu_block += '</ul></div>';
        menu_block += '</div></div>';

        jQuery('#toplogo').after(menu_block);

        //jQuery('#sw_c1').find('.swblock').first().hide();

        // Open/close submenu.
        jQuery('.cv_mainmenu ul .submenu').on('click', function() {
                var menu = jQuery(this).children('ul');
                if (menu.hasClass('cv_submenu_open')) {
                        menu.removeClass('cv_submenu_open');
                } else {
                        menu.addClass('cv_submenu_open');
                }
        });

        // Hide submenu if lost mouse.
        jQuery('.cv_mainmenu ul .submenu').on('mouseleave', function() {
            jQuery(this).children('ul').removeClass('cv_submenu_open');
        });

        // Disable href in links in li.submenu.
        jQuery('.cv_mainmenu ul .submenu').children('a').click(function(e) {
            e.preventDefault();
        });

    }


    // Forum. Moving right colum to left.
    if ( (sw_config.forum_right_to_left) &&
            ( (/\/\/sonic-world\.ru\/forum/.test(document.location.href)                // New path to forum.
                || (/\/\/forum.sonic-world\.ru/.test(document.location.href))) )        // Old path to forum.
    ) {
        jQuery('#board_index').removeClass('ipsLayout_withright').addClass('ipsLayout_withleft');
        jQuery('#board_index').removeClass('ipsLayout_largeright').addClass('ipsLayout_largeleft');
        jQuery('#index_stats').removeClass('ipsLayout_right').addClass('ipsLayout_left');
        jQuery('#board_index').prepend( jQuery('#index_stats') );
    }


    // Add Photoswipe to gallery
    if ( (sw_config.enable_photoswipe) && (/\/gallery\/displayimage.php/.test(document.location.pathname)) ) {

        var $p = jQuery('a[rel*="shadowbox"]');
        if ($p.attr('rel') != undefined) {

            var wh = $p.attr('rel').split(';');
            var w = parseInt(wh[2].split('=')[1], 10);
            var h = parseInt(wh[1].split('=')[1], 10);
            var hr = $p.attr('href');
            var img_src = $p.find('img').attr('src');

            var $cv_pswp = jQuery('<div></div>', {class: 'cv_photoswipe_gallery'})
                .append('<figure class="cv_figure_pswp"></figure>');
            $cv_pswp.find('figure').append('<a></a>');
            $cv_pswp.find('a').attr({href: hr, 'data-size': w + 'x' + h}).append('<img></img>');
            $cv_pswp.find('img').attr({class: 'image shadowbox_add', src: img_src});

            $p.addClass('invisible');
            $p.find('img').addClass('invisible').removeClass('image');

            $p.after($cv_pswp);

            // Forestall run photoswipe.
            init_begin_pswp();

        }
    }


    // Add forum filter status.
    if ( sw_config.forum_filter_status && (/\/forum\/$/.test(document.location.pathname)) ) {
        var status_original = jQuery('#statusHook');
        var status_filter = jQuery('<div></div>').addClass('ipsSideBlock').attr('id', 'statusHook-SWP');
        var status_header = jQuery('<h3><a href="#" class="ipsSidebar_trigger ipsType_smaller right desc mod_links">×</a>Конкурсные статусы</h3>');
        var status_body = jQuery('\
        <div class="_sbcollapsable">\
            <div id="status_wrapper-SWP">\
                <div id="status_wrapper_inside-SWP">\
                    <ul class="ipsList_withminiphoto status_list" >\
                    </ul>\
                </div>\
            </div>\
        </div>\
        ');
        var status_ul = status_body.find('ul')

        status_filter.append(status_header);
        status_filter.append(status_body);
        status_original.after(status_filter);

        getStatusPages(status_ul, 0, 5);
    }
}


//-----------------------------------
self.port.on("take_get_sw_config", function(conf) {
    swPatchBegin(conf);
});


//-----------------------------------


function swPatchBegin(conf) {
    // Run only if it's not admin directory
    var path_r = document.location.pathname;
    if ( !(/\/odminka\//.test(path_r)) &&
         !(/\/e107_admin\//.test(path_r)) &&
         !(/\/admin\//.test(path_r))
    ){
        swPatchRun(conf);
    } else {
        console.log('SW_patch disabled for admin directory.');
    }
}

jQuery(document).ready( function() {
    self.port.emit("get_sw_config", null);
});
