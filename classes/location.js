import {
    locations
} from "../modules/gamedata.js";

import {
    isNumber
} from '../modules/utils.js';

const CurrentLocation = {
    get() {
        return this._location;
    },

    set(locationId) {
        if (isNumber(locationId) && locationId < locations.length) {
            this._location = locationId;
        }
    }
}

export default CurrentLocation