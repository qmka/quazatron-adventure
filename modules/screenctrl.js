import {
    locations, vocabulary, encounters, state, gameDefaultTexts
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

// Формирует экран, который выдаётся пользователю после совершённого им действия
const renderScreen = (actionText) => {
    document.getElementById("screen").innerHTML = constructLocation();
    document.getElementById("image").innerHTML = `<img src="img/${locations[state.currentLocation].img}">`
    document.getElementById("action").innerHTML = actionText;
    document.getElementById("input-area").style.opacity = 100;
};

// Формирует статический экран, например, стартовый экран, экран победы в игре, экран game over и т.д.
const renderStaticScreen = (text, action, image) => {
    document.getElementById("screen").innerHTML = text;
    document.getElementById("image").innerHTML = image;
    document.getElementById("action").innerHTML = action;
    document.getElementById("input-area").style.opacity = 0;
}

// Формирует стартовый экран
const renderStartScreen = () => {
    const text = gameDefaultTexts.startMainText;
    const action = 'Нажмите ENTER для начала игры';
    const image = '<img src="img/startscreen.png">';

    renderStaticScreen(text, action, image);
}

// Формирует экран, выводящийся при победе в игре
const renderVictoryScreen = () => {
    const text = 'Этот текст выводится, когда игрок побеждает';
    const action = 'Нажмите ENTER, если хотите начать сначала.';
    const image = 'Здесь будет игровая картинка';

    renderStaticScreen(text, action, image);
}

// Формирует экран, выводящийся при выходе из игры или при поражении
const renderGameOverScreen = () => {
    const action = 'Нажмите ENTER, если хотите начать сначала.';
    const image = 'Здесь будет игровая картинка';
    let text;

    if (getFlag("isDiedFromFish")) {
        text = 'Я почувствовал острую боль в животе и умер. Глупо, конечно, заканчивать это приключение, отравившись протухшей рыбой.'
    } else {
        text = 'Ваша игра закончилась.';
    }

    renderStaticScreen(text, action, image);
}

export {
    renderScreen,
    renderStartScreen,
    renderVictoryScreen,
    renderGameOverScreen
};