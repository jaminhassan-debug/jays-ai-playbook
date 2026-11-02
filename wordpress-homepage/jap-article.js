(function(){var n=document.querySelector(".jap-nav"),t=n&&n.querySelector(".jap-toggle");if(t)t.addEventListener("click",function(){var o=n.classList.toggle("open");t.setAttribute("aria-expanded",o?"true":"false");t.setAttribute("aria-label",o?"Close menu":"Open menu");});
var b=document.querySelector(".jap-body"),r=document.querySelector(".jap-read");if(b&&r){var w=(b.innerText||"").trim().split(/\s+/).length;r.textContent=Math.max(1,Math.round(w/220))+" min read";}
var here=location.pathname.replace(/\/$/,"");var cards=document.querySelectorAll(".jap-more .wp-block-post"),shown=0;cards.forEach(function(c){var a=c.querySelector(".wp-block-post-title a");if(shown>=3||(a&&a.pathname.replace(/\/$/,"")===here))c.remove();else shown++;});var m=document.querySelector(".jap-more");if(m&&!shown)m.remove();
/* structured data so search engines know this is an article by Jay */
function mt(k){var e=document.querySelector('meta[property="'+k+'"],meta[name="'+k+'"]');return e?e.getAttribute("content"):"";}
var h1=document.querySelector("h1");
if(h1&&mt("article:published_time")){var u=location.origin+location.pathname,site=location.origin+"/",hl=h1.textContent.trim();
var ld={"@context":"https://schema.org","@graph":[
{"@type":"BlogPosting","@id":u+"#article","headline":hl.slice(0,110),"description":mt("description"),"image":mt("og:image")||undefined,"datePublished":mt("article:published_time"),"dateModified":mt("article:modified_time")||mt("article:published_time"),"mainEntityOfPage":u,"inLanguage":"en-GB","author":{"@id":site+"#jay"},"publisher":{"@id":site+"#org"}},
{"@type":"Person","@id":site+"#jay","name":"Jay","url":site+"work-with-jay/","image":site+"wp-content/uploads/2026/10/jay-portrait.jpg","worksFor":{"@id":site+"#org"}},
{"@type":"Organization","@id":site+"#org","name":"Jay's AI Playbook","url":site},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":site},{"@type":"ListItem","position":2,"name":"Articles","item":site+"articles/"},{"@type":"ListItem","position":3,"name":hl}]}]};
var sc=document.createElement("script");sc.type="application/ld+json";sc.textContent=JSON.stringify(ld);document.head.appendChild(sc);}
})();