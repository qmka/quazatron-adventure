import {
    locations, vocabulary, encounters, gameDefaultTexts, gameDefaultImages
} from './gamedata.js';

import {
    Location as location
} from './location.js'

import {
    ItemPlaces as itemPlaces
} from './itemplaces.js'

// Возвращает текст, который выводится как описание локации
const constructLocation = () => {
    let description = "";

    // Берём из объекта с локациями описание текущей локации
    locations.forEach((e) => {
        if (e.id === location.get()) {
            description += e.desc;
        }
    })

    // Добавляем пояснение для особых игровых ситуаций
    description += encounters.addDescription();

    // Если в локации лежат предметы, то добавляем их список к описанию локации
    const allItemPlaces = itemPlaces.getAll();
    let itemsArray = [];

    for (let key in allItemPlaces) {
        if (allItemPlaces[key] === location.get()) {
            itemsArray.push(key);
        };
    }

    const itemsInLoc = itemsArray.map((item) => {
        return `<span class="inventory-item">${vocabulary.objects[item].name}</span>`
    }).join(', ').concat('.');

    if (itemsArray.length) {
        description += `<br><br>${gameDefaultTexts.itemsInLocation} ${itemsInLoc}`;
    }

    return description;
}

const renderScreen = (mainText, image, actionText, isInputAreaVisible) => {
    document.getElementById("screen").innerHTML = mainText;
    document.getElementById("image").innerHTML = image;
    document.getElementById("action").innerHTML = actionText;
    document.getElementById("input-area").style.opacity = isInputAreaVisible ? 100 : 0;
}

// Формирует экран, который выдаётся пользователю после совершённого им действия
const renderGameScreen = (actionText) => {
    const imageTag = `<img src="img/${locations[location.get()].img}">`;
    renderScreen(constructLocation(), imageTag, actionText, true)
};

// Формирует статический экран, например, стартовый экран, экран победы в игре, экран game over и т.д.
const renderNonGameScreen = (type) => {
    let text, image, action;
    switch(type) {
        case "start":
            text = gameDefaultTexts.startMainText;
            action = gameDefaultTexts.pressEnterToStart;
            image = gameDefaultImages.startImage;
            break;
        case "gameover":
            text = encounters.getGameOverText();
            action = gameDefaultTexts.pressEnterToStartAgain;
            image = gameDefaultImages.gameOverImage;
            break;
        case "victory":
            text = gameDefaultTexts.victoryText;
            action = gameDefaultTexts.pressEnterToStartAgain;
            image = gameDefaultImages.victoryImage;
            break;
    }
    renderScreen(text, image, action, false);
}

export {
    renderGameScreen,
    renderNonGameScreen
};