const defaultTexts = {
    info: 'Вводите команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, <span style="color: yellow;">ВЗЯТЬ ЛЕСТНИЦУ</span> или <span style="color: yellow;">ОТКРЫТЬ ДВЕРЬ КЛЮЧОМ.</span> Регистр букв не имеет значения. Используйте команды <span style="color: yellow;">С (север), Ю (юг), З (запад), В (восток), Х (вверх), Н (вниз)</span> для передвижения. <span style="color: yellow;">ОСМОТРИ</span> помогает получить больше информации об игровых объектах. <span style="color: yellow;">И</span> - ваш инвентарь. <span style="color: yellow;">ВЫХОД</span> - вернуться на стартовый экран. <span style="color: yellow;">СОХРАНИ</span> и <span style="color: yellow;">ЗАГРУЗИ</span> - сохранение и загрузка игры. Остальные команды вам предстоит открыть самостоятельно. Удачной игры!',

    startMainText: '!*❀⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱СПЯЩАЯ КРАСАВИЦА⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱❀*!<p>В этом приключении вам нужно пробраться в заброшенный замок, найти волшебный меч и спасти спящую беспробудным сном красавицу, которую усыпила злая ведьма.</p><p>Исследуйте мир игры, отдавая компьютеру текстовые команды. Если не знаете, как это делается, введите команду-подсказку <span style="color: yellow;">ИНФО</span>.</p>',

    victoryText: `Вы целуете принцессу, и её глаза медленно открываются...<br>Поздравляю! Вы уничтожили злую ведьму, разбудили принцессу и выиграли эту игру!<br><br>В ближайшее время в эти места снова потянутся люди, вы отремонтируете замок, избавите окрестные леса от монстров и станете новым королём. Вы будете править много лет, совершите много подвигов, и о вас будут складывать легенды!<br><br>Надеюсь, игра вам понравилась. Следите за анонсами новых игр на сайте <a href="https://quazatron.ru" target="_blank">Quazatron Adventure</a>.`,

    helpMessage: 'Используйте команды <span style="color: yellow;">С (север), Ю (юг), З (запад), В (восток), Х (вверх), Н (вниз)</span> для передвижения.',

    defaultDescription: 'Ничего необычного.',

    defaultQuestion: 'Что будете делать?',

    defaultAnswer: 'Я не понимаю.',

    parserDontUnderstandWord: 'Я не понимаю слово ',
    
    defaultAnswerToTake: 'Ок, взял.',

    playerDropsItem: 'Ок, положил.',

    playerHasNoItem: 'У меня этого нет.',

    objectIsNotInLocation: 'Здесь этого нет.',

    playerCantGo: 'Вы не можете туда пройти.',

    playerUselessAction: 'Это делу не поможет.',

    playerCommandsVerbWithoutObject: 'Укажите предмет или игровой объект, к которому должно быть применено это действие.',

    cancelMove: 'Вы вернулись на один ход назад.',

    cannotCancelMove: 'Невозможно отменить ход, пока ещё нет записанных ходов.',

    itemsInLocation: 'Здесь также есть:',

    itemNotInInventory: 'Чтобы внимательно осмотреть предмет, сначала возьмите его в руки.',

    specifyAdjective: 'Пожалуйста, уточните прилагательное для этого объекта.',

    specifyObject: 'Пожалуйста, уточните, какой конкретно из объектов вы имеете ввиду?',

    specifyDirection: 'Уточните, куда конкретно вы хотите попасть?',

    okMessage: "Ок",

    firstGameMessage: 'Ваше приключение начинается! Что будете делать?',

    pressEnterToStart: 'Нажмите ENTER для начала игры',

    pressEnterToStartAgain: 'Нажмите ENTER, если хотите снова сыграть.',

    defaultGameOverText: 'Ваша игра закончилась.',

    saveGame: 'Игра сохранена в локальном хранилище браузера.',

    loadGame: 'Игра загружена.',

    cantLoadGame: 'Сохранённая игра отсутствует.'
}

const defaultImages = {
    startImage: '<img src="img/startscreen.png">',
    gameOverImage: '<img src="img/gameover.png">',
    victoryImage: '<img src="img/victory.png">'
}

export {
    defaultTexts,
    defaultImages
};