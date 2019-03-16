import {
    vocabulary
} from '../modules/gamedata.js';

import {
    isNumber
} from '../modules/utils.js';

const Inventory = {
    _inventory: [],

    addItem(itemId) {
        if (isNumber(itemId) && vocabulary.objects[itemId] && vocabulary.objects[itemId].canHold) {
            this._inventory.push(itemId);
        }
    },

    removeItem(itemId) {
        if (isNumber(itemId) && vocabulary.objects[itemId] && this._inventory.includes(itemId)) {
            this._inventory = this._inventory.filter((e) => e !== itemId);
        }
    },

    includes(itemId) {
        return this._inventory.includes(itemId);
    },

    getAll() {
        return this._inventory;
    },

    getItemsTextList() {
        if (!this._inventory.length) return "У меня ничего нет."; 
        const list = this._inventory.map((item) => {
            return `<span class="inventory-item">${vocabulary.objects[item].name}</span>`
        }).join(', ').concat('.');
        return `У меня есть: ${list}`;
    },

    clear() {
        this._inventory = [];
    },

    init(itemsArray) {
        if (Array.isArray(itemsArray)) {
            this._inventory = itemsArray;
        }
    }
}

export default Inventory