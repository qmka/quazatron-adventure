import {
    locations
} from "../modules/gamedata.js";

import {
    isNumber, log
} from '../modules/utils.js';

const CurrentLocation = {
    get() {
        return this._location;
    },

    set(locationId) {
        if (isNumber(locationId) && locations[locationId]) {
            this._location = locationId;
        } else {
            log(`Location.set: передаётся некорректный номер локации: ${locationId}.`);
        }
    }
}

export default CurrentLocation