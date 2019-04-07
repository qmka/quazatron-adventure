import Inventory from '../classes/inventory.js'
import CurrentLocation from '../classes/location.js'
import Flags from '../classes/flags.js'
import ItemPlaces from '../classes/itemplaces.js'
import Counters from '../classes/counters.js';

import objects from '../gamedata/objects.js';
import {
    defaultTexts
} from '../gamedata/default-data.js';

const encounters = {
    // Добавляем дополнительную информацию к описанию локации в зависимости от различных условий
    addDescription() {
        const currentLocation = CurrentLocation.get();
        let encounter;
        switch (currentLocation) {
            case 7:
                if (!Flags.get("isTrollKilled")) encounter = 'Путь на восток преграждает толстый !*тролль*!.';
                break;
            case 8:
                if (Flags.get("isLadderLeanToTree")) encounter = 'К дереву приставлена !*лестница*!.';
                break;
            case 11:
                if (Flags.get("isDoorOpened")) encounter = 'Дверь открыта.';
                break;
            case 17:
                if (!Flags.get("isPortcullisOpened")) encounter = 'Решётка опущена - не пройти.';
                else encounter = "Решётка поднята к потолку.";
                break;
            case 18:
                if (Flags.get("isTrapdoorOpened")) encounter = 'В полу комнаты дыра, через которую можно спуститься вниз.';
                else encounter = 'В полу есть закрытый !*люк*!.';
                break;
            case 20:
                if (!Flags.get("isMonsterKilled")) encounter = 'Северный проход охраняет страшный ледяной !*монстр*!.';
                break;
            case 23:
                if (!Flags.get("isWormKilled")) encounter = 'Вход в южный тоннель преграждает огромный скальный !*червь*!.';
                break;
            case 27:
                if (!Flags.get("isWitchKilled")) encounter = 'В противоположном конце комнаты вы видите ведьму. Её !*заклятье*! летит прямо в вашу сторону, нужно быстро что-то делать!';
                break;
        }
        if (encounter) {
            return `<p>${encounter}</p>`;
        } else {
            return '';
        }
    },

    // Прокручиваем все заданные игрой счётчики
    setCounters() {
        Counters.increase('gameTurns');
    },

    // Проверяем, мешает ли игроку что-либо двигаться в выбранном им направлении
    checkPlayerObstacles(direction) {
        const currentLocation = CurrentLocation.get();

        if (currentLocation === 7 && !Flags.get("isTrollKilled") && direction === 'e') {
            return "Тролль рычит и не даёт мне пройти.";
        }
        if (currentLocation === 8 && !Flags.get("isLadderLeanToTree") && direction === 'u') {
            return "Вы не можете залезть на дерево. Ствол очень гладкий, не за что зацепиться";
        }
        if (currentLocation === 11 && !Flags.get("isDoorOpened") && direction === 'e') {
            return "Дверь закрыта, вы не можете туда пройти.";
        }
        if (currentLocation === 17 && !Flags.get("isPortcullisOpened") && direction === 'n') {
            return "Решётка опущена до пола, она мешает вам пройти.";
        }
        if (currentLocation === 18 && !Flags.get("isTrapdoorOpened") && direction === 'd') {
            return "Путь вниз вам преграждает закрытый люк.";
        }
        if (currentLocation === 20 && !Flags.get("isMonsterKilled") && direction === 'n') {
            return "Ледяной монстр мешает вам пройти.";
        }
        if (currentLocation === 23 && !Flags.get("isWormKilled") && direction === 's') {
            return "Скальный червь мешает вам пройти.";
        }

        return "";
    },

    // Функция возвращает текст для вывода на экран окончания игры
    getGameOverText() {
        if (Flags.get("isDiedFromFish")) {
            return 'Вы почувствовали острую боль в животе и умерли. Глупо, конечно, заканчивать это приключение, отравившись протухшей рыбой...';
        }
        if (Flags.get("isDiedFromTrollWithAxe")) {
            return 'Да, не стоило с маленьким топориком лезть на большого тролля. Вы успели нанести всего несколько ударов перед тем, как тролль разорвал вас на куски...';
        }
        if (Flags.get("isDiedFromTrollWithStick")) {
            return 'Вы прыгнули на тролля, словно черепашка-ниндзя, размахивая шестом, и даже умудрились заехать ему по голове. Взревев от боли, тролль бросился на вас и разорвал на куски...';
        }
        if (Flags.get("isDiedFromTrollWithoutWeapon")) {
            return 'Нападать на тролля с голыми руками - верная смерть. Впрочем, подумать об этом вы успели лишь за секунду до того, как тяжёлая лапа тролля раскрошила ваш череп...';
        }
        if (Flags.get("isDiedFromWorm")) {
            return 'Шкура скального червя настолько твёрдая, что было бы глупо надеяться повредить её любым из имеющихся в вашем распоряжении предметов, ну а тем более голыми руками. Разозлённый червь заглатывает вас целиком и, похоже, это конец вашего приключения...';
        }
        if (Flags.get("isDiedFromMonster")) {
            return 'На такого монстра идти разве что с боевым ледорубом. Об этом вы успеваете подумать за секунду до того, как разъярённый монстр одним касанием превращает вас в глыбу льда, добавив прохлады этой и так не самой тёплой комнате замка...';
        }
        if (Flags.get("isDiedFromLady")) {
            return 'Увидев злой блеск в ваших глазах, старушка  вскакивает и вскидывает руку в вашу сторону, произнося короткое слово на неизвестном вам языке. С её пальцев срывается огненный шар, который превращает вас в кучку углей...';
        }
        if (Flags.get("isKilledPrincess")) {
            return 'Решив, что незачем вам делить власть с какой-то незнакомкой, вы решаете убить принцессу.<br><br>Спустя несколько месяцев вы отремонтируете замок и очистите окрестные леса от монстров. Люди, конечно, потянутся в освобождённые от колдовства земли, да только злой и лихой это будет люд.<br><br>Однажды вы не проснётесь с утра, не узнав, что вас убило: то ли яд в вине, то ли кинжал ночного убийцы. Но память о вас останется, и ещё долго будет ходить из уст в уста легенда о Кровавом Короле.';
        }
        if (Flags.get("isFellIntoAbyss")) {
            return 'Балансировать над пропастью с шестом в руках и тяжёлой вязанкой дров за спиной, наверное, весело, будь вы профессиональным акробатом. Но, не успев сделать и пары шагов, вы срываетесь в пропасть...';
        }

        return defaultTexts.defaultGameOverText;
    },

    // Функция проверяет, действует ли в локации какое-либо условие, не укладывающееся в общую логику игры.
    getUniqueEncounter(verbId, objectIds) {
        let answer, flag = false;

        // В локации с ведьмой у игрока только один ход, чтобы отразить заклятье, иначе его выбрасывает в предыдущую комнату
        if (CurrentLocation.get() === 27 && !Flags.get("isWitchKilled")) {
            flag = true;
            if (verbId === 38 && objectIds.includes(25)) {
                if (Inventory.includes(10)) {
                    Flags.toggle("isWitchKilled");
                    Inventory.removeItem(10);
                    answer = "Вы отразили заклятье мечом, и оно ударило прямо в ведьму! Издав истошный крик, ведьма рассыпалась в пыль. К сожалению, меч тоже не уцелел.";
                } else {
                    CurrentLocation.set(17);
                    answer = "Вам нечем отразить заклятье. Заклятье ударяет вам в грудь и выкидывает в комнату с решёткой."
                }
            } else {
                CurrentLocation.set(17);
                answer = "Вы не успеваете ничего сделать. Заклятье ударяет вам в грудь и выкидывает в комнату с решёткой.";
            }
        }

        return {
            answer,
            flag
        }
    },

    take(objectIds) {
        // Если игрок хочет взять всё
        if (objectIds.includes(28)) {
            // Проверяем, есть ли предметы в локации
            const itemsArray = ItemPlaces.getLocationItemsArray(CurrentLocation.get());
            const answer = Inventory.getItemsString(itemsArray, defaultTexts.playerTakeItems, defaultTexts.thereIsNoItems);
            if (itemsArray.length !== 0) {
                
                itemsArray.forEach((item) => {
                    Inventory.addItem(item);
                    ItemPlaces.set(item, -1);
                });
            };
            return answer;
        }

        // Если предмет - лестница, и она прислонена к дереву, то можно её забрать в инвентарь
        if (objectIds.includes(0) && Flags.get("isLadderLeanToTree")) {
            Flags.toggle("isLadderLeanToTree");
            Inventory.addItem(0);
            return "Вы забрали лестницу.";
        }

        return "Вы не можете это сделать.";
    },

    drop(objectIds) {
        // Положить всё
        if (objectIds.includes(28)) {
            // Проверяем, есть ли предметы в локации
            const itemsArray = Inventory.getAll();
            const answer = Inventory.getItemsString(itemsArray, defaultTexts.playerDropItems, defaultTexts.playerHasNoItems);
            if (itemsArray.length !== 0) {
                itemsArray.forEach((item) => {
                    Inventory.removeItem(item);
                    ItemPlaces.set(item, CurrentLocation.get());
                });
            };
            return answer;
        }

        if (objectIds.includes(8) && Inventory.includes(8)) {
            Inventory.removeItem(8);
            if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled") && objectIds.includes(23)) {
                Flags.toggle("isMonsterKilled");
                return "Вы бросили мешочек с солью в монстра, и как только крупинки соли коснулись его кожи, монстр превратился в лужу воды.";
            } else {
                return "Вы рассыпали всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }
        if (objectIds.includes(5) && Inventory.includes(5)) {
            return "Это явно не метательный топорик. Стоит попробовать что-то другое.";
        }
        if (objectIds.includes(2) && Inventory.includes(2)) {
            return "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
        }

        if ((objectIds.includes(11) && Inventory.includes(11)) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            Inventory.removeItem(11);
            return "Вы бросили монетку на землю, и она укатилась в пропасть.";
        }

        if ((objectIds.includes(12) && Inventory.includes(12)) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            Inventory.removeItem(12);
            return "Вы бросили монетку на землю, и она укатилась в пропасть.";
        }

        return defaultTexts.playerUselessAction;
    },

    examine(objectId) {
        const currentLocation = CurrentLocation.get();

        if (currentLocation === 8 && objectId === 0 && Flags.get("isLadderLeanToTree")) {
            return "Лестница приставлена к дереву. Вы можете залезть наверх.";
        }
        if (currentLocation === 14 && objectId === 14) {
            let answer = "Ветви этого куста похожи на щупальца.";
            if (!Flags.get("isKeyRevealed")) {
                Flags.toggle("isKeyRevealed");
                ItemPlaces.set(6, 14);
                answer += " На одном из таких щупальцев вы обнаружили ключ.";
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
            return Flags.get("isPortcullisOpened") ? "Решётка поднята к потолку - проход свободен." : "Это мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то найдётся подъёмный механизм?";
        }
        if (currentLocation === 18 && objectId === 20) {
            return Flags.get("isTrapdoorOpened") ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Вы не видите никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
        }
        if (currentLocation === 23 && !Flags.get("isWormKilled") && objectId === 22) {
            return "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
        }
        if (currentLocation === 20 && !Flags.get("isMonsterKilled") && objectId === 23) {
            return "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
        }
        if (currentLocation === 25 && objectId === 24) {
            return Flags.get("isLeverOiled") ? "Это ржавый рычаг, присоединённый к какому-то механизму. Вы его смазываете, и теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
        }
        if (objectId === 4 && Inventory.includes(4)) {
            let answer = objects[4].desc;
            if (!Flags.get("isAxeRevealed")) {
                Flags.toggle("isAxeRevealed");
                ItemPlaces.set(5, currentLocation);
                answer += " Осматривая вязанку, вы обнаружили спрятанный в ней топор.";
            }
            return answer;
        }
        if (objectId === 27 && Inventory.includes(27)) {
            return objects[27].desc + ` Они показывают число ${Counters.get('gameTurns')}.`;
        }

        return defaultTexts.defaultDescription;
    },

    wait() {
        return "Я немного передохнул. Время двигаться дальше!";
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
                return "Вы купили у старушки лампу за серебряную монету.";
            } else if (Inventory.includes(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "У вас нет денег."
            }
        }

        return "Вы не можете это купить";
    },

    pay(objectIds) {
        if (CurrentLocation.get() === 5) {
            if (objectIds.includes(11) && Inventory.includes(11)) {
                Inventory.removeItem(11);
                Inventory.addItem(7);
                return "Вы купили у старушки лампу за серебряную монету.";
            } else if (Inventory.includes(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "Вам нужны деньги, чтобы заплатить."
            }
        }
        if (CurrentLocation.get() === 7 && !Flags.get("isTrollKilled")) {
            return "Тролль злобно рычит на вас.";
        }

        return "Похоже, здесь никому не нужны деньги.";
    },

    hit(objectIds) {
        if (CurrentLocation.get() === 7 && !Flags.get("isTrollKilled") && objectIds.includes(17)) {
            if (Inventory.includes(2) && objectIds.includes(2)) {
                Flags.toggle("isTrollKilled");
                Inventory.removeItem(2);
                return "Вы бросились на тролля и вломили ему булавой прямо по макушке! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Теперь путь на восток свободен.";
            }
            if (Inventory.includes(5) && objectIds.includes(5)) {
                Flags.toggle("isGameOver");
                Flags.toggle("isDiedFromTrollWithAxe");
                return "";
            }
            if (Inventory.includes(3) && objectIds.includes(3)) {
                Flags.toggle("isGameOver");
                Flags.toggle("isDiedFromTrollWithStick");
                return "";
            }
            if (!Inventory.includes(3) && !Inventory.includes(5)) {
                Flags.toggle("isGameOver");
                Flags.toggle("isDiedFromTrollWithoutWeapon");
                return "";
            }
            return "Уточните, чем это вы собираетесь убивать тролля?";
        }
        if (CurrentLocation.get() === 5 && objectIds.includes(21)) {
            if (Inventory.includes(5) && objectIds.includes(5)) {
                return "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения? ;)";
            }
            Flags.toggle("isGameOver");
            Flags.toggle("isDiedFromLady");
            return "";
        }
        if (CurrentLocation.get() === 23 && !Flags.get("isWormKilled") && objectIds.includes(22)) {
            Flags.toggle("isGameOver");
            Flags.toggle("isDiedFromWorm");
            return "";
        }
        if (CurrentLocation.get() === 28 && objectIds.includes(26)) {
            Flags.toggle("isGameOver");
            Flags.toggle("isKilledPrincess");
            return "";
        }
        if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled") && objectIds.includes(23)) {
            Flags.toggle("isGameOver");
            Flags.toggle("isDiedFromMonster");
            return "";
        }
        if (Inventory.includes(5) && objectIds.includes(5)) {
            return "Ничего не произошло. Подсказка: если хотите что-то порубить топором, то лучше введите РУБИТЬ или РАЗРУБИТЬ... или ПОРУБИТЬ, ну, в общем, вы поняли."
        }

        return "Ничего не произошло.";
    },

    chop(objectIds) {
        if (!Inventory.includes(5)) {
            return "У вас нет топора."
        }
        if (CurrentLocation.get() === 18 && objectIds.includes(20) && !Flags.get("isTrapdoorOpened")) {
            Flags.toggle("isTrapdoorOpened");
            return "Вы разломали топором деревянный люк. Теперь можно спуститься вниз.";
        }
        if ((CurrentLocation.get() === 7 && objectIds.includes(17)) || (CurrentLocation.get() === 20 && objectIds.includes(23)) || (CurrentLocation.get() === 23 && objectIds.includes(22))) {
            return "Этот топор хорош для колки дров, но в бою будет маловат и неудобен.";
        }
        if (CurrentLocation.get() === 8 && objectIds.includes(18)) {
            Inventory.removeItem(5);
            return "Бить топором об камень - не самая хорошая идея. Но, тем не менее, вы с размаху бьёте топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и топор разлетается на куски.";
        }
        if (CurrentLocation.get() === 14 && objectIds.includes(14)) {
            return "Вы когда-нибудь пробовали рубить топором кусты? Попробуйте на досуге. Здесь пригодился бы секатор, ну, или штыковая лопата, но уж точно не топор";
        }
        if (Inventory.includes(3) && objectIds.includes(3)) {
            Inventory.removeItem(3);
            return "В ярости вы накинулись на шест и порубили его в труху.";
        }
        if (ItemPlaces.get(3) === CurrentLocation.get() && objectIds.includes(3)) {
            ItemPlaces.set(3, -1);
            return "В ярости вы накинулись на шест и порубили его в труху.";
        }
        if (Inventory.includes(4) && objectIds.includes(4)) {
            Inventory.removeItem(4);
            return "С особой жестокостью я превратил дрова в щепки.";
        }
        if (ItemPlaces.get(4) === CurrentLocation.get() && objectIds.includes(4)) {
            ItemPlaces.set(4, -1);
            return "С особой жестокостью я превратил дрова в щепки.";
        }
        if (CurrentLocation.get() === 5 && objectIds.includes(21)) {
            return "Вам не кажется, что эта ситуация со старушкой и топором - немного из другого произведения?";
        }
        if ((CurrentLocation.get() === 6 || CurrentLocation.get() === 12) && objectIds.includes(13)) {
            Inventory.removeItem(5);
            return "Вы нагнулись, чтобы перерубить верёвку, но ваша рука дрогнула, и топор улетел в пропасть...";
        }

        return "Это делу не поможет."
    },

    open(objectIds) {
        if (CurrentLocation.get() === 11 && objectIds.includes(16)) {
            if (Inventory.includes(6) && !Flags.get("isDoorOpened")) {
                Flags.toggle("isDoorOpened");
                Inventory.removeItem(6);
                return "Вы открыли дверь ключом и теперь можете пройти в замок. Правда, ключ намертво застрял в замочной скважине, ну и фиг с ним.";
            } else if (!Flags.get("isDoorOpened")) {
                return "Кажется, дверь заперта. Вам нужен ключ.";
            } else {
                return "Дверь уже открыта, вы може пройти на восток, в замок."
            }
        }
        if (CurrentLocation.get() === 18 && objectIds.includes(20) && !Flags.get("isTrapdoorOpened")) {
            return "Не получается его открыть. Здесь нет никакой ручки, не за что зацепиться.";
        }

        return "Тут нечего открывать.";
    },

    lean(objectIds, objectsInInput) {
        if (objectIds.includes(0)) {
            if (objectIds.includes(18) && !Flags.get("isLadderLeanToTree") && Inventory.includes(0) && CurrentLocation.get() === 8) {
                Flags.toggle("isLadderLeanToTree");
                Inventory.removeItem(0);
                return "Вы приставили лестницу к дереву.";
            } else if (objectsInInput === 1) {
                return "Уточните, к чему вы хотите приставить лестницу.";
            }
        }

        return "Хм, это делу не поможет.";
    },

    destroy(objectIds) {
        if (objectIds.includes(0) && Inventory.includes(0)) {
            Inventory.removeItem(0);
            ItemPlaces.set(3, CurrentLocation.get());
            return "Вы разломали лестницу на куски. Одна из вертикальных опор может для чего-нибудь сгодиться как длинный шест.";
        }
        if (objectIds.includes(20) && CurrentLocation.get() === 18 && !Flags.get("isTrapdoorOpened")) {
            if (Inventory.includes(5)) {
                Flags.toggle("isTrapdoorOpened");
                return "Вы разломали топором деревянный люк. Теперь путь вниз открыт.";
            } else {
                return "Вы пинаете ногами люк, прыгаете на нём, но не можете его сломать.";
            }
        }
        if (!Inventory.includes(objectIds[0]) && !Inventory.includes(objectIds[1])) {
            return "Нужно сначала взять это в руки.";
        }

        return "Вы не можете это сломать.";
    },

    cross(objectIds) {
        if (objectIds.includes(13) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            let answer;
            if (Inventory.includes(3)) {
                if (Inventory.includes(4)) {
                    Flags.toggle("isGameOver");
                    Flags.toggle("isFellIntoAbyss");
                    return "";
                } else {
                    answer = "Балансируя с помощью шеста, вы пересекли расщелину по верёвке.";
                    if (CurrentLocation.get() === 6) {
                        CurrentLocation.set(12);
                    } else {
                        CurrentLocation.set(6);
                    }
                }
            } else {
                answer = "Вы упадёте с верёвки, нужно что-то для балланса.";
            }
            return answer;
        }

        return "Непонятно, что вы хотите сделать.";
    },

    climb(objectIds) {
        if (CurrentLocation.get() === 8) {
            if (Flags.get("isLadderLeanToTree")) {
                CurrentLocation.set(9);
                return "Вы залезли на дерево по лестнице.";
            } else {
                return "Вы не можете залезть на дерево, потому что его ствол гладкий, и не за что зацепиться.";
            }
        }

        return "Вы не можете туда залезть.";
    },

    go(objectIds) {
        if (objectIds.includes(13) && (CurrentLocation.get() === 6 || CurrentLocation.get() === 12)) {
            return this.cross(objectIds);
        }
        return defaultTexts.playerCantGo;
    },

    eat(objectIds) {
        if (objectIds.includes(1)) {
            if (Inventory.includes(1)) {
                Flags.toggle("isGameOver");
                Flags.toggle("isDiedFromFish");
                return "";
            } else {
                return "У вас нет рыбы.";
            }
        }

        return "Это несъедобно.";
    },

    turnOn(objectIds) {
        if (objectIds.includes(7) && Inventory.includes(7)) {
            if (!Flags.get("isLampEmpty")) {
                Flags.toggle("isLampEmpty");
                if (CurrentLocation.get() === 23 && !Flags.get("isWormKilled")) {
                    Flags.toggle("isWormKilled");
                    return "Вы включаете лампу, и её яркий свет озаряет шахту. Червь, привыкший к темноте, издаёт кошмарный вопль и уползает в глубины подземелья. Через несколько мгновений лампа тухнет.";
                } else {
                    return "Вы включаете лампу, она ярко горит всего несколько мгновений, а потом тухнет.";
                }
            } else {
                return "Вы пробуете включить лампу, но ничего не происходит. Надо бы её заправить чем-нибудь горючим.";
            }
        }
        if (objectIds.includes(24) && CurrentLocation.get() === 25) {
            return "Может, лучше нажать на рычаг?";
        }

        return "У вас нет ничего такого, что можно было бы включить."
    },

    pour(objectIds) {
        if (objectIds.includes(8) && Inventory.includes(8)) {
            Inventory.removeItem(8);
            if (CurrentLocation.get() === 20 && !Flags.get("isMonsterKilled")) {
                Flags.toggle("isMonsterKilled");
                return "Вы бросили мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Вы высыпали всю соль. Непонятно, правда, зачем было так делать - вдруг она бы пригодилась?";
            }
        }

        return "Это нельзя рассыпать.";
    },

    fuel(objectIds) {
        if (objectIds.includes(7) && Inventory.includes(7)) {
            if (objectIds.includes(9)) {
                if (Inventory.includes(9)) {
                    if (Flags.get("isLampEmpty")) {
                        Flags.toggle("isLampEmpty");
                        return "Вы залили немного масла в лампу.";
                    } else {
                        return "В лампе достаточно масла, чтобы её включить.";
                    }
                } else {
                    return "У вас нет ничего, чем вы можете заправить лампу";
                }
            } else {
                return "Уточните, чем вы хотите заправить лампу?";
            }
        } else {
            return "Здесь нечего зарядить или заправить.";
        }
    },

    oil(objectIds) {
        if (Inventory.includes(9)) {
            if (objectIds.includes(24) && CurrentLocation.get() === 25) {
                if (objectIds.includes(9)) {
                    if (Flags.get("isLeverOiled")) {
                        return "Рычаг уже смазан.";
                    } else {
                        Flags.toggle("isLeverOiled");
                        Inventory.removeItem(9);
                        return "Вы аккуратно смазали рычаг и детали управляемого им механизма, потратив всё масло.";
                    }
                } else {
                    return "Уточните, чем вы хотите смазать рычаг?";
                }
            }
            return "Здесь смазка не нужна.";
        } else {
            return "Для этого вам понадобится масло.";
        }
    },

    press(objectIds) {
        if (objectIds.includes(24) && CurrentLocation.get() === 25) {
            if (Flags.get("isLeverOiled")) {
                Flags.toggle("isPortcullisOpened");
                return "Вы нажали на рычаг. Вдали послышался какой-то лязг";
            } else {
                return "Вы давите на рычаг, но он не двигается с места. Слишком тут всё проржавело.";
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

        return "Не стоит к этому прикасаться губами.";
    },

    wake(objectIds) {
        if (objectIds.includes(26) && CurrentLocation.get() === 28) {
            return "Было бы здорово разбудить её, но как? Есть конкретные предложения?";
        }

        return "Непонятно, кого вы тут хотите разбудить.";
    }
}

export default encounters