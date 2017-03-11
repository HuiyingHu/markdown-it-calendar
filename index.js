"use strict";function _interopRequireDefault(r){return r&&r.__esModule?r:{default:r}}var _assign=require("babel-runtime/core-js/object/assign"),_assign2=_interopRequireDefault(_assign),_calendar=require("./calendar"),_calendar2=_interopRequireDefault(_calendar);require("./calendar.css"),module.exports=function(r,e){function t(r){if(r=r.trim(),r=r.match(v)){var e=parseInt(r[1]),t=parseInt(r[2]);return e>=0&&e<=1e5&&t>=1&&t<=12}return!1}function n(r,e,t,n,a){var i=r[e].info;return'<div class="markdown-it-calendar">'+(0,_calendar2.default)(i)+"</div>"}function a(r){try{var e=new Date(r.year,r.month-1,r.date);return!!(r.year===e.getFullYear()&&r.month===e.getMonth()+1&&r.date===e.getDate())&&e}catch(r){return!1}return!1}function i(r,e,t,n){var a="]"===r[t-1];if(!a)return!1;if(!(a=r.substring(e,e+d.length)===d))return!1;if(!(a=n(r.substring(e+d.length,t-1))))return!1;var i=r.substring(e+d.length,t-1).trim().split(" ");return{year:parseInt(i[0]),month:parseInt(i[1])}}function u(r,e,t){return r.substring(e,t).trim()==p}function s(r,e,t,n){var i=r.substring(e,t).trim();try{var u=i.match(m),s=(0,_assign2.default)({},n);return s.date=parseInt(u[1]),a(s)}catch(r){return!1}return!1}function c(r,e,t){var n=r.substring(e,t).trim();try{var a=n.match(g);return{title:a[1],description:a[2]}}catch(r){return!1}return!1}function o(r,e){var t=r.push(e.type,e.tag||"div",e.nesting);return t.markup=e.markup||"",t.block=e.block||!0,t.content=e.content||"","info"in e&&(t.info=e.info),"map"in e&&(t.map=e.map),t}function l(r,e,t,n){var a=void 0,l=void 0,v=0,m=r.bMarks[e]+r.tShift[e],g=r.eMarks[e],b={Date:{},Content:{}},k=i(r.src,m,g,h);if(k===!1)return!1;if(n)return!0;for(b.Date=k,a=e+1;a<t;++a){m=r.bMarks[a]+r.tShift[a],g=r.eMarks[a];var _=s(r.src,m,g,k);if(_)l=_;else if(event=c(r.src,m,g),l&&event)b.Content[l]=b.Content[l]||[],b.Content[l].push(event);else if(r.src[m]===p[0]&&u(r.src,m,g)){v=1;break}}return r.line=a+v,o(r,{type:f,nesting:0,markup:d,info:b,map:[e,r.line],content:""}),!0}var f="calendar",d="#["+f+"=",p="#[/"+f+"]",v=/^(\d+)[ ]+(\d+)$/,m=/<!--\s*(\d+)\s*-->/,g=/@\[(.*?)\](.*)/;e=e||{};var h=e.validateParam||t;e.render;r.block.ruler.before("fence",f,l,{alt:["paragraph","blockquote","list"]}),r.renderer.rules[f]=n};