const ItemPlaces = {
    _itemPlaces: {},

    get(itemId) {
        return this._itemPlaces[itemId];
    },

    getAll() {
        return this._itemPlaces;
    },

    set(itemId, location) {
        this._itemPlaces[itemId] = location;
    },

    init(itemPlaces) {
        this._itemPlaces = Object.assign({}, itemPlaces);
    }
}

export {
    ItemPlaces
}