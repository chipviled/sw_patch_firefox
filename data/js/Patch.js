class PatchRoll {
    constructor(config) {
        this.config = config || {};
        this.jQuery = window.jQuery;
    }

    // Get param from url.
    getUrlParameter(sUrl, sParam) {
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
        return 0;
    }

    // Get param from url [special e107].
    getE107UrlParameter(sUrl, sParam) {
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
        return 0;
    }

    // Add avatar for gallery user.
    getGalleryAvatarPict(uid) {
        let prefUrl = 'http://sonic-world.ru/files/public/avatars/av';
        if (uid == undefined) return false;
        this.jQuery.ajax({
            url: prefUrl + uid +'.jpg',
            type:'HEAD',
            error:
                function(){
                    this.jQuery.ajax({
                    url: prefUrl + uid +'.png',
                    type:'HEAD',
                    error:
                        function(){
                            this.jQuery.ajax({
                            url: prefUrl + uid +'.gif',
                            type:'HEAD',
                            error:
                                function(){
                                    this.jQuery('.sw_gallery_avatar_'+ uid)
                                        .css('background-color', '#E0E0E0');
                                },
                            success:
                                function(){
                                    this.jQuery('.sw_gallery_avatar_'+ uid)
                                        .css('background-image', 'url(../files/public/avatars/av'+ uid +'.gif)');
                                }
                            });
                        },
                    success:
                        function(){
                            this.jQuery('.sw_gallery_avatar_'+ uid)
                                .css('background-image', 'url(../files/public/avatars/av'+ uid +'.png)');
                        }
                    });
                },
            success:
                function(){
                    this.jQuery('.sw_gallery_avatar_'+ uid)
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
