class VideoJSBilibiliEl extends HTMLElement{connectedCallback(){window.videojs&&window.fetch&&(this.videojs_el=document.createElement("video-js"),this.videojs_el.classList.add("videojs-bilibili"),this.appendChild(this.videojs_el),this.playlist_el=document.createElement("div"),this.playlist_el.classList.add("vjs-playlist-wrap"),this.appendChild(this.playlist_el),this._init())}disconnectedCallback(){!this.lock&&this.vplayer&&(this.vplayer.dispose(),delete this.vplayer)}_camelize(i){return i.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,(i,e)=>e.toUpperCase())}_init(){let i={};for(let e=0;e<this.attributes.length;e+=1)i[this._camelize(this.attributes[e].name)]=this.attributes[e].value;this._initVPlayer(),this._loadVideos(i),this.vplayer.playlistUi()}_initVPlayer(){this.vplayer=videojs(this.videojs_el,{autoplay:!1,controls:!1,loop:!1,muted:!1,preload:"auto",aspectRatio:"16:9",fluid:!0,inactivityTimeout:2e3,liveui:!1,fullscreen:{navigationUI:"hide"},playbackRates:[.5,.75,1,1.25,1.5,2],plugins:{},children:{LoadingSpinner:{},BiliBigPlayButton:{},BiliTop:{},BiliControlBar:{}}},(function(){this.on(this.tech_,"click",videojs.getComponent("BiliPlayToggle").prototype.handleClick)}))}_loadVideos(i){if(!i.video)return;let e=i.folder||"",t=i.video.split(";"),l=[];t.forEach(i=>{let t=i.split(",");for(let i=0;i<t.length;i++)t[i]=t[i].trim();let s={author:t[0],title:t[1],sources:[{src:e+t[0]+" - "+t[1]+".mp4",type:"video/mp4"}],duration:t[2]};l.push(s)}),this.vplayer.playlist(l)}}window.customElements&&!window.customElements.get("videojs-bilibili")&&(window.VideoJSBilibiliEl=VideoJSBilibiliEl,window.customElements.define("videojs-bilibili",VideoJSBilibiliEl));