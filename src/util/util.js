const fs = require('fs');
const util = module.exports = {};
const dataFilePath = 'src/database/schedules.json';
const moment = require('moment');

util.save = (content) => {
    try {
        const contentString = JSON.stringify(content);
        fs.writeFileSync(dataFilePath, contentString);
    } catch(err) {
        console.error(err);
        throw err;
    }
};

util.load = () => {
    try {
        const fileBuffer = fs.readFileSync(dataFilePath, 'utf-8');
        if(fileBuffer !== '' && fs.existsSync(dataFilePath))
            return JSON.parse(fileBuffer);
    } catch(err) {
        console.error(err);
        throw err;
    }
};

util.isInRange = (startDate, endDate, target, mask) => {
    startDate = moment(startDate, mask);
    endDate = moment(endDate, mask);
    target = moment(target, mask);
    return target.isBetween(startDate, endDate, null, '[]') ? target : false;
};


util.getDayOfWeek = (day) => {
    const dateofday = moment().day(day);
    return dateofday < moment() ? dateofday.add(7, 'days') : moment().day(day);
};

util.compareDates = (a, b) => {
    a = moment(a.day, "DD-MM-YYYY");
    b = moment(b.day, "DD-MM-YYYY");
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

util.translateDay = (day) => {
    if(/segundas/.test(day))
        return 'monday';
    if(/terças/.test(day))
        return 'tuesday';
    if(/quartas/.test(day))
        return 'wednesday';
    if(/quintas/.test(day))
        return 'thursday';
    if(/sextas/.test(day))
        return 'friday';
    if(/sabados/.test(day))
        return 'saturday';
    if(/domingos/.test(day))
        return 'sunday'
};

util.validDate = (date, format) => {
    return moment(date, format).isValid()
};

util.getDatesFromInterval = (startDate, endDate) => {
    let arr = [];
    startDate = moment(startDate, "DD/MM/YYYY");
    endDate = moment(endDate, "DD/MM/YYYY");
    while (startDate <= endDate) {
        arr.push(moment(startDate, "DD/MM/YYYY").format('DD-MM-YYYY'));
        startDate.add(1, 'days');
    }
    return arr;
};

util.compareDay = (dayA, dayB) => {
    dayA = moment(dayA, "DD-MM-YYYY");
    dayB = moment(dayB, "DD-MM-YYYY");
    return dayA.isSame(dayB)
};
