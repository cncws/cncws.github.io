var Affix={init:function(t,e){this.element=t,this.offset=e||0,this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition(),window.addEventListener("scroll",this.checkPosition.bind(this)),window.addEventListener("click",this.checkPositionWithEventLoop.bind(this)),window.matchMedia("(min-width: 992px)").addListener(t=>{t.matches&&(this.offset=NexT.utils.getAffixParam(),this.checkPosition())})},getState:function(t,e,i,n){let o=window.scrollY,s=window.innerHeight;if(null!=i&&"top"===this.affixed)return o<i&&"top";if("bottom"===this.affixed)return null!=i?!(this.unpin<=this.element.getBoundingClientRect().top)&&"bottom":!(o+s<=t-n)&&"bottom";let f=null===this.affixed,l=f?o:this.element.getBoundingClientRect().top+o;return null!=i&&o<=i?"top":null!=n&&l+(f?s:e)>=t-n&&"bottom"},getPinnedOffset:function(){return this.pinnedOffset?this.pinnedOffset:(this.element.classList.remove("affix-top","affix-bottom"),this.element.classList.add("affix"),this.pinnedOffset=this.element.getBoundingClientRect().top)},checkPositionWithEventLoop(){setTimeout(this.checkPosition.bind(this),1)},checkPosition:function(){if("none"===window.getComputedStyle(this.element).display)return;let t=this.element.offsetHeight-2*CONFIG.sidebar.padding,e=this.offset,i=e.top,n=e.bottom,o=document.body.scrollHeight,s=this.getState(o,t,i,n);if(this.affixed!==s){null!=this.unpin&&(this.element.style.top="");let t="affix"+(s?"-"+s:"");this.affixed=s,this.unpin="bottom"===s?this.getPinnedOffset():null,this.element.classList.remove("affix","affix-top","affix-bottom"),this.element.classList.add(t)}"bottom"===s&&(this.element.style.top=o-t-n+"px")}};NexT.utils.getAffixParam=function(){const t=CONFIG.sidebar.offset||12;let e=document.querySelector(".header-inner").offsetHeight+t,i=document.querySelector(".footer"),n=document.querySelector(".footer-inner"),o=i.offsetHeight-n.offsetHeight,s=i.offsetHeight+o;return document.querySelector(".sidebar").style.marginTop=e+"px",{top:e-t,bottom:s}},window.addEventListener("DOMContentLoaded",()=>{Affix.init(document.querySelector(".sidebar-inner"),NexT.utils.getAffixParam())});