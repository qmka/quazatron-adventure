const Command = {
  _lastCommand: {},

  get() {
    if (this._lastCommand.length === 0) return -1;
    return this._lastCommand;
  },

  set(command) {
    this._lastCommand = Object.assign({}, command);
  },

  clear() {
    this._lastCommand.length = 0;
  }
};

export default Command;