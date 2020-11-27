const fast_csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const {startDb} = require('../services/db');


const exportToDB = async () => {
  const db = await startDb();

  const parseOptions = {
    trim: true,
    skipRows: 1
  }

  fs.createReadStream(path.resolve(__dirname, './csv-files/questions.csv'))
    .pipe(fast_csv.parse(parseOptions))
    .on('error', error => console.error(error))
    .on('data', row => saveQuestionsToMongoDb(row, db))

  fs.createReadStream(path.resolve(__dirname, './csv-files/topics.csv'))
    .pipe(fast_csv.parse(parseOptions))
    .on('error', error => console.error(error))
    .on('data', row => saveTopicToMongoDb(row, db))
    .on('end', () => db.collection('topics').createIndex({path: 1}))

}

const saveTopicToMongoDb = async (row, db) => {
  const topicCollection = db.collection('topics');
  let path;

  if(row[0]) {
    await topicCollection.updateOne({_id: row[0]}, {$set: {path: null}}, {upsert: true});
  }

  if(row[1]) {
    path = `-${row[0]}-`;
    await topicCollection.updateOne({_id: row[1]}, {$set: { path }}, {upsert: true})
  }

  if(row[2]) {
    path = `-${row[0]}-${row[1]}-`;
    await topicCollection.updateOne({_id: row[2]}, {$set: {path}}, {upsert: true})
  }
};

const saveQuestionsToMongoDb = async (row, db) => {
  const questionCollection = db.collection('questions');

  const [question, ...rest] = row;
  const annotations = rest.filter(value => !!value);

  await questionCollection.updateOne({_id: question}, {$set: {annotations}}, {upsert: true});
}

exportToDB();

