const Flags = {
    _flags: {},

    get(flag) {
        if (flag in this._flags) {
            return this._flags[flag];
        }
    },

    getAll() {
        return this._flags;
    },

    toggle(flag) {
        if (flag in this._flags) {
            this._flags[flag] = !this._flags[flag];
        }
    },

    init(initialState) {
        if (initialState && Object.keys(initialState).length) {
            this._flags = Object.assign({}, initialState);
        }
    }
}

export default Flags