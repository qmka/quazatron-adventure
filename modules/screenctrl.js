import { USER_HAVE_ITEM } from './constants.js';
import { locations } from './gamedata.js';

// Возвращает текст, который выводится как описание локации
const makeLocation = (g) => {
    let description = "";

    // Берём из объекта с локациями описание текущей локации
    locations.forEach(e => {
        if (e.id === g.currentLocation) {
            description += e.desc;
        }
    })

    // Добавляем пояснение для особых игровых ситуаций
    if (g.flags.isLadderLeanToTree && g.currentLocation === 8) description += "<br>К дереву приставлена лестница.";
    if (g.currentLocation === 11 && g.flags.isDoorOpened) description += "<br>Дверь открыта.";
    if (g.currentLocation === 7 && !g.flags.isTrollKilled) description += "<br>Путь на восток преграждает толстый тролль.";
    if (g.currentLocation === 17 && !g.flags.isPortcullisOpened) description += "<br>Решётка опущена - не пройти.";
    if (g.currentLocation === 17 && g.flags.isPortcullisOpened) description += "<br>Решётка поднята к потолку.";
    if (g.currentLocation === 18 && g.flags.isTrapdoorOpened) description += "<br>В полу комнаты дыра, через которую можно спуститься вниз.";
    if (g.currentLocation === 18 && !g.flags.isTrapdoorOpened) description += "<br>В полу есть закрытый люк.";
    if (g.currentLocation === 23 && !g.flags.isWormKilled) description += "<br>Вход в южный тоннель преграждает огромный скальный червь.";
    if (g.currentLocation === 20 && !g.flags.isMonsterKilled) description += "<br>Северный проход охраняет страшный ледяной монстр.";
    if (g.currentLocation === 27 && !g.flags.isWitchKilled) description += "<br>В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";

    // Если в локации лежат предметы, то добавляем их список к описанию локации

    // Object.keys(quesArr).length

    description += "<br>";
    let itemsInLoc = "";

    // Не знаю, как для ассоциативного массива определить последний элемент, и для него выводить не запятую, а точку
    for (let key in g.itemPlaces) {
        if (g.itemPlaces[key] === g.currentLocation) {
                    itemsInLoc += `${key}, `;
            };
        }
    
    if (itemsInLoc !== "") {
        description += `<br>Здесь также есть: ${itemsInLoc}`;
    } 
    return description;
}

// Возвращает текст, который выводится разделе инвентаря
const makeInventory = (g) => {
    let inventoryText = "Инвентарь:<br><br>";
    let itemsInInventory = "";
    for (let key in g.itemPlaces) {
        if (g.itemPlaces[key] === USER_HAVE_ITEM) {
            itemsInInventory += `${key}<br>`;
        }
    }
    if (itemsInInventory !== "") {
        inventoryText += itemsInInventory;
    } else {
        inventoryText += "пусто";
    }

    return inventoryText;
}

// Формирует экран, который выдаётся пользователю после совершённого им действия
const makeScreen = (g, actionText) => {
    document.getElementById("screen").innerHTML = makeLocation(g);
    document.getElementById("right-sidebar").innerHTML = makeInventory(g);
    document.getElementById("image").innerHTML = `<img src="img/${locations[g.currentLocation].img}">`
    document.getElementById("action").innerHTML = actionText;
    document.getElementById("input-area").style.display = "block";
};

// Формирует статический экран, например, стартовый экран, экран победы в игре, экран game over и т.д.
const makeStaticScreen = (text, sidebar, action, image) => {
    document.getElementById("screen").innerHTML = text;
    document.getElementById("right-sidebar").innerHTML = sidebar;
    document.getElementById("image").innerHTML = image;
    document.getElementById("action").innerHTML = action;
    document.getElementById("input-area").style.display = "none";
}

export { makeScreen, makeStaticScreen };