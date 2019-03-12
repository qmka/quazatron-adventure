const Flags = {
    _flags: {},

    get(flag) {
        return this._flags[flag];
    },

    set(flag) {
        this._flags[flag] = !this._flags[flag];
    },

    init(flags) {
        this._flags = Object.assign({}, flags);
    }
}

export {
    Flags
}