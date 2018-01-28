// Debug logs.
function debug(args) {
    console.log('>>>', ...arguments);
}

const jQj = jQuery.noConflict(true);

// Analog jQuery.ready.
// Default DOMContentLoaded not work as need.
(function (window) {
  var jReady = function (callback) {
      readyBound = false;
      jReady.isReady = false;
      if (typeof callback == 'function') {
        DOMReadyCallback = callback;
      }
      bindReady();
    },
    document = window.document,
    readyBound = false,
    DOMReadyCallback = function () {},
    DOMContentLoaded;
  jReady.isReady = false;
  var DOMReady = function () {
      if (!jReady.isReady) {
        if (!document.body) {
          setTimeout(DOMReady, 13);
          return;
        }
        jReady.isReady = true;
        DOMReadyCallback();
      }
    }
  var bindReady = function () {
      if (readyBound) {
        return;
      }
      readyBound = true;
      if (document.readyState === "complete") {
        DOMReady();
      }
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
        window.addEventListener("load", DOMContentLoaded, false);
      } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", DOMContentLoaded);
        window.attachEvent("onload", DOMContentLoaded);
        var toplevel = false;
        try {
          toplevel = window.frameElement == null;
        } catch (e) {}
        if (document.documentElement.doScroll && toplevel) {
          doScrollCheck();
        }
      }
    };
  var doScrollCheck = function () {
      if (jReady.isReady) {
        return;
      }
      try {
        document.documentElement.doScroll("left");
      } catch (error) {
        setTimeout(doScrollCheck, 1);
        return;
      }
      DOMReady();
    }
  if (document.addEventListener) {
    DOMContentLoaded = function () {
      document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
      DOMReady();
    };
  } else if (document.attachEvent) {
    DOMContentLoaded = function () {
      if (document.readyState === "complete") {
        document.detachEvent("onreadystatechange", DOMContentLoaded);
        DOMReady();
      }
    };
  }
  window.jReady = jReady;
})(window);



//*****************************************************************************
class PatchSw {
    constructor(config, jQuery) {
        this.config = config || {};
        this.jQuery = jQuery;       // TODO: Delete on future.
    }

    // Get param from url.
    getUrlParameter(sUrl, sParam) {
        if (sUrl === undefined) return 0;
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
        return 0;
    }

