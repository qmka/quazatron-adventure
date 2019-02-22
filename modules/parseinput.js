import {
    vocabulary
} from './gamedata.js';
import {
    WORD_TYPES
} from './constants.js';

// Ищем id слова word в словаре type
const findWordId = (type, word) => {
    let key = `${type}s`;
    if (!type in vocabulary || !key in vocabulary) return -1;
    const result = vocabulary[key].find((item) => item.forms.includes(word));
    return result !== undefined ? result.id : -1;
}

// Ищем id объектов, в массиве forms которых встречается слово word. 
// Возвращаем массив этих id или -1, если не нашли ничего
const findObjectId = (word) => {
    let arrayOfWordsIds = [];
    vocabulary.objects.forEach(e => {
        if (e.forms.includes(word)) {
            arrayOfWordsIds.push(e.id);
        }
    })
    return arrayOfWordsIds.length !== 0 ? arrayOfWordsIds : -1;
}

// Возвращаем свойство adjective объекта с соответствующим id
const findAdjectiveProperty = (id) => {
    const object = vocabulary.objects[id];
    if (object === undefined) return -1;
    return object.adjective;
}

// Основная функция парсера. На входе - строка, введённая игроком.
// На выходе 
const parseInput = (input) => {
    let isFirstItem = true;
    let verb = -1,
        object1 = -1,
        object2 = -1,
        message = "Ок";

    // Если игрок не ввёл ничего и нажал Enter
    if (!input.length) {
        return {
            verb,
            object1,
            object2,
            message: "Что мне делать?"
        }
    }

    const words = input.toLowerCase().split(/[\s,]+/);

    // Ищем глагол
    verb = findWordId(WORD_TYPES.verb, words[0]);

    // Если не нашли глагола в словаре, то пишем, что программа не понимает
    if (verb === -1) {
        return {
            verb,
            object1,
            object2,
            message: "Я не понимаю"
        }
    }

    // Запускаем цикл, в котором рассматриваем каждое слово из фразы игрока по отдельности
    for (let i = 1; i < words.length; i += 1) {
        // Ищем id текущего слова в словаре игровых объектов. Получаем массив объектов, для которых встречается
        // данная словоформа. В общем случае это будет массив из одного слова.

        // Зачем нужен массив? Потому что иначе парсер находил первый объект, в котором встречалось слово игрока,// и возвращал его. То есть, форма "монета" есть у "серебряной монеты" id=11 и "медной монеты" id=12,
        // и парсер всегда возвращал id=11, а до id=12 не добирался.

        // Поэтому, когда парсер видит слово "монета", он выдаёт массив, содержащий id и той, и другой монет.
        // А дальше уже перебором по массиву мы определяем, о какой конкретно монете идёт речь.
        const wordIds = findObjectId(words[i]);

        // Если нашли id в словаре
        if (wordIds !== -1) {
            // В currentObjectId будем хранить итоговый id объекта (после проверок с прилагательными)
            let currentObjectId;

            // Если у нас всего один id в массиве, значит, он и будет currentObjectId
            if (wordIds.length === 1) {
                currentObjectId = wordIds[0];
            } else {
                // А если несколько, то прогоняем цикл по массиву для определения правильного currentObjectId
                // За значение по умолчанию берём вариант, когда непонятно, какой объект имеет в виду игрок.
                currentObjectId = -1;

                // Производим для каждого id из массива wordIds проверку на предмет использования данного объекта с прилагательным
                for (let wordId of wordIds) {
                    // У объекта с этим id есть свойство adjective?
                    const wordAdjective = findAdjectiveProperty(wordId);

                    // Если есть, то значит это объект, который нужно называть только с прилагательным ("Красная кнопка")
                    // Переходим подпрограмму сопоставления объекта и соответствуюшего ему прилагательного
                    if (wordAdjective !== -1) {
                        // Если игрок хочет взаимодействовать с таким объектом, он должен написать перед этим словом
                        // соответствующее ему прилагательное. Ищем, является ли предшествующее слово прилагательным,
                        // и записываем в adjectiveId его id. Если не находим прилагательного в словаре, получаем -1
                        const adjectiveId = findWordId(WORD_TYPES.adjective, words[i - 1]);

                        // Если не нашли прилагательного в словаре ИЛИ нашли прилагательное, которое не относится к нашему объекту
                        // то возвращаем сообщение об ошибке игроку
                        if (adjectiveId === -1) {
                            return {
                                verb,
                                object1,
                                object2,
                                message: "Уточните, какой конкретно объект вы имеете в виду?"
                            }
                        }

                        if (wordAdjective === adjectiveId) {
                            // Мы нашли правильное слово
                            currentObjectId = wordId;
                        }
                    }
                }

                // Если правильного слова мы не нашли
                if (currentObjectId === -1) {
                    return {
                        verb,
                        object1,
                        object2,
                        message: "Уточните, какой конкретно из объектов вы имеете в виду?"
                    }
                }
            }
            
            // Это первый объект, упомянутый в фразе?
            if (isFirstItem) {
                object1 = currentObjectId;
                isFirstItem = false;
            } else {
                object2 = currentObjectId;
            }
        }
    }

    console.log(`verb = ${verb}; obj1 = ${object1}; obj2 = ${object2}; message = ${message}`);

    return {
        verb,
        object1,
        object2,
        message
    }
}

export default parseInput