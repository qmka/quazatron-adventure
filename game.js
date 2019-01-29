//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИКИ СОБЫТИЙ
//////////////////////////////////////////////////////////////////////////////////////////

// функция btnClick забирает введённую пользователем строку и производит нужное действие

const btnClick = () => {
    // берём значение пользователя в inputText и очищаем поле ввода
    var inputText = document.getElementById("input_field").value;
    document.getElementById("input_field").value = "";

    // реагируем на ввод: функция inputProcessing анализирует фразу. На вход она получает inputText, на выходе выдаёт описание локации и экшен в виде объекта, а промежуточно производит всю нужную игровую логику
    outputText = inputProcessing(inputText);

    // генерируем экран
    makeScreen(outputText.location, outputText.action);
}

//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИК ВВОДА ПОЛЬЗОВАТЕЛЯ
//////////////////////////////////////////////////////////////////////////////////////////

// inputProcessing анализирует фразу
const inputProcessing = (input) => {
    const output = {};
    input = input.toLowerCase();
    output.location = locationNumToText(currentLoc);
    output.action = "Что будете делать?";
    // здесь мы должны проанализировать фразу
    // если направление с, ю, з, в, то отправить в соответствующую функцию смены локации
    // если действие - то в подпрограмму локации, в которой прописаны все эти действия
    // если служебная команда - например "и" (инвентарь) - то в соотв программу
    switch (input) {
        case "":
            output.action = "Скажите мне, что делать";
            break;
        case "с":
            if (locations[currentLoc].isN !== -1) {
                currentLoc = locations[currentLoc].isN;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "ю":
            if (locations[currentLoc].isS !== -1) {
                currentLoc = locations[currentLoc].isS;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "в":
            if (locations[currentLoc].isE !== -1) {
                currentLoc = locations[currentLoc].isE;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "з":
            if (locations[currentLoc].isW !== -1) {
                currentLoc = locations[currentLoc].isW;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "и":
            output.action = "У меня в инвентаре: <br>";
            if (items.some(e => {
                    return e.place === 999;
                })) {
                items.forEach(e => {
                    if (e.place === 999) {
                        output.action += `- ${e.name}<br>`;
                    }
                })
            } else {
                output.action += `- пусто<br>`;
            }
            output.action += "<br>Что дальше?"
            break;
        default:
            // далее - две функции
            // первая обрабатывает исключительные для каждой локации ситуации ("брось лампу об дерево")
            // если первая не прокатывает, то включаем анализатор фразы, который разбивает её на глагол и существительное
            // и происходит обработка не зависящих от конкретной локации действи ("возьми лампу", "открой коробку").
            // если и это не прокатывает, то выводим сообщение "Я не могу этого сделать"

            // здесь пишем обработчик стандартных ситуаций, в зависимости от глагола
            const phrase = phraseAnalyze(input);
            // запускаем обработчик уникальных для локаций действий (УЛД). На выходе этот обработчик выдаёт объект, содержащий фразу экшена .txt и флаг экшена .flag (true - если фраза сыграла, false - если это стандартная фраза)
            const uld = uldProcessing(phrase);
            output.location = locationNumToText(currentLoc);
            if (uld.flag) {
                // если сработала уникальная ситуация
                output.action = uld.txt;
                return output;
            }
            // если не сработала, то переходим к обработчику неуникальных действий
            // if по глаголу
            if (phrase.verb === "возьми" || phrase.verb === "бери") {
                // берём предмет
                const thisItem = items.find(e => e.case === phrase.obj);
                if (thisItem === undefined) {
                    output.action = `Что взять? Уточните.`;
                } else if (thisItem.place === currentLoc) {
                    items[thisItem.index].place = 999;
                    output.action = `Я взял ${thisItem.case}.`;
                    output.location = locationNumToText(currentLoc);
                } else if (thisItem.place === 999) {
                    output.action = `У меня это уже есть!`;
                } else {
                    output.action = `Здесь этого нет, не могу взять.`;
                }
            } else if (phrase.verb === "положи" || phrase.verb === "брось" || phrase.verb === "оставь" || phrase.verb === "выброси" || phrase.verb === "выбрось" || phrase.verb === "выкинь") {
                // кладём предмет
                const dropItem = items.find(e => e.case === phrase.obj);
                if (dropItem === undefined) {
                    output.action = `Что положить? Уточните.`;
                } else if (dropItem.place === 999) {
                    items[dropItem.index].place = currentLoc;
                    output.action = `Я положил ${dropItem.case}.`;
                    output.location = locationNumToText(currentLoc);
                } else if (dropItem.place === currentLoc) {
                    output.action = `Это и так здесь уже лежит!`;
                } else {
                    output.action = `Не могу выбросить, потому что у меня этого нет.`;
                }
            } else {
                // если вообще ничего не сработало
                output.action = "Я не могу этого сделать";
            }
    }
    return output;
}


//////////////////////////////////////////////////////////////////////////////////////////
// АНАЛИЗАТОР ФРАЗ
//////////////////////////////////////////////////////////////////////////////////////////

// на вход принимаем фразу, введённую пользователем в формате ГЛАГОЛ + СУЩЕСТВИТЕЛЬНОЕ (+ ПРЕДЛОГ) + СУЩЕСТВИТЕЛЬНОЕ
// на выход выдаём объект, состоящий из .verb, .obj и .noun. предлог не учитывается.

const phraseAnalyze = (inputPhrase) => {
    const result = {};
    const words = inputPhrase.split(/[\s,]+/); // получили массив слов.
    result.verb = words[0];
    result.obj = words[1];
    result.noun = words[words.length - 1];
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТКА ФРАЗ УНИКАЛЬНЫХ ДЛЯ ЛОКАЦИЙ
//////////////////////////////////////////////////////////////////////////////////////////

// На вход принимает объект из phraseAnalyze. На выходе этот обработчик выдаёт объект, содержащий фразу экшена .txt и флаг экшена .flag (true - если фраза сыграла, false - если это стандартная фраза)

const uldProcessing = (inputPhrase) => {
    // пока логика не придумана, возвращаем так, будто нет уникальных ситуаций !!!!!!!!!!
    const result = {};
    result.flag = false;
    result.txt = "It's a Dummy Text";
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ГЕНЕРИРУЕМ ЭКРАН ПОЛЬЗОВАТЕЛЯ
//////////////////////////////////////////////////////////////////////////////////////////

// функция locationNumToText получает номер локации и выдаёт текст этой локации
const locationNumToText = num => {
    let description = "";
    switch (num) {
        case 0:
            {
                description += "Вы находитесь в огромном зале в локации №0. Единственный выход ведёт на север.";
                break;
            }
        case 1:
            {
                description += "Вы находитесь в маленьком алькове в локации №1. Выход - на юге.";
                break;
            }
        default:
            description += "Вы находитесь там, где не должны находиться!!!";
    }
    description += "<br><br>";
    if (items.some(e => {
            return e.place === currentLoc;
        })) {
        description += "Здесь также есть:<br>";
        items.forEach(e => {
            if (e.place === currentLoc) {
                description += `- ${e.name}<br>`;
            }
        })
    }
    return description;
}

// функция actionNumToText получает номер фразы и выдаёт текст экшена

const actionNumToText = num => {
    switch (num) {
        case 0:
            return "Что будете делать?";
        default:
            return "Ошибка: этот экшен не должен выводиться";
    }
}


// функция makeScreen выводит на экран текст
// 1. Описание локации
// 2. Описание действия (если в локации впервые, то фразу "Что будете делать?")
const makeScreen = (locationText, actionText) => {
    document.getElementById("screen").innerHTML = locationText + "<br><br>" + actionText;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ИНИЦИАЛИЗАЦИЯ
//////////////////////////////////////////////////////////////////////////////////////////

// Локации
// Мы имеем массив локаций. Каждая локация - это объект. Номер локации в массиве - это номер локации.
const locations = [{
    isN: 1,
    isE: -1,
    isS: -1,
    isW: -1
}, {
    isN: -1,
    isE: -1,
    isS: 0,
    isW: -1
}];

// Предметы
// Мы имеем массив предметов. Каждый предмет - это объект, он содержит своё название в инвентаре, своё описание и своё местоположение - либо номер локации, либо 999, если у игрока, либо -1 если не существует.
const items = [{
    index: 0,
    name: "лампа",
    case: "лампу",
    desc: "Жестяная масляная лампа",
    place: 0
}, {
    index: 1,
    name: "ключ",
    case: "ключ",
    desc: "Старинный медный ключ",
    place: 1
}]

// Инициализация

let currentLoc = 0; // Стартуем в локации 0

// Запускаем функцию, которая конвертит номер локации в текст локации
makeScreen(locationNumToText(currentLoc), actionNumToText(0));