    // Get param from url [special e107].
    getE107UrlParameter(sUrl, sParam) {
        if (sUrl === undefined) return 0;
        var sPageURL = sUrl.split('?')[1];
        var sURLVariables = sPageURL.split('.');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            if (sURLVariables[i] == sParam)
            {
                return sURLVariables[i+1] || 0;
            }
        }
        return 0;
    }

    // Add avatar for gallery user.
    getGalleryAvatarPict(uid) {
        let j = this.jQuery;
        let prefUrl = 'https://sonic-world.ru/files/public/avatars/av';
        if (uid == undefined) return false;
        j.ajax({
            url: prefUrl + uid +'.jpg',
            type:'HEAD',
            error:
                function(){
                    j.ajax({
                    url: prefUrl + uid +'.png',
                    type:'HEAD',
                    error:
                        function(){
                            j.ajax({
                            url: prefUrl + uid +'.gif',
                            type:'HEAD',
                            error:
                                function(){
                                    j('.sw_gallery_avatar_'+ uid)
                                        .css('background-color', '#E0E0E0');
                                },
                            success:
                                function(){
                                    j('.sw_gallery_avatar_'+ uid)
                                        .css('background-image', 'url(../files/public/avatars/av'+ uid +'.gif)');
                                }
                            });
                        },
                    success:
                        function(){
                            j('.sw_gallery_avatar_'+ uid)
                                .css('background-image', 'url(../files/public/avatars/av'+ uid +'.png)');
                        }
                    });
                },
            success:
                function(){
                    j('.sw_gallery_avatar_'+ uid)
                    .css('background-image', 'url(../files/public/avatars/av'+ uid +'.jpg)');
                }
        });
    }

    changeLayout() {
        this.jQuery("body").addClass("body").addClass("wrap");
        let wrap = this.jQuery("#wrap");
        wrap.prepend("<div id='wrap_content'></div>");
        let wrap_content = this.jQuery("#wrap_content");
        wrap_content.append( this.jQuery("#sw_c1") );
        wrap_content.append( this.jQuery("#sw_c3") );
        wrap_content.append( this.jQuery("#sw_c2") );
        wrap_content.append( this.jQuery("#sw_f") );
        wrap.prepend( this.jQuery("#toplogo") );
        wrap.addClass("wrap");
        this.jQuery("#sw_c1").addClass("sw_top");
        this.jQuery("#sw_c3").addClass("sw_top");
    }

    changeShadowbox() {
        this.jQuery("a[rel*='shadowbox'] img").addClass("shadowbox_add");
        this.jQuery('body').append('<style>#sb-body,#sb-loading{background-color: #FFFFFF !important;}</style>');
        // this.jQuery('body').append(`<style>
        // #sb-loading-inner{position:absolute;font-size:14px;line-height:34px;height:34px;top:50%;margin-top:-17px;width:100%;text-align:center;}
        // </style>'`);
    }

    disableCommercial() {
        this.jQuery(".slza").hide();
        this.jQuery("#swz1, #swz2").hide();
        this.jQuery("#sw_f div:first").hide();
        this.jQuery("#board_statistics").next().hide();
        this.jQuery(".c410d1").hide();
        //this.jQuery("#swz1").parent("th").hide();         // Not need after update forum to v. 3.
    }

    galleryFilmstripHideLine() {
        this.jQuery('#filmstrip').children('table').children('tbody').children('tr:nth-child(2n-1)').hide();
    }

    forumReputationIgnore() {
        let style = document.createElement('style');
        let css = `
            .reputation,
            .ipsRepBadge,
            .ipsReact_reaction,
            .ipsReact_reactions,
            .ipsReactOverview,
            .ipsReact,
            .cProfileRepScore {
                display: none !important;
            }
        `;
        let body = document.body || document.getElementsByTagName('body')[0];
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        body.appendChild(style);
    }

    galleryFixCat1() {
        let tmp = `
        <div class="image" style="display:inline-block;">
        <img src="albums/userpics/12670/picthumb_onya.png" class="" width="93" height="100" border="0" alt="">
        <img src="albums/userpics/27370/picthumb_img_1225.jpg" class="" width="68" height="100" border="0" alt="">
        <img src="albums/userpics/10441/picthumb_irma_th.jpg" class="" width="92" height="100" border="0" alt="">
        <img src="albums/userpics/10594/picthumb_linjkatejlza.jpg" class="" width="99" height="100" border="0" alt="">
        </div><br />
        `;
        this.jQuery('span.catlink:first').css('text-align','center').find('a[href="index.php?cat=1"]').prepend(tmp);
    }

    galleryIgnorSmiles() {
        this.jQuery("img[alt^='Laughing']").replaceWith(" <b>lol</b> ");
        this.jQuery("img[alt^='Razz']").replaceWith(" <b>:-P</b> ");
        this.jQuery("img[alt^='Very Happy']").replaceWith(" <b>:-D</b> ");
        this.jQuery("img[alt^='Smile']").replaceWith(" <b>:-)</b> ");
        this.jQuery("img[alt^='Neutral']").replaceWith(" <b>:-|</b> ");
        this.jQuery("img[alt^='Sad']").replaceWith(" <b>:-(</b> ");
        this.jQuery("img[alt^='Crying or Very sad']").replaceWith(" <b>:cry:</b> ");
        this.jQuery("img[alt^='Cool']").replaceWith(" <b>8-)</b> ");
        this.jQuery("img[alt^='Surprised']").replaceWith(" <b>:-o</b> ");
        this.jQuery("img[alt^='Confused']").replaceWith(" <b>:-?</b> ");
        this.jQuery("img[alt^='Embarrassed']").replaceWith(" <b>:oops:</b> ");
        this.jQuery("img[alt^='Shocked']").replaceWith(" <b>:shock:</b> ");
        this.jQuery("img[alt^='Mad']").replaceWith(" <b>:-x</b> ");
        this.jQuery("img[alt^='Rolling Eyes']").replaceWith(" <b>:roll:</b> ");
        this.jQuery("img[alt^='Wink']").replaceWith(" <b>;-)</b> ");
        this.jQuery("img[alt^='Idea']").replaceWith(" <b>:idea:</b> ");
        this.jQuery("img[alt^='Exclamation']").replaceWith(" <b>:!:</b> ");
        this.jQuery("img[alt^='Question']").replaceWith(" <b>:?:</b> ");
    }


    // TODO: reomve first and last avatar if pagination is.
    galleryAvatars() {
        let list;
        list = this.jQuery('#comments').children('table');
        for(let i = 0; i < list.length; i++) {
            var text = this.jQuery(list[i]).find('a:first').attr("href");
            if (this.getUrlParameter(text,'uid') !== undefined) {
                this.jQuery(list[i]).wrap('<div class="sw_gallery_comment"><div class="sw_gallery_comment_text"></div></div>');
            }
        }
        list = this.jQuery('.sw_gallery_comment');
        for(let i = 0; i < list.length; i++) {
            var text = this.jQuery(list[i]).find('a').first().attr("href");
            var uid = this.getUrlParameter(text, 'uid');

            if (uid !== undefined) {
                var text_swga =
                      '<a href="../user.php?id.'+uid+'">'
                    + '   <div class="sw_gallery_avatar sw_gallery_avatar_'+uid+'"></div>'
                    + '</a>';
                if (uid !== 0) {
                    this.jQuery(list[i]).prepend(text_swga);
                    this.getGalleryAvatarPict(uid);
                } else {
                    this.jQuery(list[i]).prepend(text_swga);
                }
            }
        }
    }


    correctBadUrl () {
        let list;
        // Correct url for edit comments in user profile.
        if ( /\/user\.php\?/.test(document.location.href) ) {
            let sw_user_id = getE107UrlParameter(document.location.href, 'id');
            let sw_edit_id = 0;
            list = this.jQuery('a[href*="/comment.php?.edit."]');
            for(let i = 0; i < list.length; i++) {
                sw_edit_id = getE107UrlParameter(jQuery(list[i]).attr('href'), 'edit');
                this.jQuery(list[i]).attr('href','/comment.php?comment.user.'+sw_user_id+'.edit.'+sw_edit_id);
            }
        }

        // Correct url in bottom chatik (to mobile version).
        if ( /\/modules\/chatik\/chatik\.php/.test(document.location.pathname) ) {
            list = this.jQuery('a[href*="/modules/chatik/chatik.php??"]')
            for(let i = 0; i < list.length; i++) {
                this.jQuery(list[i]).attr('href', this.jQuery(list[i]).attr('href').replace(/\?+/g, '?') );
            }
        }
    }


    alternativeMenu() {
        let menu_block = '';
        let submenu_block = '';
        let select = '';
        let other_select = '';
        let list;

        menu_block += '<div class="cv_mainmenu_container"><div class="cv_mainmenu_container_2">';
        menu_block += '<div id="cv_mainmenu" class="cv_mainmenu cv_clrearfix"><ul>';
        list = this.jQuery('#sw_c1 .cwp:first span')
        for(let i = 0; i < list.length; i++) {
            select = ''
            if (this.jQuery(list[i]).css('font-weight') == '700') select = 'cv_mainmenu_select ';

            // Correct VK link
            if (this.jQuery(list[i]).find('a').text() == 'Группа ВКонтакте') {
                this.jQuery(list[i]).find('a').text('Группа ВК');
            }

            // Move img.
            this.jQuery(list[i]).find('a').prepend(this.jQuery(list[i]).find('img'));

            if (i <= 7) {
                menu_block += '<li class="topmenu ' + select + '">';
                menu_block += this.jQuery(list[i]).html();
                menu_block += '</li>';
            } else {
                submenu_block += '<li class="' + select + '">';
                submenu_block += this.jQuery(list[i]).html();
                submenu_block += '</li>';
                if (this.jQuery(list[i]).css('font-weight') == '700') other_select = 'cv_mainmenu_select ';
            }
        }

        menu_block += '<li class="topmenu submenu ' + other_select + '">';
        menu_block += '<img src="/e107_images/icons/e7.png" alt=""> <a href=#>Остальное</a>'
        menu_block += '<ul>' + submenu_block + '</ul>';
        menu_block += '</li>';

        menu_block += '</ul></div>';
        menu_block += '</div></div>';

        this.jQuery('#toplogo').after(menu_block);

        // Open/close submenu.
        let self = this;

        this.jQuery('.cv_mainmenu ul .submenu').on('click', function() {
            let menu = self.jQuery(this).children('ul');
            debug(menu);
            if (menu.hasClass('cv_submenu_open')) {
                menu.removeClass('cv_submenu_open');
            } else {
                menu.addClass('cv_submenu_open');
            }
        });

        // Hide submenu if lost mouse.
        this.jQuery('.cv_mainmenu ul .submenu').on('mouseleave', function() {
            self.jQuery(this).children('ul').removeClass('cv_submenu_open');
        });

        // Disable href in links in li.submenu.
        this.jQuery('.cv_mainmenu ul .submenu').children('a').click(function(e) {
            e.preventDefault();
        });

    }




}


