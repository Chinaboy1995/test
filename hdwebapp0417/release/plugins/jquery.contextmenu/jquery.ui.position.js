/*! jQuery UI - v1.12.1 - 2016-09-16
 * http://jqueryui.com
 * Includes: position.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

/*!
     * jQuery UI Position 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * http://api.jqueryui.com/position/
     */

(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){e.ui=e.ui||{};var t=e.ui.version="1.12.1";(function(){function l(e,t,n){return[parseFloat(e[0])*(a.test(e[0])?t/100:1),parseFloat(e[1])*(a.test(e[1])?n/100:1)]}function c(t,n){return parseInt(e.css(t,n),10)||0}function h(t){var n=t[0];return n.nodeType===9?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(n)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:n.preventDefault?{width:0,height:0,offset:{top:n.pageY,left:n.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}var t,n=Math.max,r=Math.abs,i=/left|center|right/,s=/top|center|bottom/,o=/[\+\-]\d+(\.[\d]+)?%?/,u=/^\w+/,a=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(t!==undefined)return t;var n,r,i=e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),s=i.children()[0];return e("body").append(i),n=s.offsetWidth,i.css("overflow","scroll"),r=s.offsetWidth,n===r&&(r=i[0].clientWidth),i.remove(),t=n-r},getScrollInfo:function(t){var n=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),r=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),i=n==="scroll"||n==="auto"&&t.width<t.element[0].scrollWidth,s=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;return{width:s?e.position.scrollbarWidth():0,height:i?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var n=e(t||window),r=e.isWindow(n[0]),i=!!n[0]&&n[0].nodeType===9,s=!r&&!i;return{element:n,isWindow:r,isDocument:i,offset:s?e(t).offset():{left:0,top:0},scrollLeft:n.scrollLeft(),scrollTop:n.scrollTop(),width:n.outerWidth(),height:n.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return f.apply(this,arguments);t=e.extend({},t);var a,p,d,v,m,g,y=e(t.of),b=e.position.getWithinInfo(t.within),w=e.position.getScrollInfo(b),E=(t.collision||"flip").split(" "),S={};return g=h(y),y[0].preventDefault&&(t.at="left top"),p=g.width,d=g.height,v=g.offset,m=e.extend({},v),e.each(["my","at"],function(){var e=(t[this]||"").split(" "),n,r;e.length===1&&(e=i.test(e[0])?e.concat(["center"]):s.test(e[0])?["center"].concat(e):["center","center"]),e[0]=i.test(e[0])?e[0]:"center",e[1]=s.test(e[1])?e[1]:"center",n=o.exec(e[0]),r=o.exec(e[1]),S[this]=[n?n[0]:0,r?r[0]:0],t[this]=[u.exec(e[0])[0],u.exec(e[1])[0]]}),E.length===1&&(E[1]=E[0]),t.at[0]==="right"?m.left+=p:t.at[0]==="center"&&(m.left+=p/2),t.at[1]==="bottom"?m.top+=d:t.at[1]==="center"&&(m.top+=d/2),a=l(S.at,p,d),m.left+=a[0],m.top+=a[1],this.each(function(){var i,s,o=e(this),u=o.outerWidth(),f=o.outerHeight(),h=c(this,"marginLeft"),g=c(this,"marginTop"),x=u+h+c(this,"marginRight")+w.width,T=f+g+c(this,"marginBottom")+w.height,N=e.extend({},m),C=l(S.my,o.outerWidth(),o.outerHeight());t.my[0]==="right"?N.left-=u:t.my[0]==="center"&&(N.left-=u/2),t.my[1]==="bottom"?N.top-=f:t.my[1]==="center"&&(N.top-=f/2),N.left+=C[0],N.top+=C[1],i={marginLeft:h,marginTop:g},e.each(["left","top"],function(n,r){e.ui.position[E[n]]&&e.ui.position[E[n]][r](N,{targetWidth:p,targetHeight:d,elemWidth:u,elemHeight:f,collisionPosition:i,collisionWidth:x,collisionHeight:T,offset:[a[0]+C[0],a[1]+C[1]],my:t.my,at:t.at,within:b,elem:o})}),t.using&&(s=function(e){var i=v.left-N.left,s=i+p-u,a=v.top-N.top,l=a+d-f,c={target:{element:y,left:v.left,top:v.top,width:p,height:d},element:{element:o,left:N.left,top:N.top,width:u,height:f},horizontal:s<0?"left":i>0?"right":"center",vertical:l<0?"top":a>0?"bottom":"middle"};p<u&&r(i+s)<p&&(c.horizontal="center"),d<f&&r(a+l)<d&&(c.vertical="middle"),n(r(i),r(s))>n(r(a),r(l))?c.important="horizontal":c.important="vertical",t.using.call(this,e,c)}),o.offset(e.extend(N,{using:s}))})},e.ui.position={fit:{left:function(e,t){var r=t.within,i=r.isWindow?r.scrollLeft:r.offset.left,s=r.width,o=e.left-t.collisionPosition.marginLeft,u=i-o,a=o+t.collisionWidth-s-i,f;t.collisionWidth>s?u>0&&a<=0?(f=e.left+u+t.collisionWidth-s-i,e.left+=u-f):a>0&&u<=0?e.left=i:u>a?e.left=i+s-t.collisionWidth:e.left=i:u>0?e.left+=u:a>0?e.left-=a:e.left=n(e.left-o,e.left)},top:function(e,t){var r=t.within,i=r.isWindow?r.scrollTop:r.offset.top,s=t.within.height,o=e.top-t.collisionPosition.marginTop,u=i-o,a=o+t.collisionHeight-s-i,f;t.collisionHeight>s?u>0&&a<=0?(f=e.top+u+t.collisionHeight-s-i,e.top+=u-f):a>0&&u<=0?e.top=i:u>a?e.top=i+s-t.collisionHeight:e.top=i:u>0?e.top+=u:a>0?e.top-=a:e.top=n(e.top-o,e.top)}},flip:{left:function(e,t){var n=t.within,i=n.offset.left+n.scrollLeft,s=n.width,o=n.isWindow?n.scrollLeft:n.offset.left,u=e.left-t.collisionPosition.marginLeft,a=u-o,f=u+t.collisionWidth-s-o,l=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,c=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,h=-2*t.offset[0],p,d;if(a<0){p=e.left+l+c+h+t.collisionWidth-s-i;if(p<0||p<r(a))e.left+=l+c+h}else if(f>0){d=e.left-t.collisionPosition.marginLeft+l+c+h-o;if(d>0||r(d)<f)e.left+=l+c+h}},top:function(e,t){var n=t.within,i=n.offset.top+n.scrollTop,s=n.height,o=n.isWindow?n.scrollTop:n.offset.top,u=e.top-t.collisionPosition.marginTop,a=u-o,f=u+t.collisionHeight-s-o,l=t.my[1]==="top",c=l?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,h=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,p=-2*t.offset[1],d,v;if(a<0){v=e.top+c+h+p+t.collisionHeight-s-i;if(v<0||v<r(a))e.top+=c+h+p}else if(f>0){d=e.top-t.collisionPosition.marginTop+c+h+p-o;if(d>0||r(d)<f)e.top+=c+h+p}}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}}})();var n=e.ui.position});