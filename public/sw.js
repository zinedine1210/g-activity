if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/6_5ZuDmYeLbwiRGp9sYSU/_buildManifest.js",revision:"a1c8135fad698d750b1acdd7a34cb31a"},{url:"/_next/static/6_5ZuDmYeLbwiRGp9sYSU/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/108-4bbf7c31836205e8.js",revision:"4bbf7c31836205e8"},{url:"/_next/static/chunks/183-90078228c8d4a25f.js",revision:"90078228c8d4a25f"},{url:"/_next/static/chunks/29107295-8619d3a1a46e5850.js",revision:"8619d3a1a46e5850"},{url:"/_next/static/chunks/328748d6-7b311de9a6cd5109.js",revision:"7b311de9a6cd5109"},{url:"/_next/static/chunks/360-110412dca4321236.js",revision:"110412dca4321236"},{url:"/_next/static/chunks/3a17f596-7a95303dd0690cb3.js",revision:"7a95303dd0690cb3"},{url:"/_next/static/chunks/424-7d965685207e6145.js",revision:"7d965685207e6145"},{url:"/_next/static/chunks/441-6564171ac9b3f20c.js",revision:"6564171ac9b3f20c"},{url:"/_next/static/chunks/473-f425bbe761984a53.js",revision:"f425bbe761984a53"},{url:"/_next/static/chunks/5d416436-aa1d18a1ff85133b.js",revision:"aa1d18a1ff85133b"},{url:"/_next/static/chunks/652-c70bedfff579ad2f.js",revision:"c70bedfff579ad2f"},{url:"/_next/static/chunks/664-638a51df518918e8.js",revision:"638a51df518918e8"},{url:"/_next/static/chunks/675-8a7bcb32c3fc768b.js",revision:"8a7bcb32c3fc768b"},{url:"/_next/static/chunks/93-66435715bca1fb14.js",revision:"66435715bca1fb14"},{url:"/_next/static/chunks/cb355538-753dc077e5130545.js",revision:"753dc077e5130545"},{url:"/_next/static/chunks/fc83e031-257b3ead1cc8c353.js",revision:"257b3ead1cc8c353"},{url:"/_next/static/chunks/framework-114634acb84f8baa.js",revision:"114634acb84f8baa"},{url:"/_next/static/chunks/main-d2e4fca3aba792c3.js",revision:"d2e4fca3aba792c3"},{url:"/_next/static/chunks/pages/_app-b08af31b8a827c9a.js",revision:"b08af31b8a827c9a"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/admin-a1e2f91d826753fd.js",revision:"a1e2f91d826753fd"},{url:"/_next/static/chunks/pages/admin/user-282ef660d2db8b4f.js",revision:"282ef660d2db8b4f"},{url:"/_next/static/chunks/pages/index-ffbeed3d1264cf72.js",revision:"ffbeed3d1264cf72"},{url:"/_next/static/chunks/pages/usr-043abb3c0b906d34.js",revision:"043abb3c0b906d34"},{url:"/_next/static/chunks/pages/usr/board-7cfbb66ac080472b.js",revision:"7cfbb66ac080472b"},{url:"/_next/static/chunks/pages/usr/documentation-106cf17c03c7eb72.js",revision:"106cf17c03c7eb72"},{url:"/_next/static/chunks/pages/usr/documentation/preview-7a08cbceae968ce3.js",revision:"7a08cbceae968ce3"},{url:"/_next/static/chunks/pages/usr/errorKnowledge-64b731fcb510cdcc.js",revision:"64b731fcb510cdcc"},{url:"/_next/static/chunks/pages/usr/mom-41dfaae1abf26834.js",revision:"41dfaae1abf26834"},{url:"/_next/static/chunks/pages/usr/note-f3cfbba7474406e6.js",revision:"f3cfbba7474406e6"},{url:"/_next/static/chunks/pages/usr/videoCall-2e31de714859c363.js",revision:"2e31de714859c363"},{url:"/_next/static/chunks/pages/usr/workspaces-a27c2290d8a2b7e5.js",revision:"a27c2290d8a2b7e5"},{url:"/_next/static/chunks/pages/usr/workspaces/%5Bname%5D-f4c053efb95f3175.js",revision:"f4c053efb95f3175"},{url:"/_next/static/chunks/pages/usr/workspaces/project/%5Bname%5D-59c7d26dce88d565.js",revision:"59c7d26dce88d565"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-38cee4c0e358b1a3.js",revision:"38cee4c0e358b1a3"},{url:"/_next/static/css/e890fbfda4c423e5.css",revision:"e890fbfda4c423e5"},{url:"/catatan.txt",revision:"cb9b2a74fe3ad57be54aed8c355e87a2"},{url:"/favicon.ico",revision:"e3029abdf85a74b5dc431379d5ff8b40"},{url:"/icongen/android-chrome-192x192.png",revision:"324079fb9b2196160a905a27f191991e"},{url:"/icongen/android-chrome-512x512.png",revision:"881f7325370c0903563279e6c99a9176"},{url:"/icongen/android-chrome-maskable-192x192.png",revision:"ad2813d13dd644a835f4c231daab350e"},{url:"/icongen/android-chrome-maskable-512x512.png",revision:"881f7325370c0903563279e6c99a9176"},{url:"/images/audio.png",revision:"946c8e5111853c16ca434cfe8046daf1"},{url:"/images/bookmark.png",revision:"82a15180036f9d30482d45eb8be4640f"},{url:"/images/bulletedlist.png",revision:"0e87e917fb1aa9f64e3721dbee58e39f"},{url:"/images/copy.png",revision:"7b4c39c4f2486c6caae609ee73fc5758"},{url:"/images/d1f066971350650d3346.svg",revision:"c7fb9b9f38050c51e1c1b57a26a2338a"},{url:"/images/divider.png",revision:"210d0fafecd29a9a60c483f58475febb"},{url:"/images/gnusa.png",revision:"324079fb9b2196160a905a27f191991e"},{url:"/images/h31.png",revision:"927f1c6a2af4bb6afc9c67a6f52130e6"},{url:"/images/header1.png",revision:"57a7576af10cfe813031b7c6fcf05791"},{url:"/images/header2.png",revision:"9aab47698fe625e400a64eae7e21a791"},{url:"/images/header3.png",revision:"d0ed0bb3314ac18ca071111711caa984"},{url:"/images/images.png",revision:"33d80a98626ab17c8f0ff69e61836148"},{url:"/images/link.png",revision:"dd415f7c68dea5acf4b05e58ecd0fb3b"},{url:"/images/numberedlist.png",revision:"0406affeb4898a38a88181493808dac9"},{url:"/images/paragraph.png",revision:"83b0bf317b78561f30eec6e6743cb63d"},{url:"/images/quote.png",revision:"b048df62edab3f8d11b97ccc011cf02e"},{url:"/images/smartfren.png",revision:"ae102df98046d4ed975fd1c8403bada2"},{url:"/images/text.png",revision:"9fdb530b1b92329127c3a2346908bb59"},{url:"/images/tip.png",revision:"b360b9b224652650234a9f8087f7bb56"},{url:"/images/tsel.png",revision:"2cccc092dc53d569ce6513cfc830f017"},{url:"/images/video.png",revision:"ceeec2c7f7c6a38b10a8d1b8137d3506"},{url:"/images/xl.png",revision:"c8f731e538dbacaf98cbc858ce1d0761"},{url:"/locales/en/common.json",revision:"fd3b93e72d8c33fae7fc5c11ef9c5579"},{url:"/locales/id/common.json",revision:"17b750c4bb4645d05edd9ac74c8bd8d7"},{url:"/manifest.json",revision:"ee523821dccb15e14cb202b347ea6332"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