//  ====================    DEPRECATED   ========================

// // Get status page.
// function getStatusPages(ul, rol, limit, recursion) {
//
//     var limit_recursion = 3;
//
//     if (recursion === null || recursion === undefined) {
//         recursion = 1;
//     }
//     var bard = null;
//     var st = '';
//
//     if (rol !== null && rol !== 0) {
//         st = '?st=' + (rol * 15);
//     }
//
//     this.jQuery.ajax({
//         url:'http://sonic-world.ru/forum/statuses/all/' + st,
//         type:'GET',
// //        error:
// //            function(){
// //                consola.log('ERROR');
// //            },
//         success:
//             function(data, textStatus, jqXHR){
//                 bard = limit - setFiltredStatus(ul, data, limit);
//                 recursion++;
//                 if (bard > 0 && recursion <= limit_recursion){
//                     getStatusPages(ul, rol+1, bard, recursion)
//                 } else if (bard === limit) {
//                     ul.append(this.jQuery('<li><span>Пусто</span></li>'));
//                 }
//             }
//         });
//     return 0;
// }
//
//
// // Filtring and insert statuses.
// function setFiltredStatus(ul, data, limit) {
//     var stats_lists = this.jQuery(data).find('#status_wrapper > .ipsBox_container');
//     var li = null;
//     var liw = null;
//     var stats_rel = 0;
//     var message = '';
//
//     stats_lists.each(function (){
//         li = this.jQuery(this.jQuery(this).html());
//         message = li.find('.status_status').html();
//
//         if (stats_rel < limit && /topic.\d+.*?(конкурс|голос|дуэл)/.test(message)) {
//
//             li.find('ul.ipsList_withtinyphoto').remove();
//             li.find('.status_feedback').remove();
//
//             li.find('.ipsUserPhoto_medium')
//                 .removeClass('ipsUserPhoto_medium')
//                 .addClass('ipsUserPhoto_mini');
//
//             liw = this.jQuery('<li class="clearfix"></li>');
//             liw.wrapInner(li);
//
//             liw.find('.ipsBox_withphoto')
//                 .removeClass('status_content')
//                 .removeClass('ipsBox_withphoto')
//                 .addClass('list_content');
//
//             ul.append(liw);
//             stats_rel++;
//         }
//     });
//
//     return stats_rel;
// }
//
//
// function clearReputation() {
// //    this.jQuery(".reputation, .rep_bar").hide();
// //    this.jQuery('[data-tabid="reputation"]').hide();
//     var style = document.createElement('style');
//     var css = '.reputation, .rep_bar, [data-tabid="reputation"] {display: none !important;}';
//     var body = document.body || document.getElementsByTagName('body')[0];
//     style.type = 'text/css';
//     if (style.styleSheet){
//         style.styleSheet.cssText = css;
//     } else {
//         style.appendChild(document.createTextNode(css));
//     }
//     body.appendChild(style);
// }
//
//
// function addMultiquote(element) {
//     var post = this.jQuery(element);
//     var el = post.find('ul.post_controls');
//     var infoLink = post.find('span.post_id a').attr('href');
//     if (infoLink.length === 0) {
//         return;
//     }
//
//     var res = infoLink.match( /\/forum\/topic\/(\d*)-.*#entry(\d*)$/i );
//     if (res === null) {
//         return;
//     }
//
//     var t = res[1];
//     var qpid = res[2];
//     var href = 'https://sonic-world.ru/forum/index.php?app=forums&module=post&section=post&do=reply_post&f=16&t=' + t + '&qpid=' + qpid;
//     var link = this.jQuery('<a href="#" title="Эта кнопка позволяет выбрать несколько сообщений (можно из разных тем), а затем ответить одновременно на все." class="ipsButton_secondary">Цитата+</a>');
//     var li = this.jQuery('<li class="multiquote" id="multiq_" style=""></li>');
//
//     link.attr('href', href);
//     li.append(link);
//     li.attr('id', 'multiq_' + qpid);
//     el.prepend(li);
// }




