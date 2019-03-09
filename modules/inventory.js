import {
    vocabulary
} from './gamedata.js';

const inventory = {
    _inventory: [],

    addItem(itemId) {
        this._inventory.push(itemId)
    },

    removeItem(itemId) {
        this._inventory = this._inventory.filter((e) => e !== itemId);
    },

    isItemInInventory(itemId) {
        return this._inventory.includes(itemId);
    },

    getAllItems() {
        return this._inventory;
    },

    getItemsTextList() {
        const list =  this._inventory.map((item) => {
            return `<span class="inventory-item">${vocabulary.objects[item].name}</span>`
        }).join(', ').concat('.');
        return list === '.' ? "У меня ничего нет." : `У меня есть: ${list}`;
    },

    clear() {
        this._inventory = [];
    },
}

export {
    inventory
} 