const { Telegraf, Markup } = require('telegraf')
require("dotenv").config()
const bot = new Telegraf(process.env.BOT_TOKEN)

const vars = require("./variables");

const utils = require("util")
const { default: axios } = require("axios");
const chr = require("cheerio");
const { DESTRUCTION } = require('dns');

//Local variables

let prediction;
let $;
let zodInd;
let isChoosen = false;
let choosenTime;
let repeatedPrediction;

//User variables

let user_zod;
let userSign;

//FUNCTIONS

//Repeated prediction

const resetAtMidnight = async (ctx) => {
    try {
        let now = new Date();
        let nextDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // the next day, ...
            choosenTime[0], choosenTime[1], 0, 0 // ...at 12:00:00 hours
        );
        
        /*-----------------*/
        
        let nextDay1 = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(), // the next day, ...
            20, 0, 0, 0 // ...at 12:00:00 hours
        );
        let msNow1 = nextDay1.getTime() - now.getTime();
        
        /*---------------------*/
        
        let msToMidnight = nextDay.getTime() - now.getTime();

        repeatedPrediction = setTimeout(async function() {
            await startEveryDayPred(userSign, ctx);              //      <-- This is the function being called at midnight.
            await resetAtMidnight(ctx);    //      Then, reset again next midnight.
        }, msNow1);
    } 
    catch (e) {
        console.log(e);
    };
};

const startEveryDayPred = async (name, ctx) => {
    $ = await getHTML("https://orakul.com/");
    $(".goro-all-signs a span[class=name]").each(async function (i, elem) {
        if ($(this).text() == name){
            $ = await getHTML($(this).closest("a").attr("href"));
            prediction = $(".horoBlock p[class]").text();
            await replyFunction(ctx, name);
        }
    });
}

const replyFunction = async (ctx, name) => {
    await ctx.replyWithHTML(`<em>Прогноз на сегодня для: <b>${name}</b></em> - ${prediction.trim()}`);
    await ctx.reply(utils.format(vars.textForNextPred, choosenTime[0], choosenTime[2]));
};

//Repeated prediction

const setSign = async (ctx) => {
    if(user_zod.includes("repeated")){
        for(let i = 1; i <= 12; i++){
            if(user_zod == `zod_repeated_${i}`) {
                userSign = vars.zodiaks[i];
                await ctx.replyWithHTML(`Ваш знак зодиака : <b>${vars.zodiaks[i]}</b>`)
                await parse(userSign, ctx, "time_tod", utils.format(vars.textForNextPred, choosenTime[0], choosenTime[2]));
                await resetAtMidnight(ctx)
            }
        }
    } else if(user_zod.includes("choose")){
        for(let i = 1; i <= 12; i++){
            if(user_zod == `zod_choose_${i}`) {
                userSign = vars.zodiaks[i];
                await ctx.replyWithHTML(`Ваш знак зодиака : <b>${vars.zodiaks[i]}</b>`, Markup.inlineKeyboard(
                    [
                        [Markup.button.callback("Изменить знак зодиака", "zod_change")]
                    ]
                ));
            };
        };
    };
};

const changeZod = async (ctx) => {
    ctx.reply(vars.chooseDaysText, Markup.inlineKeyboard(
        [
            [Markup.button.callback("Овен ♈", "zod_choose_1"), Markup.button.callback("Телец ♉", "zod_choose_2")],
            [Markup.button.callback("Близнецы ♊", "zod_choose_3"), Markup.button.callback("Рак ♋", "zod_choose_4")],
            [Markup.button.callback("Лев ♌", "zod_choose_5"), Markup.button.callback("Дева ♍", "zod_choose_6")],
            [Markup.button.callback("Весы ♎", "zod_choose_7"), Markup.button.callback("Скорпион ♏", "zod_choose_8")],
            [Markup.button.callback("Стрелец ♐", "zod_choose_9"), Markup.button.callback("Козерог ♑", "zod_choose_10")],
            [Markup.button.callback("Водолей ♒", "zod_choose_11"), Markup.button.callback("Рыбы ♓", "zod_choose_12")]
        ]
    ))
    await ctx.answerCbQuery();
};

const createButtons = async (ctx) =>{
    await ctx.reply("На какое время хотите узнать прогноз?", Markup.inlineKeyboard(
        [
            [Markup.button.callback("На вчера", "time_yest"), Markup.button.callback("На сегодня", "time_tod")],
            [Markup.button.callback("На завтра", "time_tom"), Markup.button.callback("На неделю", "time_week")],
            [Markup.button.callback("На месяц", "time_month"), Markup.button.callback("На год", "time_year")]
        ]
    ))
}

