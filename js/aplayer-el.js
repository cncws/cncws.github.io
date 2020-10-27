class APlayerElement extends HTMLElement {

  connectedCallback() {
    if (window.APlayer && window.fetch) {
      this._init();
    }
  }

  disconnectedCallback() {
    if (!this.lock && this.aplayer) {
      this.aplayer.list.clear();
      this.aplayer.destroy();
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
    // 设置容器
    if (!config.container) {
      let div = document.createElement('div');
      config.container = div;
      this.appendChild(div);
    } else {
      let div = document.getElementById(config.container);
      config.container = div;
    }
    this._loadAudios(config);
    this._convertType(config);

    this.aplayer = new APlayer(config);
  }

  _convertType(config) {
    for (let key in config) {
      if (config[key] === 'true' || config[key] === 'false') {
        config[key] = (config[key] === 'true')
      }
    }
    if (config.lrcType) {
      config.lrcType = parseInt(config.lrcType);
    }
  }

  _loadAudios(config) {
    if (!config.audio) {
      return;
    }
    let folder = '';
    if (config.folder) {
      folder = config.folder;
      delete config.folder;
    }
    let parseOrder = ["artist", "name", "cover", "lrc", "theme"];
    let audio = config.audio.split(';');
    let _audio = [];
    audio.forEach((single) => {
      single = single.split(',');
      let s = {};
      for (let i = 0; i < single.length; i++) {
        s[parseOrder[i]] = single[i].trim();
      }
      s.name = s.name || '';
      s.artist = s.artist || '';
      s.url = folder + s.artist + ' - ' + s.name + '.mp3';
      if (s.cover === '-') {
        s.cover = folder + 'cover/' + s.artist + ' - ' + s.name + '.jpg';
      }
      if (s.lrc === '-') {
        s.lrc = folder + 'lyric/' + s.artist + ' - ' + s.name + '.lrc';
      }
      _audio.push(s);
    });
    config.audio = _audio;
  }
}

if (window.customElements && !window.customElements.get('aplayer-js')) {
  window.APlayerElement = APlayerElement;
  window.customElements.define('aplayer-js', APlayerElement);
}
