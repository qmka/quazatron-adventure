import objects from '../gamedata/objects.js';

import {
    isNumber, log
} from '../modules/utils.js';

const Inventory = {
    _inventory: [],

    addItem(itemId) {
        if (isNumber(itemId) && objects[itemId] && objects[itemId].canHold) {
            this._inventory.push(parseInt(itemId));
        } else {
            log(`Inventory.addItem: передаётся некорректный id предмета: ${itemId}.`);
        }
    },

    removeItem(itemId) {
        if (isNumber(itemId) && objects[itemId] && this._inventory.includes(itemId)) {
            this._inventory = this._inventory.filter((e) => e !== itemId);
        } else {
            log(`Inventory.removeItem: передаётся некорректный id предмета: ${itemId}.`);
        }
    },

    includes(itemId) {
        return this._inventory.includes(itemId);
    },

    getAll() {
        return this._inventory;
    },

    getItemsString(itemsArray, foreword, noItemsText) {
        if (!itemsArray.length) return noItemsText; 
        const list = itemsArray.map((item) => {
            return `<span class="inventory-item">${objects[item].name}</span>`
        }).join(', ').concat('.');
        return `${foreword} ${list}`;
    },

    clear() {
        this._inventory = [];
    },

    init(itemsArray) {
        if (Array.isArray(itemsArray)) {
            this._inventory = [].concat(itemsArray);
        } else {
            log('Inventory.init: для инициализации инвентаря используйте массив с ID предметов.');
        }
    }
}

export default Inventory