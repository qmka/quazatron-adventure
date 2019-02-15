import { vocabulary } from './gamedata.js';

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
const findWordID = (type, word) => {
    for (let j of type) {
        const currentForms = j.forms;
        for (let k of currentForms) {
            if (k === word) {
                return j.id;
            }
        }
    }
}

// Возвращает id объекта, которому соответствует введённое игроком прилагательное
const findAdjectiveID = (type, id) => {
    for (let n of type) {
        const adjId = n.adjective;
        if (id === adjId) {
            return n.id;
        }
    }
}

const inputCtrl = (input) => {
    const verbs = vocabulary.verbs;
    const objects = vocabulary.objects;
    const adjectives = vocabulary.adjectives;
    let isSecondItem = false;
    let verb, item1, item2, nonitem, object;
    let message = "Ок";

    // Возвращает true, если слово - предмет, и false, если слово - игровой объект
    const isItem = (ob) => {
        if (ob !== undefined) {
            const current = objects.find(e => e.id === ob);
            return current.item;
        }
        return undefined;
    }

    // Возвращает true, если слово есть в словаре прилагательных
    const isAdjective = (word) => {
        const result = findWordID(adjectives, word);
        return result !== undefined;
    }

    if (!input.length) {
        message = "Что мне делать?";
    }
    input = input.toLowerCase();
    const words = input.split(/[\s,]+/);

    // Запускаем цикл, в котором рассматриваем каждое слово из фразы игрока по отдельности
    for (let i = 0; i < words.length; i += 1) {
        // Первое слово по умолчанию всегда должно быть глаголом
        if (i === 0) {
            const pVerb = findWordID(verbs, words[i]);
            if (pVerb !== undefined) verb = pVerb;
        } else {
            // Ищем id текущего слова
            const pObject = findWordID(objects, words[i]);

            
            if (isAdjective(words[i - 1])) {    // Если перед текущим словом стояло прилагательное
                const pAdjective = findWordID(adjectives, words[i - 1]);
                if (pObject !== undefined) {
                    const verifObj = findAdjectiveID(objects, pAdjective);
                    object = verifObj !== undefined ? verifObj : pObject;
                }
            } else {
                   const thisObject = objects.find(e => e.id === pObject);
                if (pObject !== undefined) {
                    if ("adjective" in thisObject) message = `Уточните прилагательное для слова "${words[i]}".`;
                    else object = pObject;
                }
            }

            // Если нашли слово в словаре, то определяем, предмет это или игровой объект
            if (object !== undefined) {
                if (isItem(object)) {

                    // Если в фразе игрока упоминается два предмета, то разносим их в разные переменные
                    if (!isSecondItem) {
                        isSecondItem = true;
                        item1 = object;
                        object = undefined;
                    } else {
                        item2 = object;
                    }
                } else {
                    nonitem = object;
                }
            }
        }
    }
    
    return {
        verb: verb,
        obj: nonitem,
        item1: item1,
        item2: item2,
        message: message
    }
}

export default inputCtrl