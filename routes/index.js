var express = require('express');
var router = express.Router();

/* GET questions under topic */
router.get('/search', async function(req, res, next) {
  const {query: { q: topic }, db} = req;

  if(!topic) {
    return res.status(500).send({error: "Please sepcify a topic"})
  }
  
  const subTopics = await db.collection('topics').find({path: new RegExp(`-${topic}-`, 'i')}).toArray();

  const allTopics = [...subTopics.map(data => new RegExp(data._id, 'i')), new RegExp(topic, 'i')];

  const matchedQuestions = await db.collection('questions').find({annotations: { $in: allTopics }}).toArray();

  const matchedQuestionsArray = matchedQuestions.map(data => data._id);

  res.send({data: matchedQuestionsArray});
});

module.exports = router;
