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

/* free prompt library sign-up: stores in Supabase via the subscribe function, then shows the download */
var SUB_URL="https://btmzvseggcvqiogwheky.supabase.co/functions/v1/subscribe";
document.querySelectorAll("form[data-jap-sub]").forEach(function(f){
var msg=f.querySelector(".jap-sub-msg"),btn=f.querySelector("button");
function say(t,err){msg.textContent=t;msg.className="jap-sub-msg"+(err?" err":"");}
f.addEventListener("submit",function(e){e.preventDefault();
var em=f.email.value.trim(),nm=f.first_name.value.trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){say("Please enter a valid email address.",1);f.email.focus();return;}
if(!f.consent.checked){say("Please tick the box so I can email you the prompts.",1);f.consent.focus();return;}
btn.disabled=true;say("Sending…");
fetch(SUB_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,first_name:nm,consent:true,consent_text:f.querySelector(".jap-consent span").textContent.trim(),hp:f.hp.value,source:f.dataset.japSub||"article",page:location.pathname})})
.then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
.then(function(x){if(!x.ok||!x.j.ok){btn.disabled=false;say(x.j.error==="slow-down"?"Too many tries. Please wait a little and try again.":x.j.error==="bad-email"?"Please check your email address.":"Sorry, that didn't work. Please try again.",1);return;}
var d=document.createElement("div");d.className="jap-sub-done";d.setAttribute("role","status");
var p1=document.createElement("p");p1.textContent=(nm?"Thanks, "+nm+"! ":"Thanks! ")+"Your prompt library is ready.";
var p2=document.createElement("p");var a=document.createElement("a");a.className="jap-btn jap-btn-primary";a.href=x.j.download;a.textContent="Download the prompt library";p2.appendChild(a);
var p3=document.createElement("p");p3.textContent=x.j.emailed?"I've also emailed you a copy, so you can find it later.":"Save the file somewhere handy so you can come back to it.";
d.append(p1,p2,p3);f.replaceWith(d);a.focus();
try{if(window.gtag)gtag("event","sign_up",{method:"prompt_library"});}catch(_){}})
.catch(function(){btn.disabled=false;say("Sorry, that didn't work. Please check your connection and try again.",1);});});});
})();