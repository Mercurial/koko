export const Mode = {
  NORMAL: 0,
  INSERT: 1,
  SEARCH: 2,
  COMMAND: 3,
};

export default class ModeManager {
  constructor(initialMode) {
    this._mode = initialMode;
    this._onChange = null;

    this._attachHandler();
  }

  current() {
    return this._mode;
  }

  setMode(mode) {
    let previous = this._mode;
    this._mode = mode;
    setTimeout(this._onChange.bind(null, mode, previous), 0);
  }

  onChange(callback) {
    this._onChange = callback;
  }

  _attachHandler() {
    window.addEventListener('keydown', function (e) {
      let currentMode = this.current();
      if (currentMode === Mode.NORMAL) {
        if (e.which === 73 && !e.shiftKey) { // 'i'
          this.setMode(Mode.INSERT);
        } else if (e.which === 191 && !e.shiftKey) { // '/'
          this.setMode(Mode.SEARCH);
        } else if (e.which === 186 && e.shiftKey) { // ':'
          this.setMode(Mode.COMMAND);
        }
      } else if (currentMode === Mode.INSERT) {
        if (e.which === 27) { // 'esc'
          this.setMode(Mode.NORMAL);
        }
      } else if (currentMode === Mode.SEARCH) {
        if (e.which === 27) { // 'esc'
          this.setMode(Mode.NORMAL);
        } else if (e.which === 73 && !e.shiftKey) { // 'i'
          this.setMode(Mode.INSERT);
        }
      } else if (currentMode === Mode.COMMAND) {
        if (e.which === 27) { // 'esc'
          this.setMode(Mode.NORMAL);
        }
      }
    }.bind(this));
  }
}