//*****************************************************************************

// Main patch run
function swPatchRun(sw_config) {
    let patch = new PatchSw(sw_config, jQj);

    // Hide forum reputation.
    // Forym only.
    if ( sw_config.forum_reputation_ignore
        && (/\/\/sonic-world\.ru\/forum/.test(document.location.href))
    ) {
        debug('forumReputationIgnore');
        patch.forumReputationIgnore();
    }

    // Add fxied layout and background color.
    // Portal only.
    if (sw_config.change_layout
        && (document.location.pathname != '')
        && !(/\/\/sonic-world\.ru\/forum/.test(document.location.href))
    ) {
        debug('changeLayout');
        patch.changeLayout();
    }

    // Correct some problam on Shadowbox.
    // Portal only.
    if ( sw_config.change_shadowbox
        && (document.location.pathname != '')
        && !(/\/\/sonic-world\.ru\/forum/.test(document.location.href))
    ) {
        debug('changeShadowbox');
        patch.changeShadowbox();
    }

    // Hide _some_ commercial banners.
    // Portal and forum.
    if (sw_config.disable_commercial
    ) {
        debug('disableCommercial');
        patch.disableCommercial();
    }

//
//     // DEPRECATED
//     // Hide forum avards.
//     if ( sw_config.forum_avards_ignore && (/\/\/sonic-world\.ru\/forum/.test(document.location.href))  ) {
//         jQuery(".author_info").find('fieldset').hide();
//         jQuery('[data-tabid="awards"]').hide();
//     }
//

    // Hide filmstripper black lines.
    // Gallery displayimage only.
    if ( sw_config.gallery_filmstrip_hide_line
        && (/\/gallery\/displayimage\.php/.test(document.location.pathname))
    ) {
        debug('galleryFilmstripHideLine');
        patch.galleryFilmstripHideLine();
    }


    // Add some images to main link gallery.
    // Gallery index only.
    if ( sw_config.gallery_fix_cat_1
        && (
            (/\/gallery\/$/.test(document.location.pathname))
            || (/\/gallery\/index.php$/.test(document.location.pathname))
        )
    ) {
        debug('galleryFixCat1');
        patch.galleryFixCat1();
    }


    // Disable image smiles in gallery.
    // Gallery only.
    if ( sw_config.gallery_ignor_smiles
        && (/\/gallery\//.test(document.location.pathname))
    ) {
        debug('galleryIgnorSmiles');
        patch.galleryIgnorSmiles();
    }


    // Add user avatars in gallery.
    // Gallery displayimage only.
    if ( sw_config.gallery_avatars && (/\/gallery\/displayimage.php/.test(document.location.pathname)) ) {
        debug('galleryAvatars');
        patch.galleryAvatars();
    }


    // Correct some bad url.
    // All.
    if ( sw_config.correct_url ) {
        debug('correctBadUrl');
        patch.correctBadUrl();
    }


    // Add alternative menu in top.
    // Sity only.
    if ( (sw_config.alternative_menu)
        && (/\/\/sonic-world\.ru/.test(document.location.href))
        && !(  // Without mobile version chatik.
                ( /\/modules\/chatik\/chatik\.php/.test(document.location.href) )
                && ( /mobile=1/.test(document.location.href) )
            )
    ) {
        debug('alternativeMenu');
        patch.alternativeMenu();
    }

//
//     // Forum. Moving right colum to left.
//     if ( (sw_config.forum_right_to_left) &&
//             ( (/\/\/sonic-world\.ru\/forum/.test(document.location.href)                // New path to forum.
//                 || (/\/\/forum.sonic-world\.ru/.test(document.location.href))) )        // Old path to forum.
//     ) {
//         jQuery('#board_index').removeClass('ipsLayout_withright').addClass('ipsLayout_withleft');
//         jQuery('#board_index').removeClass('ipsLayout_largeright').addClass('ipsLayout_largeleft');
//         jQuery('#index_stats').removeClass('ipsLayout_right').addClass('ipsLayout_left');
//         jQuery('#board_index').prepend( jQuery('#index_stats') );
//     }
//
//
//     // Add Photoswipe to gallery
//     if ( (sw_config.enable_photoswipe) && (/\/gallery\/displayimage.php/.test(document.location.pathname)) ) {
//
//         var $p = jQuery('a[rel*="shadowbox"]');
//         if ($p.attr('rel') != undefined) {
//
//             var wh = $p.attr('rel').split(';');
//             var w = parseInt(wh[2].split('=')[1], 10);
//             var h = parseInt(wh[1].split('=')[1], 10);
//             var hr = $p.attr('href');
//             var img_src = $p.find('img').attr('src');
//
//             var $cv_pswp = jQuery('<div></div>', {class: 'cv_photoswipe_gallery'})
//                 .append('<figure class="cv_figure_pswp"></figure>');
//             $cv_pswp.find('figure').append('<a></a>');
//             $cv_pswp.find('a').attr({href: hr, 'data-size': w + 'x' + h}).append('<img></img>');
//             $cv_pswp.find('img').attr({class: 'image shadowbox_add', src: img_src});
//
//             $p.addClass('invisible');
//             $p.find('img').addClass('invisible').removeClass('image');
//
//             $p.after($cv_pswp);
//
//             // Forestall run photoswipe.
//             init_begin_pswp();
//
//         }
//     }
//
//
//     // Add forum filter status.
//     if ( sw_config.forum_filter_status && (/\/forum\/$/.test(document.location.pathname)) ) {
//         var status_original = jQuery('#statusHook');
//         var status_filter = jQuery('<div></div>').addClass('ipsSideBlock').attr('id', 'statusHook-SWP');
//         var status_header = jQuery('<h3><a href="#" class="ipsSidebar_trigger ipsType_smaller right desc mod_links">×</a>Конкурсные статусы</h3>');
//         var status_body = jQuery('\
//         <div class="_sbcollapsable">\
//             <div id="status_wrapper-SWP">\
//                 <div id="status_wrapper_inside-SWP">\
//                     <ul class="ipsList_withminiphoto status_list" >\
//                     </ul>\
//                 </div>\
//             </div>\
//         </div>\
//         ');
//         var status_ul = status_body.find('ul')
//
//         status_filter.append(status_header);
//         status_filter.append(status_body);
//         status_original.after(status_filter);
//
//         getStatusPages(status_ul, 0, 5);
//     }
//
//
//     // Add user custome style (css).
//     if ( sw_config.custom_style ) {
//         var style = document.createElement('style');
//         var css = sw_config.custom_style_text;
//         var body = document.body || document.getElementsByTagName('body')[0];
//
//         style.type = 'text/css';
//         if (style.styleSheet){
//             style.styleSheet.cssText = css;
//         } else {
//             style.appendChild(document.createTextNode(css));
//         }
//         body.appendChild(style);
//     }
//
//
//     // Add multiquote in closed themes.
//     if ( sw_config.forum_multiquote_in_closed_themes
//             && (/\/forum\/topic\/\d*-/.test(document.location.pathname))
//             && !document.getElementById('sign_in')
//     ) {
//         var closedButton = jQuery('.topic_buttons .important span');
//
//         if (closedButton.length > 0) {
//             jQuery('.post_block').each( function(index, element) {
//                 addMultiquote(element);
//             })
//         }
//
//
//
//     }
}

jReady (() => {
    debug('sw_config');

    // Run only if it's not admin directory
    var path_r = document.location.pathname;
    if ( !(/\/odminka\//.test(path_r)) &&
         !(/\/e107_admin\//.test(path_r)) &&
         !(/\/admin\//.test(path_r)) &&
         !(/\/fckeditor\//.test(path_r))
    ){
        debug('Run main patch.');
        swPatchRun(window.sw_config);
    } else {
        debug('SW_patch disabled for admin directory.');
    }
});
