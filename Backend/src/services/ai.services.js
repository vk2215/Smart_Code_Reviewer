const Groq = require('groq-sdk');
const groq = new Groq({apiKey : process.env.GROQ_API_KEY})

async function getResponse(prompt){
    const chatCompletion = await groq.chat.completions.create({
        model:"llama3-8b-8192",
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
