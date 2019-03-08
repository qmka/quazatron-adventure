import {
    locations, vocabulary, inventory, encounters, state, gameDefaultTexts
} from './gamedata.js';
import{
    getFlag
} from './functions.js'

// Возвращает текст, который выводится как описание локации
const constructLocation = () => {
    let description = "";

    // Берём из объекта с локациями описание текущей локации
    locations.forEach((e) => {
        if (e.id === state.currentLocation) {
            description += e.desc;
        }
    })

    // Добавляем пояснение для особых игровых ситуаций
    description += encounters.addDescription();

    // Если в локации лежат предметы, то добавляем их список к описанию локации

    description += "<br>";
    let itemsArray = [];

    for (let key in state.itemPlaces) {
        if (state.itemPlaces[key] === state.currentLocation) {
            itemsArray.push(key);
        };
    }

    const itemsInLoc = itemsArray.map((item) => {
        return `<span class="inventory-item">${vocabulary.objects[item].name}</span>`
    }).join(', ').concat('.');

    if (itemsInLoc !== ".") {
        description += `<br>Здесь также есть: ${itemsInLoc}`;
    }
    return description;
}

// Возвращает текст, который выводится разделе инвентаря
const constructInventory = () => {
    let inventoryText = "Инвентарь:<br><br>";
    let itemsInInventory = "";

    inventory.getAllItems().forEach((item) => {
        itemsInInventory += `${vocabulary.objects[item].name}<br>`;
    })


    if (itemsInInventory) {
        inventoryText += itemsInInventory;
    } else {
        inventoryText += "пусто";
    }

    return inventoryText;
}

// Формирует экран, который выдаётся пользователю после совершённого им действия
const renderScreen = (actionText) => {
    document.getElementById("screen").innerHTML = constructLocation();
    document.getElementById("right-sidebar").innerHTML = constructInventory();
    document.getElementById("image").innerHTML = `<img src="img/${locations[state.currentLocation].img}">`
    document.getElementById("action").innerHTML = actionText;
    document.getElementById("input-area").style.opacity = 100;
};

// Формирует статический экран, например, стартовый экран, экран победы в игре, экран game over и т.д.
const renderStaticScreen = (text, sidebar, action, image) => {
    document.getElementById("screen").innerHTML = text;
    document.getElementById("right-sidebar").innerHTML = sidebar;
    document.getElementById("image").innerHTML = image;
    document.getElementById("action").innerHTML = action;
    document.getElementById("input-area").style.opacity = 0;
}

const renderStartScreen = () => {
    const text = 'Это стартовый текст в основной области экрана';
    const sidebar = 'Это текст в сайдбаре';
    const action = 'Нажмите ENTER для начала игры';
    const image = 'Здесь будет игровая картинка';
    renderStaticScreen(text, sidebar, action, image);
}

const renderVictoryScreen = () => {
    const text = 'Этот текст выводится, когда игрок побеждает';
    const sidebar = 'Это текст в сайдбаре';
    const action = 'Нажмите ENTER, если хотите начать сначала.';
    const image = 'Здесь будет игровая картинка';
    renderStaticScreen(text, sidebar, action, image);
}

const renderGameOverScreen = () => {
    let text;
    if (getFlag("isDiedFromFish")) {
        text = 'Я почувствовал острую боль в животе и умер. Глупо, конечно, заканчивать это приключение, отравившись протухшей рыбой.'
    } else {
        text = 'Ваша игра закончилась.';
    }

    const sidebar = 'Это текст в сайдбаре';
    const action = 'Нажмите ENTER, если хотите начать сначала.';
    const image = 'Здесь будет игровая картинка';
    renderStaticScreen(text, sidebar, action, image);
}

export {
    renderScreen,
    renderStartScreen,
    renderVictoryScreen,
    renderGameOverScreen
};