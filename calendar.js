"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var weeks=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months=["January","February","March","April","May","June","July","August","September","October","November","December"],createCalendarHTML=function(e){var t=e.Date.year,a=e.Date.month,r=new Date(t,a,0);r.setFullYear(t);var n=r.getDate();r.setDate(1);var l=r.getDay(),s=document.createElement("table"),c=document.createElement("th"),o=void 0,i=void 0;s.className="calendar table table-responsive container-fluid",s.setAttribute("year",t),s.setAttribute("month",a),o=s.insertRow(),o.appendChild(c),c.colSpan="7",c.className="calendar-title",c.innerHTML=months[parseInt(a)-1]+'<span class="calendar-title-year"> '+t+"</span>",o=s.insertRow();for(var d=0;d<7;++d)i=o.insertCell(),i.innerHTML=weeks[d],i.className="calendar-week";for(var u=0;u<l;++u)u%7==0&&(o=s.insertRow()),i=o.insertCell();for(var m=l;m<n+l;++m)!function(t){var a=document.createElement("p"),n=document.createElement("div"),c=(document.createElement("p"),t-l+1);t%7==0&&(o=s.insertRow()),i=o.insertCell(),i.className="calendar-day",r.setDate(c),a.innerHTML=c,a.className="calendar-date",i.appendChild(a),e.Content[r]&&e.Content[r].forEach(function(e,t){n.innerHTML+=e.title+":"+e.description+"<br>",n.className="tag",i.appendChild(n)})}(m);for(var p=n+l;p%7!=0;++p)i=o.insertCell();return s.outerHTML};exports.default=createCalendarHTML;