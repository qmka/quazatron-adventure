const seekWord = (type, word) => {
    for (let j of type) {
        const currentForms = j.forms;
        for (let k of currentForms) {
            if (k === word) {
                return j.id;
            }
        }
    }
}

const seekAdjId = (type, id) => {
    for (let n of type) {
        const adjId = n.adjective;
        if (id === adjId) {
            return n.id;
        }
    }
}

const inputCtrl = (data, input) => {
    const verbs = data.verbs;
    const objects = data.objects;
    const adjectives = data.adjectives;
    let isSecondItem = false;
    let verb, item1, item2, nonitem, object;
    let message = "Ок";

    const isItem = (ob) => {
        if (ob !== undefined) {
            const current = objects.find(e => e.id === ob);
            return current.item;
        }
        return undefined;
    }

    const isAdjective = (word) => {
        const result = seekWord(adjectives, word);
        return result !== undefined ? true : false;
    }
    if (input.length === 0) {
        message = "Что мне делать?";
    }
    input = input.toLowerCase();
    const words = input.split(/[\s,]+/);

    for (let i = 0; i < words.length; i += 1) {
        if (i === 0) {
            const pVerb = seekWord(verbs, words[i]);
            if (pVerb !== undefined) verb = pVerb;
        } else {
            const pObject = seekWord(objects, words[i]);
            if (isAdjective(words[i - 1])) {
                const pAdjective = seekWord(adjectives, words[i - 1]);
                if (pObject !== undefined) {
                    const verifObj = seekAdjId(objects, pAdjective);
                    object = verifObj !== undefined ? verifObj : pObject;
                }
            } else {
                   const thisObject = objects.find(e => e.id === pObject);
                if (pObject !== undefined) {
                    if ("adjective" in thisObject) message = `Уточните прилагательное для слова "${words[i]}".`;
                    else object = pObject;
                }
            }
            if (object !== undefined) {
                if (isItem(object)) {
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