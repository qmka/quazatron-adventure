import {
    state
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
const getItemPlace = (itemId) => {
    return state.itemPlaces[itemId];
}

// Помещает предмет в локацию
const setItemPlace = (itemId, location) => {
    state.itemPlaces[itemId] = location;
}

// Возвращает игровой флаг
const getFlag = (flag) => {
    return state.flags[flag];
}

// Переключает игровой флаг
const setFlag = (flag) => {
    state.flags[flag] = !state.flags[flag];
}

export {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    getFlag,
    setFlag
};