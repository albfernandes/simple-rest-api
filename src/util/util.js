const fs = require('fs');
const util = module.exports = {};
const dataFilePath = 'src/database/schedules.json';

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