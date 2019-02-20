import {
    vocabulary
} from './gamedata.js';
import {
    WORD_TYPES
} from './constants.js';

// Word Analyzer for ABS v.0.9
// На входе команда игрока
// На выходе объект, свойства которого:
// - verb: глагол
// - obj: игровой объект (не предмет), с которым можно взаимодействовать
// - item1: предмет
// - item2: второй предмет (если есть, а если нет - то undefined)
// - message: служебное сообщение, которое нужно вывести в случае ошибки анализатора
//
// Анализатор точно определяет следующие конструкции:
// - одиночная команда, например "с" для передвижения на север. Такая команда считается ГЛАГОЛОМ.
// - простое действие ГЛАГОЛ + СУЩЕСТВИТЕЛЬНОЕ. Например, "возьми монету".
// - сложное действие ГЛАГОЛ + СУЩЕСТВИТЕЛЬНОЕ + СУЩЕСТВИТЕЛЬНОЕ. Например, "ударь мечом монстра".
// - сочетания ПРИЛАГАТЕЛЬНОЕ + СУЩЕСТВИТЕЛЬНОЕ в простом или сложном действии. При этом объект должен стоять сразу после прилагательного, с которым он связан. Например, "возьми золотую монету".
// - СУЩЕСТВИТЕЛЬНОЕ может быть как предметом, который можно взять, так и игровым объектом, с которым игрок может взаимодействовать. 
//
// Имеются разумные ограничения
// - ГЛАГОЛ всегда является первым словом в предложении. Конструкции а-ля Мастер Йода "монету золотую ты возьми" не сработают.
// - Предполагается, что в команде будет не более двух СУЩЕСТВИТЕЛЬНЫХ. То есть, команда "ударь мечом монстра" сработает, а команда "положи в мешок монету и кольцо" - нет. Один предмет - одно действие, за исключением случаев, когда надо воздействовать одним предметом на другой - "открой банку ножом".
// - Предлоги игнорируются

// Возвращает id слова, соответствующего слову, введённому игроком, в словаре

const findWordId = (type, word) => {
    let key = `${type}s`;
    if (!type in vocabulary || !key in vocabulary) return -1;
    const result = vocabulary[key].find((item) => item.forms.includes(word));
    return result !== undefined ? result.id : "";
}


const findAdjectiveId = (adjectiveId) => {
    // смотрим каждый объект, ищем у него свойство adjective
    // сравниваем значение свойства adjective у объекта и переданный id из словаря прилагательных
    // если совпадает, то возвращаем id этого объекта
    const result = vocabulary["objects"].find((item) => item.adjective === adjectiveId);
    return result !== undefined ? result.id : "";
}

// Возвращает true, если слово - предмет, и false, если слово - игровой объект
const canHoldItem = (object) => {
    if (object !== undefined) {
        const current = vocabulary.objects.find((e) => e.id === object);
        return current.item;
    }
    return undefined;
}

// Возвращает true, если слово есть в словаре прилагательных
const isAdjective = (word) => {
    const result = findWordId(WORD_TYPES.adjective, word);
    return result !== "" ? true : false;
}

const parseInput = (input) => {
    const objects = vocabulary.objects;
    let isSecondItem = false;
    let verb = "",
        item1 = "",
        item2 = "",
        nonitem = "",
        object = "";
    let message = "Ок";

    if (!input.length) {
        message = "Что мне делать?";
    }
    input = input.toLowerCase();
    const words = input.split(/[\s,]+/);

    // Ищем глагол
    const pVerb = findWordId(WORD_TYPES.verb, words[0]);
    // Если нашли id, то записываем его в verb, иначе verb остаётся пустым ""
    if (pVerb !== "") verb = pVerb;

    // Запускаем цикл, в котором рассматриваем каждое слово из фразы игрока по отдельности
    for (let i = 1; i < words.length; i += 1) {

        // Ищем id текущего слова, предполагая, что это существительное. 
        // Если это прилагательное, то мы его просто пропустим
        const pObject = findWordId(WORD_TYPES.noun, words[i]);

        // Если перед текущим словом стояло прилагательное
        if (isAdjective(words[i - 1])) {

            // Ищем id этого прилагательного в словаре прилагательных
            const pAdjective = findWordId(WORD_TYPES.adjective, words[i - 1]);

            // Если нашли
            if (pObject !== "") {

                // То записываем в verifObj id объекта, у которого в свойстве adjective стоит указанное игроком прилагательное
                const verifObj = findAdjectiveId(objects, pAdjective);

                // Присваиваем в object либо полученный verifObj (если есть прилагательное), 
                // или (если нет прилагательного) pObject
                object = verifObj !== undefined ? verifObj : pObject;
            }

            // Если перед текущим словом не стояло прилагательного
        } else {
            // Ищем в массиве объектов объект с id, который мы записали в pObject
            const thisObject = objects.find(e => e.id === pObject);

            // Если мы вообще нашли такой id
            if (thisObject !== undefined) {

                // Если у объекта есть прилагательное, а игрок его не ввёл, то надо уточнить
                if ("adjective" in thisObject) message = `Уточните прилагательное для слова "${words[i]}".`;

                // Иначе записываем в object
                else object = pObject;
            }
        }

        // Если мы сопоставили ввод игрока с каким-либо игровым объектом
        if (object !== "") {

            // Проверяем, предмет это или статический объект
            // Если предмет:
            if (canHoldItem(object)) {

                // Если в фразе игрока упоминается два предмета, то разносим их в разные переменные
                if (!isSecondItem) {
                    isSecondItem = true;
                    item1 = object;
                    object = "";
                } else {
                    item2 = object;
                }
            } else {
                nonitem = object;
            }
        }

    }
    console.log({
        verb,
        obj: nonitem,
        item1: item1,
        item2: item2,
        message
    });
    return {
        verb,
        obj: nonitem,
        item1: item1,
        item2: item2,
        message
    }
}

export default parseInput