const aiService = require('../services/ai.services')

module.exports.getResponse = async (req,res)=>{
    const code = req.body.code;

    if(!code){
        res.status(400).send({message: "Prompt is required"})
    }

    const response = await aiService(code)

    res.send(response);
}
