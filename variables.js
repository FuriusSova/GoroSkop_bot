const commands = `
/start - Узнать прогноз
/help - Помощь
`;
const greetings = "Здравствуйте, %s! Выберите в меню нужный раздел.";
const chooseText = "На какой знак зодиака желаете узнать предсказание?";
const chooseDaysText = "Выберете свой знак зодиака!";
const timePattern = /\d{2}:\d{2}/;
const daysPredText = "Вы хотите получать прогноз на Ваш знак зодиака каждый день?";
const textForNextPred = "Вы будете получать предсказание для вашего зодиака каждый день (включительно сегодняшний) в %s:%s. Вы можете в любой момент отменить ежедневный прогноз в соответствующем пункте меню.";
const textForPred = `Желаете узнать еще прогноз? Нажмите на кнопку "Узнать прогноз"`;
const zodiaks = {
    1 : "Овен",
    2 : "Телец",
    3 : "Близнецы",
    4 : "Рак",
    5 : "Лев",
    6 : "Дева",
    7 : "Весы",
    8 : "Скорпион",
    9 : "Стрелец",
    10 : "Козерог",
    11 : "Водолей",
    12 : "Рыбы"
}

module.exports = {
    greetings : greetings,
    commands : commands,
    chooseText : chooseText,
    daysPredText : daysPredText,
    chooseDaysText : chooseDaysText,
    zodiaks : zodiaks,
    pattern : timePattern,
    textForNextPred : textForNextPred,
    textForPred : textForPred
};