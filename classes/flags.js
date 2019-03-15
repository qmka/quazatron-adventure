const Flags = {
    _flags: {},

    get(flag) {
        if (typeof flag === 'string') {
            if (flag in this._flags) {
                return this._flags[flag];
            }
        }
    },

    set(flag, value) {
        if (typeof flag === 'string') {
            if (flag in this._flags) {
                this._flags[flag] = value;
            }
        }
    },

    change(flag) {
        if (typeof flag === 'string') {
            if (flag in this._flags && typeof this._flags[flag] === 'boolean') {
                this._flags[flag] = !this._flags[flag];
            }
        }
    },

    init(initialState) {
        if (typeof initialState === 'object') {
            this._flags = Object.assign({}, initialState);
        }
    }
}

export default Flags