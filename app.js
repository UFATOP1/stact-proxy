/***************
 * node-unblocker: Web Proxy for evading firewalls and content filters,
 * similar to CGIProxy or PHProxy
 *
 *
 * This project is hosted on github:  https://github.com/nfriedly/node-unblocker
 *
 * By Nathan Friedly - http://nfriedly.com
 * Released under the terms of the GPL v3
 */

 var url = require('url');
 var querystring = require('querystring');
 var express = require('express');
 var unblocker = require('./lib/unblocker.js');
 var Transform = require('stream').Transform;
 
 var app = express();
 
 var google_analytics_id = "UA-195584948-1" || null;
 
 Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

let utm_medium = ['cpc', 'banner'];
let utm_campaign = ['ufax', 'ufatop1'];
let utm_term = ['ufatop1','แทงบอล','ผลบอล', 'พนันออนไลน์', 'แนวทาง', 'วิธีเล่นบอลสเต็ป', 'สูตรบอลสเต็ปวันนี้', 'สูตรบอลชุด', 'ทีเด็ดบอลสเต็ป', 'แจกสูตรบอลชุด', 'วิธีดูราคาบอล', 'วิธีดูราคาบอลที่ถูกต้อง','สอนดูตารางบอล','วิธีดูราคาบอลสูงต่ำ','เว็บแทงบอล','แทงบอลสเต็ป','วิธีแทงบอล','เว็บพนันบอล','แทงบอลไม่มีขั้นต่ำ','แทงบอลufabet','แทงบอลฟรีเครดิต','แทงบอลยังไง','พนันบอลดียังไง','ผลบอลเมื่อคืนนี้','ผลบอลย้อนหลัง','โปรแกรมบอล','เช็คผลบอลล่าสุด'];

 function addGa(html) {
     if (google_analytics_id) {
         var ga = [
             "<script type=\"text/javascript\">",
             "var _gaq = []; // overwrite the existing one, if any",
             "_gaq.push(['_setAccount', '" + google_analytics_id + "']);",
             "_gaq.push(['_trackPageview']);",
             "(function() {",
             "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
             "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
             "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
             "})();",
             "</script>"
             ].join("\n");
         html = html.replace("</body>", ga + "\n\n</body>");
         //console.log("RUN-HTML")
     }
     return html;
 }
 
 function googleAnalyticsMiddleware(data) {
     if (data.contentType == 'text/html') {
 
         // https://nodejs.org/api/stream.html#stream_transform
         data.stream = data.stream.pipe(new Transform({
             decodeStrings: false,
             transform: function(chunk, encoding, next) {
                 this.push(addGa(chunk.toString()));
                 next();
             }
             
         }));
         //console.log("RUN-PROXY")
        
     }
 }
 
 var unblockerConfig = {
     prefix: '/proxy/',
     responseMiddleware: [
         googleAnalyticsMiddleware
     ]
 };
 
 
 
 // this line must appear before any express.static calls (or anything else that sends responses)
 app.use(unblocker(unblockerConfig));
 
 // serve up static files *after* the proxy is run
 app.use('/', express.static(__dirname + './proxy/'));
 
 // this is for users who's form actually submitted due to JS being disabled or whatever
 app.get("/ufax", function(req, res) {
     // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
     // and redirect the user to /proxy/url
     console.log(req.headers)
     res.redirect(unblockerConfig.prefix + 'https://ufapro888s.co/?utm_source=google&utm_medium='+utm_medium.randomElement()+'&utm_campaign='+utm_campaign.randomElement()+'&utm_term='+utm_term.randomElement());
     
 });
 
 // for compatibility with gatlin and other servers, export the app rather than passing it directly to http.createServer
 module.exports = app;
 
