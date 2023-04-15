import glob from 'glob';
import fs from 'fs'
import { CharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from 'langchain/embeddings';

const folders = await new Promise((resolve, reject) => 
  glob("training/*", (err, files) => err ? reject(err) : resolve(files))
);

for (const folder of folders) {
  const data = [];
  var person = folder.split('/')[1]
  console.log(`Training ${person}`);

  const files = await new Promise((resolve, reject) => 
    glob(`${folder}/*.md`, (err, files) => err ? reject(err) : resolve(files))
  );
  console.log(files);

  for (const file of files) {
    data.push(fs.readFileSync(file, 'utf-8'));
  }

  console.log(`Added ${files.length} files to data.  Splitting text into chunks...`);
  
  const textSplitter = new CharacterTextSplitter({
    chunkSize: 2000,
    separator: "\n"
  });
  
  let docs = [];
  for (const d of data) {
    const docOutput = await textSplitter.splitText(d);
    docs = [...docs, ...docOutput];
  }
  
  console.log("Initializing Store...");
  
  const store = await HNSWLib.fromTexts(
    docs,
    docs.map((_, i) => ({ id: i })),
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    })
  )
  
  console.clear();
  console.log(`Saving vectorStore/${person}`);
  store.save(`vectorStore/${person}`)
  
  console.clear();
  console.log("VectorStore saved");
}

