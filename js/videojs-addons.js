/* Previous和Next按钮（需结合videojs-playlist使用） */
var Button = videojs.getComponent('Button');
var PrevButton = videojs.extend(Button, {
  constructor: function() {
    Button.apply(this, arguments);
    this.addClass('vjs-prev');
    this.controlText("Previous");
  },
  handleClick: function() {
    this.player().playlist.previous();
    this.player().play();
  }
});
var NextButton = videojs.extend(Button, {
  constructor: function() {
    Button.apply(this, arguments);
    this.addClass('vjs-next');
    this.controlText("Next");
  },
  handleClick: function() {
    this.player().playlist.next();
    this.player().play();
  }
});
videojs.registerComponent('NextButton', NextButton);
videojs.registerComponent('PrevButton', PrevButton);

/* 
Component: PlaylistMenuItem, PlaylistMenu
   Plugin: playlistUi
*/
var dom = videojs.dom || videojs;
var Component = videojs.getComponent('Component');

var PlaylistMenuItem = videojs.extend(Component, {
  constructor: function(player, playlistItem, options) {
    Component.call(this, player, playlistItem);
    this.item = playlistItem.item;
    this.playOnSelect = options.playOnSelect;

    this.emitTapEvents();
    this.on(['click', 'tap'], this.switchPlaylistItem_);
  },

  togglePlay: function() {
    if (this.player_.paused()) {
      this.player_.play();
    } else {
      this.player_.pause();
    }
  },

  switchPlaylistItem_: function(event) {
    if (this.player_.playlist.currentItem() === (this.item.playlistItemId_ - 1)) {
      this.togglePlay();
    } else {
      this.player_.playlist.currentItem(this.item.playlistItemId_ - 1);
      if (this.playOnSelect) {
        this.player_.play();
      }
    }
  },

  createEl: function() {
    var li = document.createElement('li');
    li.className = 'vjs-playlist-item';
    var item = this.options_.item;
    // current selected
    var current = document.createElement('span');
    current.className = 'vjs-playlist-current';
    li.appendChild(current);

    var index = document.createElement('span');
    index.className = 'vjs-playlist-index';
    index.appendChild(document.createTextNode(item.playlistItemId_));
    li.appendChild(index);

    var name = document.createElement('span');
    name.className = 'vjs-playlist-name';
    nameText = (item.author + ' - ' + item.title) || this.localize('Untitled Video');
    name.appendChild(document.createTextNode(nameText));
    li.appendChild(name);

    if (item.duration) {
      var duration = document.createElement('time');
      duration.className = 'vjs-playlist-duration';
      var time = item.duration;
      if (String(time).indexOf(':') == -1) {
        time = videojs.formatTime(time);
      }
      duration.appendChild(document.createTextNode(time));
      li.appendChild(duration);
    }
    return li;
  }
});

var PlaylistMenu = videojs.extend(Component, {
  constructor: function(player, options) {
    Component.call(this, player, options);
    this.items = [];
    this.init_();

    this.on(player, ['loadstart', 'playlistchange', 'playlistsorted'], (event) => {
      this.update();
    });

    this.on('dispose', () => {
      this.empty_();
      player.playlistMenu = null;
    });

    this.on(player, 'dispose', () => {
      this.dispose();
    });
  },

  createEl: function() {
    return dom.createEl('div', {className: this.options_.className});
  },

  init_: function() {
    var playlist = this.player_.playlist() || [];
    var list = document.createElement('ol');
    list.className = 'vjs-playlist-list';
    this.el_.appendChild(list);

    this.empty_();
    // create new items
    for (let i = 0; i < playlist.length; i++) {
      var item = new PlaylistMenuItem(this.player_, {
        item: playlist[i]
      }, this.options_);
      this.items.push(item);
      list.appendChild(item.el_);
    }
    if (this.items.length && selectedIndex >= 0) {
      // select the current playlist item
      var selectedIndex = this.player_.playlist.currentItem();
      this.addSelectedClass_(this.items[selectedIndex]);
    }
  },

  empty_: function() {
    if (this.items && this.items.length) {
      this.items.forEach(i => i.dispose());
      this.items.length = 0; // 清空列表
    }
  },

  addSelectedClass_: function(el) {
    el.addClass('vjs-selected');
  },

  removeSelectedClass_: function(el) {
    el.removeClass('vjs-selected');
  },

  update: function() {
    // replace the playlist items being displayed, if necessary
    var playlist = this.player_.playlist();

    if (this.items.length !== playlist.length) {
      // if the menu is currently empty or the state is obviously out
      // of date, rebuild everything.
      this.init_();
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].item !== playlist[i]) {
        // if any of the playlist items have changed, rebuild the
        // entire playlist
        this.init_();
        return;
      }
    }

    // the playlist itself is unchanged so just update the selection
    var currentItem = this.player_.playlist.currentItem();
    for (let i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (i === currentItem) {
        this.addSelectedClass_(item);
      } else {
        this.removeSelectedClass_(item);
      }
    }
  }
});

var playlistUi = function(options) {
  var player = this;
  if (!player.playlist) {
    throw new Error('videojs-playlist plugin is required by the videojs-playlist-ui plugin');
  }
  let defaults = {
    className: 'vjs-playlist',
    playOnSelect: true,
  };
  options = videojs.mergeOptions(defaults, options);

  if (!dom.isEl(options.el)) {
    options.el = document.querySelector('.' + options.className);
  }

  player.playlistMenu = new PlaylistMenu(player, options);
};

// register components
videojs.registerComponent('PlaylistMenu', PlaylistMenu);
videojs.registerComponent('PlaylistMenuItem', PlaylistMenuItem);
// register the plugin
videojs.registerPlugin('playlistUi', playlistUi);
