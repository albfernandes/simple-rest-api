const util = require('../util/util');
const crudController = module.exports = {};
const dailyPattern = /diariamente/i;
const datePattern = /\//;

//TODO: refactor this function. To many loops cause a high complexity
crudController.addRule = (req, res) => {
    try {
        const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
        const rules = util.load() || [];
        if (rules.length > 0) {
            const inputRules = req.body.days;
            for (const [index, inRule] of inputRules.entries()) {
                if ((dailyPattern.test(inRule.day))) {
                    for (const [index, interval] of inRule.intervals.entries()) {
                        for (const [index, rule] of rules.entries()) {
                            for (const [index, day] of rule.days.entries()) {
                                for (const [index, inRuleInterval] of day.intervals.entries()) {
                                    if (util.isInRange(inRuleInterval.start, inRuleInterval.end, interval.start, 'HH:mm') || util.isInRange(inRuleInterval.start, inRuleInterval.end, interval.end, 'HH:mm')) {
                                        return res.status(200).json({
                                            message: 'date conflict',
                                            day: day.day,
                                            at: interval
                                        })
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (!(datePattern.test(inRule.day)))
                        inRule.day = util.getDayOfWeek(util.translateDay(inRule.day)).format('DD/MM/YYYY')

                    for (const [index, rule] of rules.entries()) {
                        for (const [index, day] of rule.days.entries()) {
                            if (!(datePattern.test(day.day)))
                                day.day = util.getDayOfWeek(util.translateDay(day.day)).format('DD/MM/YYYY')
                            if (util.compareDay(inRule.day, day.day)) {
                                for (const [index, inRuleInterval] of inRule.intervals.entries()) {
                                    for (const [index, interval] of day.intervals.entries()) {
                                        if (util.isInRange(inRuleInterval.start, inRuleInterval.end, interval.start, 'HH:mm') || util.isInRange(inRuleInterval.start, inRuleInterval.end, interval.end, 'HH:mm')) {
                                            return res.status(200).json({
                                                message: 'date conflict',
                                                day: day.day,
                                                at: interval
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            req.body.id = id;
            rules.push(req.body);
            util.save(rules);
            return res.status(201).json({message: 'Saved', data: req.body})

        } else {
            req.body.id = id;
            rules.push(req.body);
            util.save(rules);
            return res.status(201).json({message: 'Saved', data: req.body})
        }

    } catch (e) {
        console.log(e);
        return res.status(400).send(e)
    }
};

crudController.listRules = (req, res) => {
    try {
        const rules = util.load() || {message: 'Empty file'};
        return res.status(200).json(rules)
    } catch (e) {
        return res.status(400).send(e)
    }

};

crudController.removeRule = async (req, res) => {
    try {
        if (!req.query.id)
            return res.status(404).json({message: 'Missing id'});

        const rules = util.load() || [];
        if (rules.length === 0)
            return res.status(200).json({message: 'Empty file'});

        for (const [index, rule] of rules.entries()) {
            if (rule.id === req.query.id) {
                rules.splice(index, 1);
                util.save(rules);
                return res.status(200).json({message: 'Deleted', data: rule});
            }
        }
        return res.status(200).json({message: `${req.query.id} Not found`});

    } catch (e) {
        return res.status(400).send(e)
    }

};

crudController.listSchedules = (req, res) => {
    try {
        const {startDate, endDate} = req.body;
        if (!(startDate && endDate))
            return res.status(200).json({message: 'Missing payload'});

        if (!(util.validDate(startDate, 'DD/MM/YYYY') && util.validDate(endDate, 'DD/MM/YYYY')))
            return res.status(200).json({message: 'Invalid date format'});

        const rules = util.load() || [];
        if (rules.length === 0)
            return res.status(200).json({message: 'Empty file'});

        let schedulesArr = [];
        rules.map(rule => {
            rule.days.map(day => {
                if ((dailyPattern.test(day.day))) {
                    const intervalOfDays = util.getDatesFromInterval(startDate, endDate);
                    for (const [index, value] of intervalOfDays.entries()) {
                        let aux = {...day};
                        aux.day = value;
                        schedulesArr.push(aux)
                    }
                } else if ((datePattern.test(day.day))) {
                    if (util.isInRange(startDate, endDate, day.day, 'DD-MM-YYYY')) {
                        schedulesArr.push(day)
                    }
                } else {
                    const translatedDay = util.translateDay(day.day);
                    const dateOfDay = util.getDayOfWeek(translatedDay);
                    if (util.isInRange(startDate, endDate, dateOfDay, 'DD-MM-YYYY')) {
                        day.day = dateOfDay.format(('DD-MM-YYYY'));
                        schedulesArr.push(day)
                    }
                }
            });
        });
        schedulesArr = schedulesArr.sort(util.compareDates);
        const response = schedulesArr.length > 0 ? schedulesArr : {message: 'Não há horários disponiveis no intervalo informado.'}
        return res.status(200).json(response);
    } catch (e) {

    }

};



