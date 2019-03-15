import { locations } from "../modules/gamedata.js";

const ItemPlaces = {
    _itemPlaces: {},

    get(itemId) {
        if (typeof itemId === 'number' && itemId in this._itemPlaces) {
            return this._itemPlaces[itemId];
        }
    },

    getAll() {
        return this._itemPlaces;
    },

    set(itemId, location) {
        if (typeof itemId === 'number' && itemId in this._itemPlaces && location < locations.length) {
            this._itemPlaces[itemId] = location;
        }
    },

    init(initialState) {
        if (typeof initialState === 'object') {
            this._itemPlaces = Object.assign({}, initialState);
        }
    }
}

export default ItemPlaces