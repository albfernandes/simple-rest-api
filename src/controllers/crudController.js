const util = require('../util/util');
const crudController = module.exports = {};

crudController.addRule = (req, res) => {
    try {
        // const rules = util.load() || [];
        // if (rules.length > 0) {
        //     rules.map(rule => {
        //         rule.days.map(day => {
        //             if(day.data === 'diariamente'){
        //
        //             }
        //         })
        //     });
        // } else {
        //     req.body.id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
        //     rules.push(req.body);
        //     util.save(rules);
        //     return res.status(201).json({message: 'Saved'})
        // }

        const rules = util.load() || [];
        req.body.id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
        rules.push(req.body);
        util.save(rules);
        return res.status(201).json({message: 'Saved', data: req.body})


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
    try{
        const rules = util.load() || [];
        if(!req.query.id)
            return res.status(404).json({message: 'Missing id'});
        if(rules.length === 0)
            return res.status(200).json({message: 'Empty file'});

        rules.map((rule, index) => {
            if(rule.id === req.query.id){
                rules.splice(index, 1);
                util.save(rules);
                return res.status(200).json({message: 'Deleted', data: rule});
            }
        });

    }catch (e) {
        return res.status(400).send(e)
    }

};

crudController.listSchedules = (req, res) => {
    return res.status(200).send("List schedule")
};



