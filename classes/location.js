import { locations } from "../modules/gamedata.js";

const CurrentLocation = {
    get() {
        return this._location;
    },

    set(locationId) {
        if (typeof locationId === 'number' && locationId < locations.length) {
            this._location = locationId;
        }
    }
}

export default CurrentLocation