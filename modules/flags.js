const Flags = {
    _flags: {},

    get(flag) {
        if (flag in this._flags) {
            return this._flags[flag];
        }
    },

    set(flag, value) {
        if (flag in this._flags) {
            this._flags[flag] = value;
        }
    },

    change(flag) {
        if (flag in this._flags && typeof flag === "boolean") {
            this._flags[flag] = !this._flags[flag];
        }
    },

    init(flags) {
        this._flags = Object.assign({}, flags);
    }
}

export default Flags