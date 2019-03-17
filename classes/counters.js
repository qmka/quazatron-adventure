import {
    log, isNumber
} from "../modules/utils.js";

const Counters = {
    _counters: {},

    get(counter) {
        if (counter in this._counters) {
            return this._counters[counter];
        } else {
            log(`Counters.get: счётчик "${counter}" отсутствует в списке счётчиков игры.`);
        }
    },

    getAll() {
        return this._counters;
    },

    set(counter, value) {
        if (counter in this._counters && isNumber(value)) {
            this._counters[counter] = value;
        } else {
            log(`Counters.set: проверьте значения "${counter}" и "${value}", передаваемые в функцию.`);
        }
    },

    increase(counter) {
        if (counter in this._counters) {
            this._counters[counter] += 1;
        } else {
            log(`Counters.increase: счётчик "${counter}" отсутствует в списке счётчиков игры.`);
        }
    },

    decrease(counter) {
        if (counter in this._counters) {
            this._counters[counter] -= 1;
        } else {
            log(`Counters.increase: счётчик "${counter}" отсутствует в списке счётчиков игры.`);
        }
    },

    init(initialState) {
        if (initialState && Object.keys(initialState).length) {
            this._counters = Object.assign({}, initialState);
        } else {
            log('Counters.init: проверьте, что у вас задан объект со счётчиками игры.');
        }
    }
}

export default Counters