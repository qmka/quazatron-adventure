import Inventory from '../classes/inventory.js'
import CurrentLocation from '../classes/location.js'
import Flags from '../classes/flags.js'
import ItemPlaces from '../classes/itemplaces.js'
import Counters from '../classes/counters.js';

import vocabulary from '../gamedata/vocabulary.js';

const encounters = {
    // Добавляем дополнительную информацию к описанию локации в зависимости от различных условий
    addDescription() {
        const currentLocation = CurrentLocation.get();
        let description = '<div class="new-paragraph">';

        if (currentLocation === 8 && Flags.get("isLadderLeanToTree")) description += "К дереву приставлена лестница.";
        if (currentLocation === 11 && Flags.get("isDoorOpened")) description += "Дверь открыта.";
        if (currentLocation === 7 && !Flags.get("isTrollKilled")) description += "Путь на восток преграждает толстый тролль.";
        if (currentLocation === 17 && !Flags.get("isPortcullisOpened")) description += "Решётка опущена - не пройти.";
        if (currentLocation === 17 && Flags.get("isPortcullisOpened")) description += "Решётка поднята к потолку.";
        if (currentLocation === 18 && Flags.get("isTrapdoorOpened")) description += "В полу комнаты дыра, через которую можно спуститься вниз.";
        if (currentLocation === 18 && !Flags.get("isTrapdoorOpened")) description += "В полу есть закрытый люк.";
        if (currentLocation === 23 && !Flags.get("isWormKilled")) description += "Вход в южный тоннель преграждает огромный скальный червь.";
        if (currentLocation === 20 && !Flags.get("isMonsterKilled")) description += "Северный проход охраняет страшный ледяной монстр.";
        if (currentLocation === 27 && !Flags.get("isWitchKilled")) description += "В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";

        description += '</div>';
        return description;
    },

    // Прокручиваем все заданные игрой счётчики
    setCounters() {
        Counters.increase('gameTurns');
    },

    // Проверяем, мешает ли игроку что-либо двигаться в выбранном им направлении
    checkPlayerObstacles(direction) {
        const currentLocation = CurrentLocation.get();

        if (currentLocation === 7 && !Flags.get("isTrollKilled") && direction === 1) {
            return "Тролль рычит и не даёт мне пройти.";
        }
        if (currentLocation === 8 && !Flags.get("isLadderLeanToTree") && direction === 4) {
            return "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
        }
        if (currentLocation === 11 && !Flags.get("isDoorOpened") && direction === 1) {
            return "Дверь закрыта, я не могу туда пройти.";
        }
        if (currentLocation === 17 && !Flags.get("isPortcullisOpened") && direction === 0) {
            return "Решётка опущена до пола, она мешает мне пройти.";
        }
        if (currentLocation === 18 && !Flags.get("isTrapdoorOpened") && direction === 5) {
            return "Путь вниз мне преграждает закрытый люк.";
        }
        if (currentLocation === 20 && !Flags.get("isMonsterKilled") && direction === 0) {
            return "Ледяной монстр мешает мне пройти.";
        }
        if (currentLocation === 23 && !Flags.get("isWormKilled") && direction === 2) {
            return "Скальный червь мешает мне пройти.";
        }

        return "";
    },

    // Функция возвращает текст для вывода на экран окончания игры
    getGameOverText() {
        if (Flags.get("isDiedFromFish")) {
            return 'Я почувствовал острую боль в животе и умер. Глупо, конечно, заканчивать это приключение, отравившись протухшей рыбой.';
        }
        
        return defaultTexts.defaultGameOverText;
    },

    // Функция проверяет, действует ли в локации какое-либо условие, не укладывающееся в общую логику игры.
    getUniqueEncounter(verbId, objectIds) {
        let answer, flag = false;

        // В локации с ведьмой у игрока только один ход, чтобы отразить заклятье, иначе его выбрасывает в предыдущую комнату
        if (CurrentLocation.get() === 27 && !Flags.get("isWitchKilled")) {
            flag = true;
            if (verbId === 30 && objectIds.includes(25)) {
                if (Inventory.includes(10)) {
                    Flags.toggle("isWitchKilled");
                    Inventory.removeItem(10);
                    answer = "Я отразил заклятье мечом, и оно ударило прямо в ведьму! Издав истошный крик, ведьма рассыпалась в пыль. К сожалению, меч тоже не уцелел.";
                } else {
                    CurrentLocation.set(17);
                    answer = "Мне нечем отразить заклятье. Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой."
                }
            } else {
                CurrentLocation.set(17);
                answer = "Я не успеваю ничего сделать. Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой.";
            }
        }

        return {
            answer,
            flag
        }
    },

    take(itemId) {
        // Если предмет - лестница, и она прислонена к дереву, то можно её забрать в инвентарь
        if (itemId === 0 && Flags.get("isLadderLeanToTree")) {
            Flags.toggle("isLadderLeanToTree");
            Inventory.addItem(0);
            return "Я забрал лестницу.";
        }

        return "Я не могу это взять.";
    },

    drop(itemId) {
        if ((itemId === 11 || itemId === 12) && Inventory.includes(itemId) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            Inventory.removeItem(itemId);
            return "Я бросил монетку на землю, и она укатилась в пропасть.";
        }

        return "У меня нет этого.";
    },

    examine(objectId) {
        const currentLocation = CurrentLocation.get();

        if (currentLocation === 8 && objectId === 18) {
            return "Это невысокое, но широкое в обхвате дерево, превратившееся в камень под действием неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя что-то вроде гнезда.";
        }
        if (currentLocation === 8 && objectId === 0 && Flags.get("isLadderLeanToTree")) {
            return "Лестница приставлена к дереву. Я могу залезть наверх.";
        }
        if ((currentLocation === 6 || currentLocation === 12) && objectId === 13) {
            return "Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.";
        }
        if (currentLocation === 14 && objectId === 14) {
            let answer = "Ветви этого куста похожи на щупальца.";
            if (!Flags.get("isKeyRevealed")) {
                Flags.toggle("isKeyRevealed");
                ItemPlaces.set(6, 14);
                answer += " На одном из таких щупальцев я обнаружил ключ.";
            }
            return answer;
        }
        if (currentLocation === 11 && objectId === 16) {
            return Flags.get("isDoorOpened") ? "Дверь открыта." : "Дверь заперта.";
        }
        if (currentLocation === 7 && !Flags.get("isTrollKilled") && objectId === 17) {
            return "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
        }
        if (currentLocation === 17 && objectId === 19) {
            return Flags.get("isPortcullisOpened") ? "Решётка поднята к потолку - проход свободен." : "Это мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
        }
        if (currentLocation === 18 && objectId === 20) {
            return Flags.get("isTrapdoorOpened") ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
        }
        if (currentLocation === 5 && objectId === 21) {
            return "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";
        }
        if (currentLocation === 23 && !Flags.get("isWormKilled") && objectId === 22) {
            return "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
        }
        if (currentLocation === 20 && !Flags.get("isMonsterKilled") && objectId === 23) {
            return "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
        }
        if (currentLocation === 25 && objectId === 24) {
            return Flags.get("isLeverOiled") ? "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
        }
        if (currentLocation === 28 && objectId === 26) {
            return "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";
        }
        if (objectId === 4 && Inventory.includes(4)) {
            let answer = vocabulary.objects[4].desc;
            if (!Flags.get("isAxeRevealed")) {
                Flags.toggle("isAxeRevealed");
                ItemPlaces.set(5, currentLocation);
                answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
            }
            return answer;
        }
        if (objectId === 27 && Inventory.includes(27)) {
            return vocabulary.objects[27].desc + ` Они показывают число ${Counters.get('gameTurns')}.`;
        }

        return "Ничего необычного.";
    },

    throw (objectIds) {
        if (objectIds.includes(8) && Inventory.includes(8)) {
            Inventory.removeItem(8);
            if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled")) {
                Flags.toggle("isMonsterKilled");
                return "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Я высыпал всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }
        if (objectIds.includes(5) && Inventory.includes(5)) {
            return "Это явно не метательный топорик. Давайте попробуем что-то другое.";
        }
        if (objectIds.includes(2) && Inventory.includes(2)) {
            return "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
        }
        if (objectIds.includes(7) && Inventory.includes(7)) {
            Inventory.removeItem(7);
            return "Я бросаю лампу, и она разбивается на осколки. И зачем нужно было это делать?";
        }

        return "Не сработает. А если вы хотите положить предмет на землю, то лучше введите команду ПОЛОЖИ.";

    },

    talk(objectIds) {
        if (objectIds.includes(21) && CurrentLocation.get() === 5) {
            return "Старушка рассказывает, что её муж делает лампы, а она их продаёт путникам - такая вещь в путешествии всегда пригодится. Если хотите купить лампу, вам придётся заплатить серебром. Ничего себе цены!";
        }
        if (objectIds.includes(17) && CurrentLocation.get() === 7 && !Flags.get("isTrollKilled")) {
            return "Тролль злобно рычит в ответ.";
        }
        if (objectIds.includes(23) && CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled")) {
            return "У этого чудища нет рта, чтобы разговаривать.";
        }
        if (objectIds.includes(26) && CurrentLocation.get() === 28) {
            return "Чтобы с ней пообщаться, нужно её разбудить.";
        }

        return "Здесь не с кем говорить.";
    },

    buy(objectIds) {
        if (objectIds.includes(7) && CurrentLocation.get() === 5) {
            if (Inventory.includes(11)) {
                Inventory.removeItem(11);
                Inventory.addItem(7);
                return "Я купил у старушки лампу за серебряную монету";
            } else if (Inventory.includes(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "У меня нет денег."
            }
        }

        return "Я не могу это купить";
    },

    pay(objectIds) {
        if (CurrentLocation.get() === 5) {
            if (objectIds.includes(11) && Inventory.includes(11)) {
                Inventory.removeItem(11);
                Inventory.addItem(7);
                return "Я купил у старушки лампу за серебряную монету";
            } else if (Inventory.includes(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "Мне нужны деньги, чтобы заплатить."
            }
        }
        if (CurrentLocation.get() === 7 && !Flags.get("isTrollKilled")) {
            return "Тролль злобно рычит на меня.";
        }

        return "Похоже, здесь никому не нужны деньги.";
    },

    hit(objectIds) {
        if (CurrentLocation.get() === 7 && !Flags.get("isTrollKilled") && objectIds.includes(17)) {
            if (Inventory.includes(2)) {
                Flags.toggle("isTrollKilled");
                Inventory.removeItem(2);
                return "Я бросился на тролля и вломил ему булавой прямо по макушке! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Теперь путь на восток свободен.";
            }
            if (Inventory.includes(5) && objectIds.includes(5)) {
                return "Не стоит с маленьким топориком лезть на большого тролля. Нужно что-то посерьёзнее.";
            }
            if (Inventory.includes(3) && objectIds.includes(3)) {
                return "Я похож на черепашку-ниндзя, чтобы нападать с деревянным шестом на толстого тролля?";
            }
            if (!Inventory.includes(3) && !Inventory.includes(5)) {
                return "Нападать на тролля с голыми руками? Нет уж!";
            }
            return "Уточните, чем это вы собираетесь убивать тролля?";
        }
        if (CurrentLocation.get() === 5 && objectIds.includes(21)) {
            if (Inventory.includes(5)) {
                return "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения?";
            }
            return "Эээ, я не стану нападать на добрую беззащитную старушку!";
        }
        if (CurrentLocation.get() === 23 && !Flags.get("isWormKilled") && objectIds.includes(22)) {
            return "Шкура скального червя настолько твёрдая, что я не смогу повредить её никаким оружием.";
        }
        if (CurrentLocation.get() === 28 && objectIds.includes(26)) {
            return "Напоминаю, что эта прекрасная девушка - цель моего приключения. И я не хочу, чтобы это приключение закончилось плачевно.";
        }
        if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled") && objectIds.includes(23)) {
            return "На такого монстра идти разве что с боевым ледорубом. Но такого у меня точно нет, придётся искать какую-нибудь хитрость.";
        }
        if (Inventory.includes(5) && objectIds.includes(5)) {
            return "Ничего не произошло. Подсказка: если хотите что-то порубить топором, то лучше скажите мне РУБИ или РАЗРУБИ... или ПОРУБИ, ну, в общем, вы поняли."
        }

        return "Ничего не произошло.";
    },

    chop(objectIds) {
        if (!Inventory.includes(5)) {
            return "У меня нет топора."
        }
        if (CurrentLocation.get() === 18 && objectIds.includes(20) && !Flags.get("isTrapdoorOpened")) {
            Flags.toggle("isTrapdoorOpened");
            return "Я разломал топором деревянный люк. Теперь можно спуститься вниз.";
        }
        if ((CurrentLocation.get() === 7 && objectIds.includes(17)) || (CurrentLocation.get() === 20 && objectIds.includes(23)) || (CurrentLocation.get() === 23 && objectIds.includes(22))) {
            return "Этот топор хорош для колки дров, но в бою будет маловат и неудобен.";
        }
        if (CurrentLocation.get() === 8 && objectIds.includes(18)) {
            Inventory.removeItem(5);
            return "Бить топором об камень - не самая хорошая идея. Но, тем не менее, я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
        }
        if (CurrentLocation.get() === 14 && objectIds.includes(14)) {
            return "Вы когда-нибудь пробовали рубить топором кусты? Попробуйте на досуге. Здесь пригодился бы секатор, ну, или штыковая лопата, но уж точно не топор";
        }
        if (Inventory.includes(3) && objectIds.includes(3)) {
            Inventory.removeItem(3);
            return "В ярости я накинулся на шест и порубил его в труху.";
        }
        if (ItemPlaces.get(3) === CurrentLocation.get() && objectIds.includes(3)) {
            ItemPlaces.set(3, -1);
            return "В ярости я накинулся на шест и порубил его в труху.";
        }
        if (Inventory.includes(4) && objectIds.includes(4)) {
            Inventory.removeItem(4);
            return "Я бросил на землю дрова и порубил их в труху.";
        }
        if (ItemPlaces.get(4) === CurrentLocation.get() && objectIds.includes(4)) {
            ItemPlaces.set(4, -1);
            return "С особой жестокостью я уничтожил все дрова.";
        }
        if (CurrentLocation.get() === 5 && objectIds.includes(21)) {
            return "Вам не кажется, что эта ситуация со старушкой и топором - немного из другого произведения?";
        }
        if ((CurrentLocation.get() === 6 || CurrentLocation.get() === 12) && objectIds.includes(13)) {
            Inventory.removeItem(5);
            return "Я нагнулся, чтобы перерубить верёвку, но моя рука дрогнула, и топор улетел в пропасть...";
        }

        return "Это делу не поможет."
    },

    open(objectIds) {
        if (CurrentLocation.get() === 11 && objectIds.includes(16)) {
            if (Inventory.includes(6) && !Flags.get("isDoorOpened")) {
                Flags.toggle("isDoorOpened");
                Inventory.removeItem(6);
                return "Я открыл дверь ключом и теперь могу пройти в замок. Правда, ключ намертво застрял в замочной скважине, но вряд ли теперь он мне понадобится.";
            } else if (!Flags.get("isDoorOpened")) {
                return "Кажется, дверь заперта. Мне нужен ключ.";
            } else {
                return "Дверь уже открыта, я могу пройти."
            }
        }
        if (CurrentLocation.get() === 18 && objectIds.includes(20) && !Flags.get("isTrapdoorOpened")) {
            return "Я не представляю, как его открыть. Здесь нет никакой ручки, не за что зацепиться.";
        }

        return "Тут нечего открывать.";
    },

    lean(objectIds) {
        if (objectIds.includes(0) && !Flags.get("isLadderLeanToTree") && Inventory.includes(0) && CurrentLocation.get() === 8) {
            Flags.toggle("isLadderLeanToTree");
            Inventory.removeItem(0);
            return "Я прислонил лестницу к дереву.";
        }

        return "Хм, это делу не поможет.";
    },

    destroy(objectIds) {
        if (objectIds.includes(0) && Inventory.includes(0)) {
            Inventory.removeItem(0);
            ItemPlaces.set(3, CurrentLocation.get());
            return "Я разломал лестницу на куски и получил неплохой длинный шест.";
        }
        if (objectIds.includes(20) && CurrentLocation.get() === 18 && !Flags.get("isTrapdoorOpened")) {
            if (Inventory.includes(5)) {
                Flags.toggle("isTrapdoorOpened");
                return "Я разломал топором деревянный люк. Теперь путь вниз открыт.";
            } else {
                return "У меня нет ничего, чем я могу сломать люк.";
            }
        }
        if (!Inventory.includes(objectIds[0]) && !Inventory.includes(objectIds[1])) {
            return "Нужно сначала взять это в руки.";
        }

        return "Я не могу это сломать";
    },

    cross(objectIds) {
        if (objectIds.includes(13) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            let answer;
            if (Inventory.includes(3)) {
                answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                if (CurrentLocation.get() === 6) {
                    CurrentLocation.set(12);
                } else {
                    CurrentLocation.set(6);
                }
            } else {
                answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
            }
            return answer;
        }

        return "Решительно не понимаю, что вы хотите сделать.";
    },

    climb(objectIds) {
        if (CurrentLocation.get() === 8) {
            if (Flags.get("isLadderLeanToTree")) {
                CurrentLocation.set(9);
                return "Я залез на дерево по лестнице.";
            } else {
                return "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться.";
            }
        }

        return "Я не могу туда залезть";
    },

    go() {
        return defaultTexts.helpMessage;
    },

    eat(objectIds) {
        if (objectIds.includes(1)) {
            if (Inventory.includes(1)) {
                Flags.toggle("isGameOver");
                Flags.toggle("isDiedFromFish");
                return "";
            } else {
                return "У меня нет рыбы.";
            }
        }

        return "Я не буду это есть.";
    },

    turnOn(objectIds) {
        if (objectIds.includes(7) && Inventory.includes(7)) {
            if (!Flags.get("isLampEmpty")) {
                Flags.toggle("isLampEmpty");
                if (CurrentLocation.get() === 23 && !Flags.get("isWormKilled")) {
                    Flags.toggle("isWormKilled");
                    return "Я включаю лампу, и её яркий свет озаряет шахту. Червь, привыкший к темноте, издаёт кошмарный вопль и уползает в глубины подземелья. Через несколько мгновений лампа тухнет.";
                } else {
                    return "Я включаю лампу, она ярко горит всего несколько мгновений, а потом тухнет.";
                }
            } else {
                return "Я пробую включить лампу, но ничего не происходит. Надо бы её заправить чем-нибудь горючим.";
            }
        }
        if (objectIds.includes(24) && CurrentLocation.get() === 25) {
            return "Может, лучше нажать на рычаг?";
        }

        return "У меня нет ничего такого, что можно было бы включить."
    },

    pour(objectIds) {
        if (objectIds.includes(8) && Inventory.includes(8)) {
            Inventory.removeItem(8);
            if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled")) {
                Flags.toggle("isMonsterKilled");
                return "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Я высыпал всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }

        return "Решительно не понимаю, что мне тут рассыпать?";
    },

    fuel(objectIds) {
        if (objectIds.includes(7) && Inventory.includes(7)) {
            if (Inventory.includes(9)) {
                if (Flags.get("isLampEmpty")) {
                    Flags.toggle("isLampEmpty");
                    return "Я залил немного масла в лампу.";
                } else {
                    return "В лампе достаточно масла, чтобы её включить.";
                }
            } else {
                return "У меня нет ничего, чем я могу заправить лампу";
            }
        } else {
            return "Не совсем понимаю, что вы хотите тут зарядить или заправить.";
        }
    },

    oil(objectIds) {
        if (Inventory.includes(9)) {
            if (objectIds.includes(24) && CurrentLocation.get() === 25) {
                if (Flags.get("isLeverOiled")) {
                    return "Рычаг уже смазан.";
                } else {
                    Flags.toggle("isLeverOiled");
                    Inventory.removeItem(9);
                    return "Я аккуратно смазал рычаг и детали управляемого им механизма, потратив всё масло.";
                }
            }
            return "Здесь смазка не нужна.";
        } else {
            return "Для этого мне понадобится масло.";
        }
    },

    press(objectIds) {
        if (objectIds.includes(24) && CurrentLocation.get() === 25) {
            if (Flags.get("isLeverOiled")) {
                Flags.toggle("isPortcullisOpened");
                return "Я нажал на рычаг. Вдали послышался какой-то лязг";
            } else {
                return "Я давлю на рычаг, но он не двигается с места. Слишком тут всё проржавело.";
            }
        }

        return "Здесь нечего нажимать."
    },

    reflect(objectIds) {
        return "Не понимаю, что вы хотите сделать.";
    },

    kiss(objectIds) {
        if (objectIds.includes(26) && CurrentLocation.get() === 28) {
            Flags.toggle("isVictory");
            return "Вы целуете принцессу в бледные губы, и её глаза открываются. Вы разбудили принцессу и выиграли игру!";
            // Выход на экран победы в игре
        }
        if (objectIds.includes(21) && CurrentLocation.get() === 5) {
            return "А вы, батенька, шалун!";
        }

        return "Я не буду это целовать.";
    },

    wake(objectIds) {
        if (objectIds.includes(26) && CurrentLocation.get() === 28) {
            return "Я бы рад разбудить её, но как? Есть конкретные предложения?";
        }

        return "Я не совсем понимаю, кого вы тут хотите разбудить.";
    }
}

export default encounters