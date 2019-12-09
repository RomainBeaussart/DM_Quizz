import axios from 'axios'
import { Question } from '../models/question.model'

async function getQuestions (): Promise<Array<Question>> {
  let questions: Array<Question> = []
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple')
    questions = res.data.results.map(
      (questionFromApi: any) => new Question(questionFromApi.category, questionFromApi.question, questionFromApi.correct_answer, questionFromApi.incorrect_answers)
    )
  } catch (err) {
    console.error(err)
  }
  return questions
}

export default getQuestions
