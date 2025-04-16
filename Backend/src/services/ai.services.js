const Groq = require('groq-sdk');
const groq = new Groq({apiKey : process.env.GROQ_API_KEY})

async function getResponse(prompt){
    const chatCompletion = await groq.chat.completions.create({
        model:"deepseek-r1-distill-qwen-32b",
        messages : [
            {
                role : "user",
                content:prompt
            },
            {
                role : "system",
                content: "You are a conversational AI assistant. I can answer any question you have",
            }
        ]
    })
    return chatCompletion.choices[0].message.content;

}
module.exports = getResponse
