import fetch from 'node-fetch';
import { load } from 'cheerio';
import { readFile, writeFile } from 'fs/promises';

// function to get the raw data
const getRawData = async (URL) => {
    const response = await fetch(URL);
    const data = await response.text();
    return data;
};

// URL for data
const URL = "https://www.umass.edu/mail/campus-building-addresses";

const scrape = async () => {
    let fullData = [];
    const rawData = await getRawData(URL);
    const parsed = load(rawData);
    let table = parsed('table:first-of-type');
    let child = table.children().first().children().first();
    child = child.next();
    while (child.html()) {
        let inside = child.children().first();
        let data = {
            name: trimText(inside.text()),
            address: trimText(inside.next().text()),
            zip: trimText(inside.next().next().text())
        }
        fullData.push(data);
        child = child.next();
    }

    table = parsed('table:nth-of-type(2)');
    child = table.children().first().children().first();
    child = child.next();
    while (child.html()) {
        let inside = child.children().first();
        let data = {
            name: trimText(inside.text()),
            address: trimText(inside.next().text()),
            zip: trimText(inside.next().next().text())
        }
        fullData.push(data);
        child = child.next();
    }
    await writeFile('locations.json', JSON.stringify(fullData), 'utf8');
}

/**
 * 
 * @param {*} elem 
 * @returns 
 */
function trimText(elem) {
    return elem.split('\n').join('').split('\t').join('');
}

scrape();