const createPrediction = async (ctx, date) => {
    if (zodInd === "zod_1") {
        await parse("Овен", ctx, date);
    } else if (zodInd === "zod_2") {
        await parse("Телец", ctx, date);
    } else if (zodInd === "zod_3") {
        await parse("Близнецы", ctx, date);
    } else if (zodInd === "zod_4") {
        await parse("Рак", ctx, date);
    } else if (zodInd === "zod_5") {
        await parse("Лев", ctx, date);
    } else if (zodInd === "zod_6") {
        await parse("Дева", ctx, date);
    } else if (zodInd === "zod_7") {
        await parse("Весы", ctx, date);
    } else if (zodInd === "zod_8") {
        await parse("Скорпион", ctx, date);
    } else if (zodInd === "zod_9") {
        await parse("Стрелец", ctx, date);
    } else if (zodInd === "zod_10") {
        await parse("Козерог", ctx, date);
    } else if (zodInd === "zod_11") {
        await parse("Водолей", ctx, date);
    } else if (zodInd === "zod_12") {
        await parse("Рыбы", ctx, date);
    };
}

const reactOnMessage = async (ctx) => {
    if(isChoosen) {
        if(vars.pattern.test(ctx.message.text)){
            if(+ctx.message.text.slice(0, 2) <= 23 && +ctx.message.text.slice(3) <= 59){
                choosenTime = [+ctx.message.text.slice(0, 2), +ctx.message.text.slice(3), ctx.message.text.slice(3)];
                isChoosen = false;

                if(!userSign) {
                    await ctx.reply(vars.chooseDaysText, Markup.inlineKeyboard(
                        [
                            [Markup.button.callback("Овен ♈", "zod_repeated_1"), Markup.button.callback("Телец ♉", "zod_repeated_2")],
                            [Markup.button.callback("Близнецы ♊", "zod_repeated_3"), Markup.button.callback("Рак ♋", "zod_repeated_4")],
                            [Markup.button.callback("Лев ♌", "zod_repeated_5"), Markup.button.callback("Дева ♍", "zod_repeated_6")],
                            [Markup.button.callback("Весы ♎", "zod_repeated_7"), Markup.button.callback("Скорпион ♏", "zod_repeated_8")],
                            [Markup.button.callback("Стрелец ♐", "zod_repeated_9"), Markup.button.callback("Козерог ♑", "zod_repeated_10")],
                            [Markup.button.callback("Водолей ♒", "zod_repeated_11"), Markup.button.callback("Рыбы ♓", "zod_repeated_12")]
                        ]
                    ))
                } else {
                    await parse(userSign, ctx, "time_tod", utils.format(vars.textForNextPred, choosenTime[0], choosenTime[2]));
                    await resetAtMidnight(ctx);
                }
            } else {
                await ctx.reply("Неверный формат времени!");
                isChoosen = false;
            }
        } else {
            await ctx.reply("Неверный формат времени!");
            isChoosen = false;
        }
    }
    if(ctx.message.text == "Узнать прогноз"){
        await ctx.reply(vars.chooseText, Markup.inlineKeyboard(
            [
                [Markup.button.callback("Овен ♈", "zod_1"), Markup.button.callback("Телец ♉", "zod_2")],
                [Markup.button.callback("Близнецы ♊", "zod_3"), Markup.button.callback("Рак ♋", "zod_4")],
                [Markup.button.callback("Лев ♌", "zod_5"), Markup.button.callback("Дева ♍", "zod_6")],
                [Markup.button.callback("Весы ♎", "zod_7"), Markup.button.callback("Скорпион ♏", "zod_8")],
                [Markup.button.callback("Стрелец ♐", "zod_9"), Markup.button.callback("Козерог ♑", "zod_10")],
                [Markup.button.callback("Водолей ♒", "zod_11"), Markup.button.callback("Рыбы ♓", "zod_12")]
            ]
        ))
        await ctx.deleteMessage(ctx.message.message_id)
    };
    if (ctx.message.text == "Ежедневный прогноз"){
        if(choosenTime) {
            await ctx.reply(`Чтобы отменить ежедневный прогноз, нажмите кнопку "Отмена"`, Markup.inlineKeyboard(
                [
                    [Markup.button.callback("Отмена", "butt_cancell")]
                ]
            ));
        } else {
            await ctx.reply(vars.daysPredText, Markup.inlineKeyboard(
                [
                    [Markup.button.callback("Да", "chse_yes"), Markup.button.callback("Нет", "chse_no")]
                ]
            ));
        }
        await ctx.deleteMessage(ctx.message.message_id)
    };
    if(ctx.message.text == "Мой знак зодиака"){
        if(userSign){
            await ctx.replyWithHTML(`Ваш знак зодиака: <b>${userSign}</b>`, Markup.inlineKeyboard(
                [
                    [Markup.button.callback("Изменить знак зодиака", "zod_change")]
                ]
            ));
        } else {
            await ctx.reply("Вы еще не указали свой знак зодиака", Markup.inlineKeyboard(
                [
                    [Markup.button.callback("Указать", "butt_confirm")],
                    [Markup.button.callback("Отмена", "butt_back")]
                ]
            ));
        }
        await ctx.deleteMessage(ctx.message.message_id)
    }
}

