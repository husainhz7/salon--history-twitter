import {generateResponse,generateTweet} from "./lib/generateResponse.js";
import promptSync from 'prompt-sync';
import glob from 'glob';
import fs from 'fs';

const prompt = promptSync();

const conversationHistory = [];

// while (true) {
//   const question = prompt("Ask a question > ");
//   const answer = await generateResponse({
//     prompt: question,
//     history: conversationHistory
//   });

//   console.log(`Mahatma Gandhi: ${answer}\n`);
  
//   conversationHistory.push(`Human: ${question}`, `Mahatma Gandhi: ${answer}`)
// }

const folders = await new Promise((resolve, reject) => 
  glob("vectorStore/*", (err, files) => err ? reject(err) : resolve(files))
);
let names = folders.map(path => path.split('/')[1]);
var nameDesciption = new Map()

for(const name of names){
  if(name == "davinci"){
    nameDesciption.set(name, "Leaornado Da Vinci, the Italian painter, engineer, architect, inventor and student of all things scientific who epitomized the term \"Renaissance man\"")
  }
  else if(name == "diogenes"){
    nameDesciption.set(name, "Diogenes, the Greek philosopher and one of the founders of Cynic philosophy")
  } 
  else if(name == "edison"){
    nameDesciption.set(name, "Thomas Alva Edison, the American inventor and businessman who is credited with developing many devices that greatly influenced life around the world.")
  }
  else if(name == "einstein"){
    nameDesciption.set(name, "Albert Einstein, the German-born theoretical physicist who developed the theory of general relativity and is widely considered one of the most influential scientists of all time.")
  }
  else if(name == "gandhi"){
    nameDesciption.set(name, "Mahatma Gandhi, the Indian independence activist who is best known for his philosophy of nonviolence and his leadership in India\'s struggle for independence from British rule.")
  }
  else if(name == "hitler"){
    nameDesciption.set(name, "Adolf Hitler, a German politician and leader of the Nazi Party who rose to power as Chancellor of Germany in 1933 and later Führer in 1934")
  }
  else if(name == "socrates"){
    nameDesciption.set(name, "Socrates, the classical Greek philosopher credited as one of the founders of Western philosophy.")
  }
}

//Define a function to check and write a file with a unique name
function checkAndWriteFile(name, data, counter = 0) {
  //Append a number to the name if counter is greater than zero
  let fileName = counter > 0 ? name.replace('.json', `-${counter}.json`) : name;
  let path = `tweets/${fileName}`

  //Check if the file name already exists
  fs.access(path, (err) => {
    if (err) {
      //File does not exist, write it
      fs.writeFile(path, data, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File written: ' + path);
        }
      });
    } else {
      //File exists, increment counter and try again
      checkAndWriteFile(name, data, counter + 1);
    }
  });
}

const news12 = "Silicon Valley Bank collapse: How it happened: The second-biggest bank failure in U.S. history was caused by a panic among venture capitalists who withdrew billions of dollars from the bank in 48 hours.Gender equality is centuries away, UN reports: The United Nations Secretary-General said that at the current pace of progress, it will take 267 years to close the gender gap in economic participation and opportunity. Galaxy S23 maintains consistency with minor changes: Samsung\'s latest flagship smartphone features a slightly larger display, a faster processor and a better camera than its predecessor, but no major design overhaul. Raskin: Trump must face the charges: The House Select Committee has completed its investigation and brought four criminal charges against former President Donald Trump for his role in inciting the January 6 insurrection at the Capitol."

const news14 = "YouTube death threats result in gun charges, feds say1: A man who allegedly posted videos on YouTube threatening to kill President Biden, Vice President Harris and other officials has been arrested on federal gun charges.Guardian Today US: Get the headlines & more in a daily email2: The Guardian offers a free daily email newsletter that covers the latest news and analysis on US politics, including opinion pieces and features.Feds plan to spend $250M to help Colorado River, Lake Mead this year3: The federal government announced a plan to spend $250 million to help address water shortages in the Colorado River basin and Lake Mead, which supplies water to millions of people in seven states and Mexico.Vegan version of Reese\'s Peanut Butter Cups to go on sale this month4: Hershey\'s will launch a vegan version of its popular Reese\'s Peanut Butter Cups this month, made with plant-based ingredients and certified by the Vegan Action organization.Silicon Valley Bank collapse: Treasury, Fed and FDIC announce steps to protect depositors5: The second-largest bank failure in U.S. history occurred on Friday when Silicon Valley Bank collapsed due to massive losses from risky investments. The federal regulators said they will make additional funding available to ensure all Silicon Valley Bank deposits, both insured and uninsured, will be paid in full."


// Give today's top world news headlines alongwith details about the news story. Tell me political, technological and business news
// Give me the top world news stories from this week with details 
var tweets = []
for(const name of names){
  const realname =  nameDesciption.get(name).split(',')[0]
  const date = new Date().toDateString();
  const tweet = await generateTweet({
        description: nameDesciption.get(name),
        news: news,
        name: name
      });
  tweets.push({name, date, realname, tweet})
  console.log(`Tweet for ${name}: \n ${tweet}`);

}
// save in file
// const obj = Object.fromEntries(tweets);
const json = JSON.stringify(tweets);
checkAndWriteFile('tweets.json', json);

// replies
