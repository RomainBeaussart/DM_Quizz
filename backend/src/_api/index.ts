import axios from 'axios'
import { Question } from '../models/question.model'
import { XmlEntities } from 'html-entities'

const entities = new XmlEntities()

async function getQuestions (): Promise<Array<Question>> {
  let questions: Array<Question> = []
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple')
    questions = res.data.results.map(
      (questionFromApi: any) => new Question(entities.decode(questionFromApi.category), entities.decode(questionFromApi.question), entities.decode(questionFromApi.correct_answer), questionFromApi.incorrect_answers.map(entities.decode))
    )
  } catch (err) {
    console.error(err)
  }
  return questions
}

export default getQuestions
