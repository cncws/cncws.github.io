class VideoJSBilibiliEl extends HTMLElement {

  connectedCallback() {
    if (window.videojs && window.fetch) {
      this.videojs_el = document.createElement('video-js');
      this.videojs_el.classList.add('videojs-bilibili');
      this.appendChild(this.videojs_el);

      this.playlist_el = document.createElement('div');
      this.playlist_el.classList.add('vjs-playlist-wrap');
      this.appendChild(this.playlist_el);

      this._init();
    }
  }

  disconnectedCallback() {
    if (!this.lock && this.vplayer) {
      this.vplayer.dispose();
      delete this.vplayer;
    }
  }

  _camelize(str) {
    return str
      .replace(/^[_.\- ]+/, '')
      .toLowerCase()
      .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
  }

  _init() {
    let config = {};
    // 复制配置
    for (let i = 0; i < this.attributes.length; i += 1) {
      config[this._camelize(this.attributes[i].name)] = this.attributes[i].value;
    }
    this._initVPlayer();
    this._loadVideos(config);
    this.vplayer.playlistUi();
  }

  _initVPlayer() {
    let defaultOptions = {
      autoplay: false,
      controls: false,
      loop: false,
      muted: false,
      preload: 'auto',
      // poster: '',
      // sources: {},
      aspectRatio: '16:9',
      fluid: true,
      inactivityTimeout: 2000,
      liveui: false,
      fullscreen: { navigationUI: 'hide' },
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      plugins: {},
      children: {
        LoadingSpinner: {},
        BiliBigPlayButton: {},
        BiliTop: {},
        BiliControlBar: {}
      }
    };
    this.vplayer = videojs(this.videojs_el, defaultOptions, function() {
      this.volume(0.5);

      this.on(this.tech_, 'click', 
        videojs.getComponent('BiliPlayToggle').prototype.handleClick);
    });
  }

  _loadVideos(config) {
    if (!config.video) {
      return;
    }
    let folder = config.folder || '';
    let _video = config.video.split(';');
    let video = [];
    _video.forEach((i) => {
      let item = i.split(',');
      for (let i = 0; i < item.length; i++) {
        item[i] = item[i].trim();
      }

      let meta = {
        author: item[0],
        title: item[1],
        sources: [{
          src: folder + item[0] + " - " + item[1] + ".mp4",
          type: "video/mp4"
        }],
        duration: item[2]
      }
      video.push(meta);
    });
    this.vplayer.playlist(video);
  }
}

if (window.customElements && !window.customElements.get('videojs-bilibili')) {
  window.VideoJSBilibiliEl = VideoJSBilibiliEl;
  window.customElements.define('videojs-bilibili', VideoJSBilibiliEl);
}
