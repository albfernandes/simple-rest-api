const util = require('../../util/util');
const moment = require('moment');
const a = moment(new Date('10/12/2019')).format('DD/MM/YYYY');
const b = moment(new Date('11/12/2019')).format('DD/MM/YYYY');
const c = moment(new Date('12/12/2019')).format('DD/MM/YYYY');

testtranslateDay = () => {
    console.log(util.translateDay('segundas') === 'monday');
};

testcompareDay = () => {
    console.log(util.compareDay('10/10/2019', '10/10/2019'));
};

testvalidDate = () => {
    console.log(util.validDate('10/10/2019', 'DD/MM/YYYY'));
};

testisInRange = () => {
    const response = util.isInRange(a, c, b, 'DD/MM/YYYY');
    if(response){
        console.log(true);
    }else{
        console.log(response)
    }
};

testtranslateDay();
testcompareDay();
testvalidDate();
testisInRange();