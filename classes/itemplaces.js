import {
    isNumber
} from '../modules/utils.js';

import {
    vocabulary, locations, defaultTexts
}  from '../modules/gamedata.js';

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

    getLocationItemsList(locationId) {
        if (isNumber(locationId) && locations[locationId]) {
            let itemsArray = [];
        
            for (let key in this._itemPlaces) {
                if (this._itemPlaces[key] === locationId) {
                    itemsArray.push(key);
                };
            }

            if (!itemsArray.length) {
                return ''
            }
        
            const itemsInLoc = itemsArray.map((item) => {
                return `<span class="location-item">${vocabulary.objects[item].name}</span>`
            }).join(', ').concat('.');
        
            return `<div class="new-paragraph">${defaultTexts.itemsInLocation} ${itemsInLoc}</div>`;
        }
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