import {
    state, inventory
} from './gamedata.js';

// Функции для манипуляций с игровыми данными
// Возвращает текущую локацию
const getCurrentLocation = () => {
    return state.currentLocation;
}

// Перемещает игрока в другую локацию
const setCurrentLocation = (location) => {
    state.currentLocation = location;
}

// Возвращает номер локации, в которой находится предмет
const getItemPlace = (item) => {
    return state.itemPlaces[item];
}

// Помещает предмет в локацию
const setItemPlace = (item, location) => {
    state.itemPlaces[item] = location;
}

// Возвращает игровой флаг
const getFlag = (flag) => {
    return state.flags[flag];
}

// Переключает игровой флаг
const setFlag = (flag) => {
    state.flags[flag] = state.flags[flag] === true ? false : true;
}

// Возвращает true, если предмет находится в инвентаре
const isItemInInventory = (item) => {
    return inventory.isItemInInventory(item);
}

// Добавляет предмет в инвентарь
const addItemToInventory = (item) => {
    inventory.addItem(item);
}

// Удаляет предмет из инвентаря
const removeItemFromInventory = (item) => {
    inventory.removeItem(item);
}

export {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    getFlag,
    setFlag,
    isItemInInventory,
    addItemToInventory,
    removeItemFromInventory
};