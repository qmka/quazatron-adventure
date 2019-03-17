import vocabulary from '../gamedata/vocabulary.js';
import locations from '../gamedata/locations.js';

import {
    defaultTexts
} from '../gamedata/default-data.js';

import {
    isNumber,
    log
} from '../modules/utils.js';

const ItemPlaces = {
    _itemPlaces: {},

    get(itemId) {
        if (itemId in this._itemPlaces) {
            return this._itemPlaces[itemId];
        } else {
            log(`ItemPlaces.get: предмет с ID ${itemId} отсутствует в объекте itemPlaces.`);
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
        } else {
            log(`ItemPlaces.getLocationItemsList: передаётся некорректный ID локации: ${locationId}.`);
        }
    },

    set(itemId, locationId) {
        if (isNumber(locationId) && itemId in this._itemPlaces) {
            this._itemPlaces[itemId] = locationId;
        } else {
            log(`ItemPlaces.set: проверьте, корректно ли задан ID локации и ID предмета.`);
        }
    },

    init(initialState) {
        if (initialState && Object.keys(initialState).length) {
            this._itemPlaces = Object.assign({}, initialState);
        } else {
            log(`ItemPlaces.init: проверьте объект, который вы используете для определения начального местоположения предметов.`);
        }
    }
}

export default ItemPlaces