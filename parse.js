/*
const { default: axios } = require("axios");
const chr = require("cheerio")
let $; 

const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return chr.load(data);
};

const parse = async (name) => {
    $ = await getHTML("https://orakul.com/");
    $(".goro-all-signs a span[class=name]").each(async function (i, elem) {
        if ($(this).text() == name){
            $ = await getHTML($(this).closest("a").attr("href"));
            doubleExport("chto-to");
            //prediction = $(".horoBlock p[class]").text();
            //console.log(prediction);
        }
    });
};

exports.parsing = parse;*/