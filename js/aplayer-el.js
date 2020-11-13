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
        config[key] = (config[key] === 'true');
      }
    }
    if (config.lrcType) {
      config.lrcType = parseInt(config.lrcType);
    }
  }

  _loadAudios(config) {
    if (!config.audios) {
      return;
    }
    config.audio = eval(config.audios.replace(/'/g, "\"").replace(/\n/g, ""));
    config.audio.forEach((single) => {
      single.url = config.urlPrefix + single.url;
      single.cover = config.coverPrefix + single.cover;
      single.lrc = config.lrcPrefix + single.lrc;
    });
  }
}

if (window.customElements && !window.customElements.get('aplayer-js')) {
  window.APlayerElement = APlayerElement;
  window.customElements.define('aplayer-js', APlayerElement);
}
