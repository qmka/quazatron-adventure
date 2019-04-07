import objects from '../gamedata/objects.js';
import adjectives from '../gamedata/adjectives.js';
import verbs from '../gamedata/verbs.js';
import wordsToIgnore from '../gamedata/words-to-ignore.js';
import phrases from '../gamedata/phrases.js';

import {
    defaultTexts
} from '../gamedata/default-data.js';

import {
    WORD_TYPES
} from './constants.js';

import {
    isNumber
} from './utils.js';

// Ищем id слова word в словаре type
const findWordId = (type, word) => {
    let vocabulary;
    let key = `${type}s`;

    if (key === 'objects') vocabulary = objects;
    else if (key === 'adjectives') vocabulary = adjectives;
    else vocabulary = verbs;

    const result = vocabulary.find((item) => item.forms.includes(word));
    return result ? result.id : -1;
}

// Ищем id объектов, в массиве forms которых встречается слово word. 
// Возвращаем массив этих id или -1, если не нашли ничего
const findObjectsByWord = (word) => {
    let words = [];

    objects.forEach(e => {
        if (e.forms.includes(word)) {
            words.push(e.id);
        }
    })
    return words.length ? words : -1;
}

// Возвращаем свойство adjective объекта с соответствующим id
const findAdjectiveProperty = (id) => {
    const object = objects[id];

    return object && 'adjective' in object && isNumber(object.adjective) ? object.adjective : -1;
}

const isAdjective = (word) => {
    let result = false;
    adjectives.forEach(e => {
        if (e.forms.includes(word)) result = true;
    })
    return result;
};

// Основная функция парсера. На входе - строка, введённая игроком.
// На выходе объект, содержащий id глагола и двух существительных, которые ввёл игрок, и сервисное сообщение
const parseInput = (input) => {
    let isFirstItem = true;
    let verb = -1,
        object1 = -1,
        object2 = -1,
        // message = defaultTexts.okMessage,
        objectsInInput = 0;

    // Если игрок не ввёл ничего и нажал Enter
    if (!input.length) {
        return {
            verb,
            object1,
            object2,
            message: defaultTexts.defaultQuestion,
            objectsInInput
        }
    }

    // Если игрок ввёл одну из предзаготовленных фраз из phrases.js
    // Берем phases, ищем, в каком из объектов в свойстве forms встречается ввод игрока
    // Если находим, то возвращаем свойство parsedData этого объекта
    const [obj] = phrases.filter(n => n.forms.includes(input));
    if (obj) return obj.parsedData;

    const words = input.toLowerCase().split(/[\s,]+/);

    // Определяем количество объектов, упомянутых игроком
    // Если игрок ввёл два слова (глагол + объект), то выставляем objectsInInput = 1
    // Если меньше, то 0, если больше, то 2.
    // Если слова три, но одно из них прилагательное, то objectsInInput = 1
    switch(words.length) {
        case 1:
        case 2:
            objectsInInput = words.length - 1;
            break;
        case 3:
            objectsInInput = 2;
            words.forEach(e => {
                if (isAdjective(e)) objectsInInput = 1;
            });
            break;
        default:
            objectsInInput = 2;
            break;
    }

    // Для каждого слова в массиве words
    // Ищем глагол
    verb = findWordId(WORD_TYPES.verb, words[0]);

    // Если не нашли глагола в словаре, то пишем, что программа не понимает
    if (verb === -1) {
        const errMessage = `${defaultTexts.parserDontUnderstandWord} "${words[0]}".`;
        return {
            verb,
            object1,
            object2,
            message: errMessage,
            objectsInInput
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
        const wordIds = findObjectsByWord(words[i]);
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
                                message: defaultTexts.specifyAdjective,
                                objectsInInput
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
                        message: defaultTexts.specifyObject,
                        objectsInInput
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
        } else {
            // Если парсер не понимает слово
            //const [isAdjective] = adjectives.filter(n => n.forms.includes(words[i]));
            if (!wordsToIgnore.includes(words[i]) && !isAdjective(words[i])) {
                const errMessage = `${defaultTexts.parserDontUnderstandWord} "${words[i]}".`;
                return {
                    verb,
                    object1,
                    object2,
                    message: errMessage,
                    objectsInInput
                }
            }
        }
    }
    return {
        verb,
        object1,
        object2,
        // message,
        objectsInInput
    }
}

export default parseInput