import {
    vocabulary
} from '../modules/gamedata.js';

const Inventory = {
    _inventory: [],

    addItem(itemId) {
        if (typeof itemId === 'number') {
            if (itemId < vocabulary.objects.length) {
                if (vocabulary.objects[itemId].canHold === true) {
                    this._inventory.push(itemId);
                }
            }
        }
    },

    removeItem(itemId) {
        if (typeof itemId === 'number') {
            if (itemId < vocabulary.objects.length) {
                if (this._inventory.includes(itemId)) {
                    this._inventory = this._inventory.filter((e) => e !== itemId);
                }
            }
        }
    },

    isItemInInventory(itemId) {
        if (typeof itemId === 'number') {
            return this._inventory.includes(itemId);
        }
    },

    getAll() {
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

    init(itemsArray) {
        if (typeof itemsArray === 'object' || typeof itemsArray === 'array') {
            this._inventory = itemsArray;
        }
    }
}

export default Inventory