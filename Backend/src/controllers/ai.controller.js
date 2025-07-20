const aiService = require('../services/ai.services');

module.exports.getResponse = async (req, res) => {
  const { code, language = 'python', customPrompt = '' } = req.body;

  if (!code) {
    return res.status(400).send({ message: 'Code is required' });
  }

  const prompt = `Review the following ${language} code for correctness, best practices, and improvements. ${customPrompt}\n\n${code}`;
  const response = await aiService(prompt);

  res.send(response);
};