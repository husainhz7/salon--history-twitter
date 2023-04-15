import { OpenAI } from 'langchain/llms';
import { LLMChain, PromptTemplate } from 'langchain';
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import promptTemplate from './basePrompt.js'
import tweetPromptTemplate from './tweetPrompt.js'
import glob from 'glob';

// Load the Vector Store from the `vectorStore` directory
// const store = await HNSWLib.load("vectorStore", new OpenAIEmbeddings({
//   openAIApiKey: process.env.OPENAI_API_KEY
// }));
// console.clear();

// OpenAI Configuration
const model = new OpenAI({ 
  temperature: 0.9,
  openAIApiKey: process.env.OPENAI_API_KEY,
  // modelName: 'text-davinci-003'
  modelName: 'gpt-3.5-turbo'
});

// Parse and initialize the Prompt
// const prompt = new PromptTemplate({
//   template: promptTemplate,
//   inputVariables: ["history", "context", "prompt"]
// });

// // Create the LLM Chain
// const llmChain = new LLMChain({
//   llm: model,
//   prompt
// });

/** 
 * Generates a Response based on history and a prompt.
 * @param {string} history - 
 * @param {string} prompt - Th
 */
const generateResponse = async ({
  history,
  prompt
}) => {
  // Search for related context/documents in the vectorStore directory
  const data = await store.similaritySearch(prompt, 1);
  const context = [];
  data.forEach((item, i) => {
    context.push(`Context:\n${item.pageContent}`)
  });
  
  return await llmChain.predict({
    prompt,
    context: context.join('\n\n'),
    history
  })
}

// loade store for all owners
const folders = await new Promise((resolve, reject) => 
  glob("vectorStore/*", (err, files) => err ? reject(err) : resolve(files))
);

var stores = new Map()
for (const folder of folders){
  const store = await HNSWLib.load(folder, new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  }));
  var person = folder.split('/')[1]

  stores.set(person,store)
}

const tweetPrompt = new PromptTemplate({
  template: tweetPromptTemplate,
  inputVariables: ["description","news", "context"]
});

const tweetLlmChain = new LLMChain({
  llm: model,
  prompt: tweetPrompt
});

const generateTweet = async ({
  name, description, news
}) => {
  // Search for related context/documents in the vectorStore directory
  const data = await stores.get(name).similaritySearch(news, 1);
  const context = [];
  data.forEach((item, i) => {
    context.push(`Context:\n${item.pageContent}`)
  });
  return await tweetLlmChain.predict({
    description,
    news,
    context: context.join('\n\n'),
  })
}

export {generateResponse, generateTweet}