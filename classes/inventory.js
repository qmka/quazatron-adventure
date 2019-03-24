import objects from '../gamedata/objects.js';

import {
    isNumber, log
} from '../modules/utils.js';

const Inventory = {
    _inventory: [],

    addItem(itemId) {
        if (isNumber(itemId) && objects[itemId] && objects[itemId].canHold) {
            this._inventory.push(itemId);
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

    getItemsTextList() {
        if (!this._inventory.length) return "У меня ничего нет."; 
        const list = this._inventory.map((item) => {
            return `<span class="inventory-item">${objects[item].name}</span>`
        }).join(', ').concat('.');
        return `У меня есть: ${list}`;
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