const checkConfirmed = async (ctx, data) => {
    if(data == "butt_confirm") {
        ctx.reply(vars.chooseDaysText, Markup.inlineKeyboard(
            [
                [Markup.button.callback("Овен ♈", "zod_choose_1"), Markup.button.callback("Телец ♉", "zod_choose_2")],
                [Markup.button.callback("Близнецы ♊", "zod_choose_3"), Markup.button.callback("Рак ♋", "zod_choose_4")],
                [Markup.button.callback("Лев ♌", "zod_choose_5"), Markup.button.callback("Дева ♍", "zod_choose_6")],
                [Markup.button.callback("Весы ♎", "zod_choose_7"), Markup.button.callback("Скорпион ♏", "zod_choose_8")],
                [Markup.button.callback("Стрелец ♐", "zod_choose_9"), Markup.button.callback("Козерог ♑", "zod_choose_10")],
                [Markup.button.callback("Водолей ♒", "zod_choose_11"), Markup.button.callback("Рыбы ♓", "zod_choose_12")]
            ]
        ))
        await ctx.answerCbQuery();
    } else if (data == "butt_back"){
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }
}

// Parsing site Oracle.com

const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return chr.load(data);
};

const checkDay = async (name, ctx, date, msg) => {
    if(date === "time_tod"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На сегодня"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на сегодня для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    } else if(date === "time_yest"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На вчера"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на вчера для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    } else if(date === "time_tom"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На завтра"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на завтра для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    } else if(date === "time_week"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На неделю"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на неделю для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    } else if(date === "time_month"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На месяц"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на месяц для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    } else if(date === "time_year"){
        $(".periodMenu li a").each(async function (i, elem) {
            if($(this).text() == "На год"){
                $ = await getHTML($(this).attr("href"));
                prediction = $(".horoBlock p[class]").text();
                await ctx.replyWithHTML(`<em>Прогноз на год для: <b>${name}</b></em> - ${prediction.trim()}`);
                await ctx.reply(msg ? msg : vars.textForPred);
            }
        })
    }
}

const parse = async (name, ctx, date, msg) => {
    $ = await getHTML("https://orakul.com/");
    $(".goro-all-signs a span[class=name]").each(async function (i, elem) {
        if ($(this).text() == name){
            $ = await getHTML($(this).closest("a").attr("href"));
            await checkDay(name, ctx, date, msg);
        }
    });
};
// Parsing site Oracle.com

//Functions

bot.start(async (ctx) => {
    await ctx.reply(utils.format(vars.greetings, ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.username), Markup.keyboard(
        [
            [Markup.button.callback("Узнать прогноз", "butt_pred"), Markup.button.callback("Ежедневный прогноз", "butt_day_pred")],
            [Markup.button.callback("Мой знак зодиака", "butt_profile")]
        ]
    ).resize())
})

bot.on("message", async (ctx) => {
    reactOnMessage(ctx);
})

bot.help((ctx) => ctx.reply(vars.commands))

bot.action(["zod_1", "zod_2", "zod_3", "zod_4", "zod_5", "zod_6", "zod_7", "zod_8", "zod_9", "zod_10", "zod_11", "zod_12"], async ctx => {
    zodInd = ctx.callbackQuery.data;
    await createButtons(ctx);
    await ctx.answerCbQuery();
})

bot.action(["zod_repeated_1", "zod_repeated_2", "zod_repeated_3", "zod_repeated_4", "zod_repeated_5", "zod_repeated_6", "zod_repeated_7", "zod_repeated_8", "zod_repeated_9", "zod_repeated_10", "zod_repeated_11", "zod_repeated_12", "zod_choose_1", "zod_choose_2", "zod_choose_3", "zod_choose_4", "zod_choose_5", "zod_choose_6", "zod_choose_7", "zod_choose_8", "zod_choose_9", "zod_choose_10", "zod_choose_11", "zod_choose_12"], async ctx => {
    user_zod = ctx.callbackQuery.data;
    await setSign(ctx);
    await ctx.answerCbQuery();
})


bot.action(["time_yest", "time_tod", "time_tom", "time_week", "time_month", "time_year"], async ctx => {
    await createPrediction(ctx, ctx.callbackQuery.data);
    await ctx.answerCbQuery();
})

bot.action(["chse_yes", "chse_no"], async ctx => {
    if(ctx.callbackQuery.data == "chse_yes"){
        await ctx.editMessageText("На которое время хотите получать прогноз? Напишите боту время в формате: 09:00", ctx.callbackQuery.message.message_id);
        isChoosen = true;
    } else if (ctx.callbackQuery.data == "chse_no"){
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }
})

bot.action(["butt_confirm", "butt_back"], async ctx => {
    checkConfirmed(ctx, ctx.callbackQuery.data);
})

bot.action("zod_change", async ctx => {
    await changeZod(ctx)
})

bot.action("butt_cancell", async ctx => {
    choosenTime = "";
    clearTimeout(repeatedPrediction);
    await ctx.editMessageText("Ежедневный прогноз был отменён, чтобы снова его запустить, выберите соответствующий пункт меню.", ctx.callbackQuery.message.message_id);
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
