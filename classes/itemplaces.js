import {
    locations
} from "../modules/gamedata.js";

import {
    isNumber
} from '../modules/utils.js';

const ItemPlaces = {
    _itemPlaces: {},

    get(itemId) {
        if (itemId in this._itemPlaces) {
            return this._itemPlaces[itemId];
        }
    },

    getAll() {
        return this._itemPlaces;
    },

    set(itemId, locationId) {
        if (isNumber(locationId) && itemId in this._itemPlaces) {
            this._itemPlaces[itemId] = locationId;
        }
    },

    init(initialState) {
        if (initialState && Object.keys(initialState).length) {
            this._itemPlaces = Object.assign({}, initialState);
        }
    }
}

export default ItemPlaces