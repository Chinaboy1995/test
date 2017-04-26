/*!
 * jQuery contextMenu v2.4.3-dev - Plugin for simple contextMenu handling
 *
 * Version: v2.4.3-dev
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2017 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * Date: 2017-01-21T11:53:09.617Z
 */

(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):typeof exports=="object"?e(require("jquery")):e(jQuery)})(function(e){function p(e){var t=e.split(/\s+/),n=[];for(var r=0,i;i=t[r];r++)i=i.charAt(0).toUpperCase(),n.push(i);return n}function d(t){return t.id&&e('label[for="'+t.id+'"]').val()||t.name}function v(t,n,r){return r||(r=0),n.each(function(){var n=e(this),i=this,s=this.nodeName.toLowerCase(),o,u;s==="label"&&n.find("input, textarea, select").length&&(o=n.text(),n=n.children().first(),i=n.get(0),s=i.nodeName.toLowerCase());switch(s){case"menu":u={name:n.attr("label"),items:{}},r=v(u.items,n.children(),r);break;case"a":case"button":u={name:n.text(),disabled:!!n.attr("disabled"),callback:function(){return function(){n.click()}}()};break;case"menuitem":case"command":switch(n.attr("type")){case undefined:case"command":case"menuitem":u={name:n.attr("label"),disabled:!!n.attr("disabled"),icon:n.attr("icon"),callback:function(){return function(){n.click()}}()};break;case"checkbox":u={type:"checkbox",disabled:!!n.attr("disabled"),name:n.attr("label"),selected:!!n.attr("checked")};break;case"radio":u={type:"radio",disabled:!!n.attr("disabled"),name:n.attr("label"),radio:n.attr("radiogroup"),value:n.attr("id"),selected:!!n.attr("checked")};break;default:u=undefined}break;case"hr":u="-------";break;case"input":switch(n.attr("type")){case"text":u={type:"text",name:o||d(i),disabled:!!n.attr("disabled"),value:n.val()};break;case"checkbox":u={type:"checkbox",name:o||d(i),disabled:!!n.attr("disabled"),selected:!!n.attr("checked")};break;case"radio":u={type:"radio",name:o||d(i),disabled:!!n.attr("disabled"),radio:!!n.attr("name"),value:n.val(),selected:!!n.attr("checked")};break;default:u=undefined}break;case"select":u={type:"select",name:o||d(i),disabled:!!n.attr("disabled"),selected:n.val(),options:{}},n.children().each(function(){u.options[this.value]=e(this).text()});break;case"textarea":u={type:"textarea",name:o||d(i),disabled:!!n.attr("disabled"),value:n.val()};break;case"label":break;default:u={type:"html",html:n.clone(!0)}}u&&(r++,t["key"+r]=u)}),r}e.support.htmlMenuitem="HTMLMenuItemElement"in window,e.support.htmlCommand="HTMLCommandElement"in window,e.support.eventSelectstart="onselectstart"in document.documentElement;if(!e.ui||!e.widget)e.cleanData=function(t){return function(n){var r,i,s;for(s=0;n[s]!=null;s++){i=n[s];try{r=e._data(i,"events"),r&&r.remove&&e(i).triggerHandler("remove")}catch(o){}}t(n)}}(e.cleanData);var t=null,n=!1,r=e(window),i=0,s={},o={},u={},a={selector:null,appendTo:null,trigger:"right",autoHide:!1,delay:200,reposition:!0,selectableSubMenu:!1,classNames:{hover:"context-menu-hover",disabled:"context-menu-disabled",visible:"context-menu-visible",notSelectable:"context-menu-not-selectable",icon:"context-menu-icon",iconEdit:"context-menu-icon-edit",iconCut:"context-menu-icon-cut",iconCopy:"context-menu-icon-copy",iconPaste:"context-menu-icon-paste",iconDelete:"context-menu-icon-delete",iconAdd:"context-menu-icon-add",iconQuit:"context-menu-icon-quit",iconLoadingClass:"context-menu-icon-loading"},determinePosition:function(t){if(e.ui&&e.ui.position)t.css("display","block").position({my:"center top",at:"center bottom",of:this,offset:"0 5",collision:"fit"}).css("display","none");else{var n=this.offset();n.top+=this.outerHeight(),n.left+=this.outerWidth()/2-t.outerWidth()/2,t.css(n)}},position:function(e,t,n){var i;if(!t&&!n){e.determinePosition.call(this,e.$menu);return}t==="maintain"&&n==="maintain"?i=e.$menu.position():i={top:n,left:t};var s=r.scrollTop()+r.height(),o=r.scrollLeft()+r.width(),u=e.$menu.outerHeight(),a=e.$menu.outerWidth();i.top+u>s&&(i.top-=u),i.top<0&&(i.top=0),i.left+a>o&&(i.left-=a),i.left<0&&(i.left=0),e.$menu.css(i)},positionSubmenu:function(t){if(t===undefined)return;if(e.ui&&e.ui.position)t.css("display","block").position({my:"left top-5",at:"right top",of:this,collision:"flipfit fit"}).css("display","");else{var n={top:-9,left:this.outerWidth()-5};t.css(n)}},zIndex:1,animation:{duration:50,show:"slideDown",hide:"slideUp"},events:{show:e.noop,hide:e.noop},callback:null,items:{}},f={timer:null,pageX:null,pageY:null},l=function(e){var t=0,n=e;for(;;){t=Math.max(t,parseInt(n.css("z-index"),10)||0),n=n.parent();if(!n||!n.length||"html body".indexOf(n.prop("nodeName").toLowerCase())>-1)break}return t},c={abortevent:function(e){e.preventDefault(),e.stopImmediatePropagation()},contextmenu:function(n){var r=e(this);n.data.trigger==="right"&&(n.preventDefault(),n.stopImmediatePropagation());if(n.data.trigger!=="right"&&n.data.trigger!=="demand"&&n.originalEvent)return;if(!(n.mouseButton===undefined||!n.data||n.data.trigger==="left"&&n.mouseButton===0||n.data.trigger==="right"&&n.mouseButton===2))return;if(r.hasClass("context-menu-active"))return;if(!r.hasClass("context-menu-disabled")){t=r;if(n.data.build){var i=n.data.build(t,n);if(i===!1)return;n.data=e.extend(!0,{},a,n.data,i||{});if(!n.data.items||e.isEmptyObject(n.data.items))throw window.console&&(console.error||console.log).call(console,"No items specified to show in contextMenu"),new Error("No Items specified");n.data.$trigger=t,h.create(n.data)}var s=!1;for(var o in n.data.items)if(n.data.items.hasOwnProperty(o)){var u;e.isFunction(n.data.items[o].visible)?u=n.data.items[o].visible.call(e(n.currentTarget),o,n.data):typeof n.data.items[o]!="undefined"&&n.data.items[o].visible?u=n.data.items[o].visible===!0:u=!0,u&&(s=!0)}s&&h.show.call(r,n.data,n.pageX,n.pageY)}},click:function(t){t.preventDefault(),t.stopImmediatePropagation(),e(this).trigger(e.Event("contextmenu",{data:t.data,pageX:t.pageX,pageY:t.pageY}))},mousedown:function(n){var r=e(this);t&&t.length&&!t.is(r)&&t.data("contextMenu").$menu.trigger("contextmenu:hide"),n.button===2&&(t=r.data("contextMenuActive",!0))},mouseup:function(n){var r=e(this);r.data("contextMenuActive")&&t&&t.length&&t.is(r)&&!r.hasClass("context-menu-disabled")&&(n.preventDefault(),n.stopImmediatePropagation(),t=r,r.trigger(e.Event("contextmenu",{data:n.data,pageX:n.pageX,pageY:n.pageY}))),r.removeData("contextMenuActive")},mouseenter:function(n){var r=e(this),i=e(n.relatedTarget),s=e(document);if(i.is(".context-menu-list")||i.closest(".context-menu-list").length)return;if(t&&t.length)return;f.pageX=n.pageX,f.pageY=n.pageY,f.data=n.data,s.on("mousemove.contextMenuShow",c.mousemove),f.timer=setTimeout(function(){f.timer=null,s.off("mousemove.contextMenuShow"),t=r,r.trigger(e.Event("contextmenu",{data:f.data,pageX:f.pageX,pageY:f.pageY}))},n.data.delay)},mousemove:function(e){f.pageX=e.pageX,f.pageY=e.pageY},mouseleave:function(t){var n=e(t.relatedTarget);if(n.is(".context-menu-list")||n.closest(".context-menu-list").length)return;try{clearTimeout(f.timer)}catch(t){}f.timer=null},layerClick:function(t){var n=e(this),i=n.data("contextMenuRoot"),s=t.button,o=t.pageX,u=t.pageY,a,f;t.preventDefault(),t.stopImmediatePropagation(),setTimeout(function(){var n,l=i.trigger==="left"&&s===0||i.trigger==="right"&&s===2;if(document.elementFromPoint&&i.$layer){i.$layer.hide(),a=document.elementFromPoint(o-r.scrollLeft(),u-r.scrollTop());if(a.isContentEditable){var c=document.createRange(),h=window.getSelection();c.selectNode(a),c.collapse(!0),h.removeAllRanges(),h.addRange(c)}i.$layer.show()}if(i.reposition&&l)if(document.elementFromPoint){if(i.$trigger.is(a)||i.$trigger.has(a).length){i.position.call(i.$trigger,i,o,u);return}}else{f=i.$trigger.offset(),n=e(window),f.top+=n.scrollTop();if(f.top<=t.pageY){f.left+=n.scrollLeft();if(f.left<=t.pageX){f.bottom=f.top+i.$trigger.outerHeight();if(f.bottom>=t.pageY){f.right=f.left+i.$trigger.outerWidth();if(f.right>=t.pageX){i.position.call(i.$trigger,i,o,u);return}}}}}a&&l&&i.$trigger.one("contextmenu:hidden",function(){e(a).contextMenu({x:o,y:u,button:s})}),i!=null&&i.$menu!=null&&i.$menu.trigger("contextmenu:hide")},50)},keyStop:function(e,t){t.isInput||e.preventDefault(),e.stopPropagation()},key:function(e){var n={};t&&(n=t.data("contextMenu")||{}),n.zIndex===undefined&&(n.zIndex=0);var r=0,i=function(e){e.style.zIndex!==""?r=e.style.zIndex:e.offsetParent!==null&&e.offsetParent!==undefined?i(e.offsetParent):e.parentElement!==null&&e.parentElement!==undefined&&i(e.parentElement)};i(e.target);if(r>n.zIndex)return;switch(e.keyCode){case 9:case 38:c.keyStop(e,n);if(n.isInput){if(e.keyCode===9&&e.shiftKey){e.preventDefault(),n.$selected&&n.$selected.find("input, textarea, select").blur(),n.$menu!=null&&n.$menu.trigger("prevcommand");return}if(e.keyCode===38&&n.$selected.find("input, textarea, select").prop("type")==="checkbox"){e.preventDefault();return}}else if(e.keyCode!==9||e.shiftKey){n.$menu!=null&&n.$menu.trigger("prevcommand");return}break;case 40:c.keyStop(e,n);if(!n.isInput){n.$menu!=null&&n.$menu.trigger("nextcommand");return}if(e.keyCode===9){e.preventDefault(),n.$selected&&n.$selected.find("input, textarea, select").blur(),n.$menu!=null&&n.$menu.trigger("nextcommand");return}if(e.keyCode===40&&n.$selected.find("input, textarea, select").prop("type")==="checkbox"){e.preventDefault();return}break;case 37:c.keyStop(e,n);if(n.isInput||!n.$selected||!n.$selected.length)break;if(!n.$selected.parent().hasClass("context-menu-root")){var s=n.$selected.parent().parent();n.$selected.trigger("contextmenu:blur"),n.$selected=s;return}break;case 39:c.keyStop(e,n);if(n.isInput||!n.$selected||!n.$selected.length)break;var o=n.$selected.data("contextMenu")||{};if(o.$menu&&n.$selected.hasClass("context-menu-submenu")){n.$selected=null,o.$selected=null,o.$menu.trigger("nextcommand");return}break;case 35:case 36:if(n.$selected&&n.$selected.find("input, textarea, select").length)return;(n.$selected&&n.$selected.parent()||n.$menu).children(":not(."+n.classNames.disabled+", ."+n.classNames.notSelectable+")")[e.keyCode===36?"first":"last"]().trigger("contextmenu:focus"),e.preventDefault();return;case 13:c.keyStop(e,n);if(n.isInput){if(n.$selected&&!n.$selected.is("textarea, select")){e.preventDefault();return}break}typeof n.$selected!="undefined"&&n.$selected!==null&&n.$selected.trigger("mouseup");return;case 32:case 33:case 34:c.keyStop(e,n);return;case 27:c.keyStop(e,n),n.$menu!=null&&n.$menu.trigger("contextmenu:hide");return;default:var u=String.fromCharCode(e.keyCode).toUpperCase();if(n.accesskeys&&n.accesskeys[u]){n.accesskeys[u].$node.trigger(n.accesskeys[u].$menu?"contextmenu:focus":"mouseup");return}}e.stopPropagation(),typeof n.$selected!="undefined"&&n.$selected!==null&&n.$selected.trigger(e)},prevItem:function(t){t.stopPropagation();var n=e(this).data("contextMenu")||{},r=e(this).data("contextMenuRoot")||{};if(n.$selected){var i=n.$selected;n=n.$selected.parent().data("contextMenu")||{},n.$selected=i}var s=n.$menu.children(),o=!n.$selected||!n.$selected.prev().length?s.last():n.$selected.prev(),u=o;while(o.hasClass(r.classNames.disabled)||o.hasClass(r.classNames.notSelectable)||o.is(":hidden")){o.prev().length?o=o.prev():o=s.last();if(o.is(u))return}n.$selected&&c.itemMouseleave.call(n.$selected.get(0),t),c.itemMouseenter.call(o.get(0),t);var a=o.find("input, textarea, select");a.length&&a.focus()},nextItem:function(t){t.stopPropagation();var n=e(this).data("contextMenu")||{},r=e(this).data("contextMenuRoot")||{};if(n.$selected){var i=n.$selected;n=n.$selected.parent().data("contextMenu")||{},n.$selected=i}var s=n.$menu.children(),o=!n.$selected||!n.$selected.next().length?s.first():n.$selected.next(),u=o;while(o.hasClass(r.classNames.disabled)||o.hasClass(r.classNames.notSelectable)||o.is(":hidden")){o.next().length?o=o.next():o=s.first();if(o.is(u))return}n.$selected&&c.itemMouseleave.call(n.$selected.get(0),t),c.itemMouseenter.call(o.get(0),t);var a=o.find("input, textarea, select");a.length&&a.focus()},focusInput:function(){var t=e(this).closest(".context-menu-item"),n=t.data(),r=n.contextMenu,i=n.contextMenuRoot;i.$selected=r.$selected=t,i.isInput=r.isInput=!0},blurInput:function(){var t=e(this).closest(".context-menu-item"),n=t.data(),r=n.contextMenu,i=n.contextMenuRoot;i.isInput=r.isInput=!1},menuMouseenter:function(){var t=e(this).data().contextMenuRoot;t.hovering=!0},menuMouseleave:function(t){var n=e(this).data().contextMenuRoot;n.$layer&&n.$layer.is(t.relatedTarget)&&(n.hovering=!1)},itemMouseenter:function(t){var n=e(this),r=n.data(),i=r.contextMenu,s=r.contextMenuRoot;s.hovering=!0,t&&s.$layer&&s.$layer.is(t.relatedTarget)&&(t.preventDefault(),t.stopImmediatePropagation()),(i.$menu?i:s).$menu.children("."+s.classNames.hover).trigger("contextmenu:blur").children(".hover").trigger("contextmenu:blur");if(n.hasClass(s.classNames.disabled)||n.hasClass(s.classNames.notSelectable)){i.$selected=null;return}n.trigger("contextmenu:focus")},itemMouseleave:function(t){var n=e(this),r=n.data(),i=r.contextMenu,s=r.contextMenuRoot;if(s!==i&&s.$layer&&s.$layer.is(t.relatedTarget)){typeof s.$selected!="undefined"&&s.$selected!==null&&s.$selected.trigger("contextmenu:blur"),t.preventDefault(),t.stopImmediatePropagation(),s.$selected=i.$selected=i.$node;return}n.trigger("contextmenu:blur")},itemClick:function(t){var n=e(this),r=n.data(),i=r.contextMenu,s=r.contextMenuRoot,o=r.contextMenuKey,u;if(!i.items[o]||n.is("."+s.classNames.disabled+", .context-menu-separator, ."+s.classNames.notSelectable)||n.is(".context-menu-submenu")&&s.selectableSubMenu===!1)return;t.preventDefault(),t.stopImmediatePropagation();if(e.isFunction(i.callbacks[o])&&Object.prototype.hasOwnProperty.call(i.callbacks,o))u=i.callbacks[o];else{if(!e.isFunction(s.callback))return;u=s.callback}u.call(s.$trigger,o,s)!==!1?s.$menu.trigger("contextmenu:hide"):s.$menu.parent().length&&h.update.call(s.$trigger,s)},inputClick:function(e){e.stopImmediatePropagation()},hideMenu:function(t,n){var r=e(this).data("contextMenuRoot");h.hide.call(r.$trigger,r,n&&n.force)},focusItem:function(t){t.stopPropagation();var n=e(this),r=n.data(),i=r.contextMenu,s=r.contextMenuRoot;if(n.hasClass(s.classNames.disabled)||n.hasClass(s.classNames.notSelectable))return;n.addClass([s.classNames.hover,s.classNames.visible].join(" ")).parent().find(".context-menu-item").not(n).removeClass(s.classNames.visible).filter("."+s.classNames.hover).trigger("contextmenu:blur"),i.$selected=s.$selected=n,i.$node&&s.positionSubmenu.call(i.$node,i.$menu)},blurItem:function(t){t.stopPropagation();var n=e(this),r=n.data(),i=r.contextMenu,s=r.contextMenuRoot;i.autoHide&&n.removeClass(s.classNames.visible),n.removeClass(s.classNames.hover),i.$selected=null}},h={show:function(n,r,i){var s=e(this),o={};e("#context-menu-layer").trigger("mousedown"),n.$trigger=s;if(n.events.show.call(s,n)===!1){t=null;return}h.update.call(s,n),n.position.call(s,n,r,i);if(n.zIndex){var u=n.zIndex;typeof n.zIndex=="function"&&(u=n.zIndex.call(s,n)),o.zIndex=l(s)+u}h.layer.call(n.$menu,n,o.zIndex),n.$menu.find("ul").css("zIndex",o.zIndex+1),n.$menu.css(o)[n.animation.show](n.animation.duration,function(){s.trigger("contextmenu:visible")}),s.data("contextMenu",n).addClass("context-menu-active"),e(document).off("keydown.contextMenu").on("keydown.contextMenu",c.key),n.autoHide&&e(document).on("mousemove.contextMenuAutoHide",function(e){var t=s.offset();t.right=t.left+s.outerWidth(),t.bottom=t.top+s.outerHeight(),n.$layer&&!n.hovering&&(!(e.pageX>=t.left&&e.pageX<=t.right)||!(e.pageY>=t.top&&e.pageY<=t.bottom))&&setTimeout(function(){!n.hovering&&n.$menu!=null&&n.$menu.trigger("contextmenu:hide")},50)})},hide:function(n,r){var i=e(this);n||(n=i.data("contextMenu")||{});if(!r&&n.events&&n.events.hide.call(i,n)===!1)return;i.removeData("contextMenu").removeClass("context-menu-active");if(n.$layer){setTimeout(function(e){return function(){e.remove()}}(n.$layer),10);try{delete n.$layer}catch(s){n.$layer=null}}t=null,n.$menu.find("."+n.classNames.hover).trigger("contextmenu:blur"),n.$selected=null,n.$menu.find("."+n.classNames.visible).removeClass(n.classNames.visible),e(document).off(".contextMenuAutoHide").off("keydown.contextMenu"),n.$menu&&n.$menu[n.animation.hide](n.animation.duration,function(){n.build&&(n.$menu.remove(),e.each(n,function(e){switch(e){case"ns":case"selector":case"build":case"trigger":return!0;default:n[e]=undefined;try{delete n[e]}catch(t){}return!0}})),setTimeout(function(){i.trigger("contextmenu:hidden")},10)})},create:function(t,n){function r(t){var n=e("<span></span>");if(t._accesskey)t._beforeAccesskey&&n.append(document.createTextNode(t._beforeAccesskey)),e("<span></span>").addClass("context-menu-accesskey").text(t._accesskey).appendTo(n),t._afterAccesskey&&n.append(document.createTextNode(t._afterAccesskey));else if(t.isHtmlName){if(typeof t.accesskey!="undefined")throw new Error("accesskeys are not compatible with HTML names and cannot be used together in the same item");n.html(t.name)}else n.text(t.name);return n}n===undefined&&(n=t),t.$menu=e('<ul class="context-menu-list"></ul>').addClass(t.className||"").data({contextMenu:t,contextMenuRoot:n}),e.each(["callbacks","commands","inputs"],function(e,r){t[r]={},n[r]||(n[r]={})}),n.accesskeys||(n.accesskeys={}),e.each(t.items,function(i,s){var o=e('<li class="context-menu-item"></li>').addClass(s.className||""),a=null,f=null;o.on("click",e.noop);if(typeof s=="string"||s.type==="cm_separator")s={type:"cm_seperator"};s.$node=o.data({contextMenu:t,contextMenuRoot:n,contextMenuKey:i});if(typeof s.accesskey!="undefined"){var l=p(s.accesskey);for(var d=0,v;v=l[d];d++)if(!n.accesskeys[v]){n.accesskeys[v]=s;var m=s.name.match(new RegExp("^(.*?)("+v+")(.*)$","i"));m&&(s._beforeAccesskey=m[1],s._accesskey=m[2],s._afterAccesskey=m[3]);break}}if(s.type&&u[s.type])u[s.type].call(o,s,t,n),e.each([t,n],function(n,r){r.commands[i]=s,e.isFunction(s.callback)&&(r.callbacks[i]===undefined||t.type===undefined)&&(r.callbacks[i]=s.callback)});else{s.type==="cm_seperator"?o.addClass("context-menu-separator "+n.classNames.notSelectable):s.type==="html"?o.addClass("context-menu-html "+n.classNames.notSelectable):s.type!=="sub"&&(s.type?(a=e("<label></label>").appendTo(o),r(s).appendTo(a),o.addClass("context-menu-input"),t.hasTypes=!0,e.each([t,n],function(e,t){t.commands[i]=s,t.inputs[i]=s})):s.items&&(s.type="sub"));switch(s.type){case"cm_seperator":break;case"text":f=e('<input type="text" value="1" name="" />').attr("name","context-menu-input-"+i).val(s.value||"").appendTo(a);break;case"textarea":f=e('<textarea name=""></textarea>').attr("name","context-menu-input-"+i).val(s.value||"").appendTo(a),s.height&&f.height(s.height);break;case"checkbox":f=e('<input type="checkbox" value="1" name="" />').attr("name","context-menu-input-"+i).val(s.value||"").prop("checked",!!s.selected).prependTo(a);break;case"radio":f=e('<input type="radio" value="1" name="" />').attr("name","context-menu-input-"+s.radio).val(s.value||"").prop("checked",!!s.selected).prependTo(a);break;case"select":f=e('<select name=""></select>').attr("name","context-menu-input-"+i).appendTo(a),s.options&&(e.each(s.options,function(t,n){e("<option></option>").val(t).text(n).appendTo(f)}),f.val(s.selected));break;case"sub":r(s).appendTo(o),s.appendTo=s.$node,o.data("contextMenu",s).addClass("context-menu-submenu"),s.callback=null,"function"==typeof s.items.then?h.processPromises(s,n,s.items):h.create(s,n);break;case"html":e(s.html).appendTo(o);break;default:e.each([t,n],function(n,r){r.commands[i]=s,e.isFunction(s.callback)&&(r.callbacks[i]===undefined||t.type===undefined)&&(r.callbacks[i]=s.callback)}),r(s).appendTo(o)}s.type&&s.type!=="sub"&&s.type!=="html"&&s.type!=="cm_seperator"&&(f.on("focus",c.focusInput).on("blur",c.blurInput),s.events&&f.on(s.events,t)),s.icon&&(e.isFunction(s.icon)?s._icon=s.icon.call(this,this,o,i,s):typeof s.icon=="string"&&s.icon.substring(0,3)==="fa-"?s._icon=n.classNames.icon+" "+n.classNames.icon+"--fa fa "+s.icon:s._icon=n.classNames.icon+" "+n.classNames.icon+"-"+s.icon,o.addClass(s._icon))}s.$input=f,s.$label=a,o.appendTo(t.$menu),!t.hasTypes&&e.support.eventSelectstart&&o.on("selectstart.disableTextSelect",c.abortevent)}),t.$node||t.$menu.css("display","none").addClass("context-menu-root"),t.$menu.appendTo(t.appendTo||document.body)},resize:function(t,n){var r;t.css({position:"absolute",display:"block"}),t.data("width",(r=t.get(0)).getBoundingClientRect?Math.ceil(r.getBoundingClientRect().width):t.outerWidth()+1),t.css({position:"static",minWidth:"0px",maxWidth:"100000px"}),t.find("> li > ul").each(function(){h.resize(e(this),!0)}),n||t.find("ul").addBack().css({position:"",display:"",minWidth:"",maxWidth:""}).outerWidth(function(){return e(this).data("width")})},update:function(t,n){var r=this;n===undefined&&(n=t,h.resize(t.$menu)),t.$menu.children().each(function(){var i=e(this),s=i.data("contextMenuKey"),o=t.items[s],u=e.isFunction(o.disabled)&&o.disabled.call(r,s,n)||o.disabled===!0,a;e.isFunction(o.visible)?a=o.visible.call(r,s,n):typeof o.visible!="undefined"?a=o.visible===!0:a=!0,i[a?"show":"hide"](),i[u?"addClass":"removeClass"](n.classNames.disabled),e.isFunction(o.icon)&&(i.removeClass(o._icon),o._icon=o.icon.call(this,r,i,s,o),i.addClass(o._icon));if(o.type){i.find("input, select, textarea").prop("disabled",u);switch(o.type){case"text":case"textarea":o.$input.val(o.value||"");break;case"checkbox":case"radio":o.$input.val(o.value||"").prop("checked",!!o.selected);break;case"select":o.$input.val(o.selected||"")}}o.$menu&&h.update.call(r,o,n)})},layer:function(t,n){var i=t.$layer=e('<div id="context-menu-layer"></div>').css({height:r.height(),width:r.width(),display:"block",position:"fixed","z-index":n,top:0,left:0,opacity:0,filter:"alpha(opacity=0)","background-color":"#000"}).data("contextMenuRoot",t).insertBefore(this).on("contextmenu",c.abortevent).on("mousedown",c.layerClick);return document.body.style.maxWidth===undefined&&i.css({position:"absolute",height:e(document).height()}),i},processPromises:function(e,t,n){function r(e,t,n){n===undefined&&i(undefined),s(e,t,n)}function i(e,t,n){n===undefined?(n={error:{name:"No items and no error item",icon:"context-menu-icon context-menu-icon-quit"}},window.console&&(console.error||console.log).call(console,'When you reject a promise, provide an "items" object, equal to normal sub-menu items')):typeof n=="string"&&(n={error:{name:n}}),s(e,t,n)}function s(e,t,n){if(t.$menu===undefined||!t.$menu.is(":visible"))return;e.$node.removeClass(t.classNames.iconLoadingClass),e.items=n,h.create(e,t,!0),h.update(e,t),t.positionSubmenu.call(e.$node,e.$menu)}e.$node.addClass(t.classNames.iconLoadingClass),n.then(r.bind(this,e,t),i.bind(this,e,t))}};e.fn.contextMenu=function(t){var n=this,r=t;if(this.length>0)if(t===undefined)this.first().trigger("contextmenu");else if(t.x!==undefined&&t.y!==undefined)this.first().trigger(e.Event("contextmenu",{pageX:t.x,pageY:t.y,mouseButton:t.button}));else if(t==="hide"){var i=this.first().data("contextMenu")?this.first().data("contextMenu").$menu:null;i&&i.trigger("contextmenu:hide")}else t==="destroy"?e.contextMenu("destroy",{context:this}):e.isPlainObject(t)?(t.context=this,e.contextMenu("create",t)):t?this.removeClass("context-menu-disabled"):t||this.addClass("context-menu-disabled");else e.each(o,function(){this.selector===n.selector&&(r.data=this,e.extend(r.data,{trigger:"demand"}))}),c.contextmenu.call(r.target,r);return this},e.contextMenu=function(t,r){typeof t!="string"&&(r=t,t="create"),typeof r=="string"?r={selector:r}:r===undefined&&(r={});var u=e.extend(!0,{},a,r||{}),f=e(document),l=f,p=!1;!u.context||!u.context.length?u.context=document:(l=e(u.context).first(),u.context=l.get(0),p=!e(u.context).is(document));switch(t){case"create":if(!u.selector)throw new Error("No selector specified");if(u.selector.match(/.context-menu-(list|item|input)($|\s)/))throw new Error('Cannot bind to selector "'+u.selector+'" as it contains a reserved className');if(!u.build&&(!u.items||e.isEmptyObject(u.items)))throw new Error("No Items specified");i++,u.ns=".contextMenu"+i,p||(s[u.selector]=u.ns),o[u.ns]=u,u.trigger||(u.trigger="right");if(!n){var d=u.itemClickEvent==="click"?"click.contextMenu":"mouseup.contextMenu",v={"contextmenu:focus.contextMenu":c.focusItem,"contextmenu:blur.contextMenu":c.blurItem,"contextmenu.contextMenu":c.abortevent,"mouseenter.contextMenu":c.itemMouseenter,"mouseleave.contextMenu":c.itemMouseleave};v[d]=c.itemClick,f.on({"contextmenu:hide.contextMenu":c.hideMenu,"prevcommand.contextMenu":c.prevItem,"nextcommand.contextMenu":c.nextItem,"contextmenu.contextMenu":c.abortevent,"mouseenter.contextMenu":c.menuMouseenter,"mouseleave.contextMenu":c.menuMouseleave},".context-menu-list").on("mouseup.contextMenu",".context-menu-input",c.inputClick).on(v,".context-menu-item"),n=!0}l.on("contextmenu"+u.ns,u.selector,u,c.contextmenu),p&&l.on("remove"+u.ns,function(){e(this).contextMenu("destroy")});switch(u.trigger){case"hover":l.on("mouseenter"+u.ns,u.selector,u,c.mouseenter).on("mouseleave"+u.ns,u.selector,u,c.mouseleave);break;case"left":l.on("click"+u.ns,u.selector,u,c.click)}u.build||h.create(u);break;case"destroy":var m;if(p){var g=u.context;e.each(o,function(t,n){if(!n)return!0;if(!e(g).is(n.selector))return!0;m=e(".context-menu-list").filter(":visible"),m.length&&m.data().contextMenuRoot.$trigger.is(e(n.context).find(n.selector))&&m.trigger("contextmenu:hide",{force:!0});try{o[n.ns].$menu&&o[n.ns].$menu.remove(),delete o[n.ns]}catch(r){o[n.ns]=null}return e(n.context).off(n.ns),!0})}else if(!u.selector)f.off(".contextMenu .contextMenuAutoHide"),e.each(o,function(t,n){e(n.context).off(n.ns)}),s={},o={},i=0,n=!1,e("#context-menu-layer, .context-menu-list").remove();else if(s[u.selector]){m=e(".context-menu-list").filter(":visible"),m.length&&m.data().contextMenuRoot.$trigger.is(u.selector)&&m.trigger("contextmenu:hide",{force:!0});try{o[s[u.selector]].$menu&&o[s[u.selector]].$menu.remove(),delete o[s[u.selector]]}catch(y){o[s[u.selector]]=null}f.off(s[u.selector])}break;case"html5":(!e.support.htmlCommand&&!e.support.htmlMenuitem||typeof r=="boolean"&&r)&&e('menu[type="context"]').each(function(){this.id&&e.contextMenu({selector:"[contextmenu="+this.id+"]",items:e.contextMenu.fromMenu(this)})}).css("display","none");break;default:throw new Error('Unknown operation "'+t+'"')}return this},e.contextMenu.setInputValues=function(t,n){n===undefined&&(n={}),e.each(t.inputs,function(e,t){switch(t.type){case"text":case"textarea":t.value=n[e]||"";break;case"checkbox":t.selected=n[e]?!0:!1;break;case"radio":t.selected=(n[t.radio]||"")===t.value;break;case"select":t.selected=n[e]||""}})},e.contextMenu.getInputValues=function(t,n){return n===undefined&&(n={}),e.each(t.inputs,function(e,t){switch(t.type){case"text":case"textarea":case"select":n[e]=t.$input.val();break;case"checkbox":n[e]=t.$input.prop("checked");break;case"radio":t.$input.prop("checked")&&(n[t.radio]=t.value)}}),n},e.contextMenu.fromMenu=function(t){var n=e(t),r={};return v(r,n.children()),r},e.contextMenu.defaults=a,e.contextMenu.types=u,e.contextMenu.handle=c,e.contextMenu.op=h,e.contextMenu.menus=o});