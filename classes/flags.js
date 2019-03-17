import {
    log
} from "../modules/utils.js";

const Flags = {
    _flags: {},

    get(flag) {
        if (flag in this._flags) {
            return this._flags[flag];
        } else {
            log(`Flags.get: флаг "${flag}" отсутствует в списке флагов игры.`);
        }
    },

    getAll() {
        return this._flags;
    },

    toggle(flag) {
        if (flag in this._flags) {
            this._flags[flag] = !this._flags[flag];
        } else {
            log(`Flags.toggle: флаг "${flag}" отсутствует в списке флагов игры.`);
        }
    },

    init(initialState) {
        if (initialState && Object.keys(initialState).length) {
            this._flags = Object.assign({}, initialState);
        } else {
            log('Flags.init: проверьте, что у вас задан объект с флагами игры.');
        }
    }
}

export default Flags