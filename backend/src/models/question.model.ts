// Base on opentdb.com API
// exemple of question
/*
{
  "category":"Entertainment: Video Games",
  "type":"multiple",
  "difficulty":"easy",
  "question":"What&#039;s the best selling video game to date?",
  "correct_answer":"Tetris",
  "incorrect_answers":["Wii Sports","Minecraft","Super Mario Bros"]
*/

function shuffleAnswers (array: Array<string>): Array<string> {
  let j: number
  let x: string
  let i: number

  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = array[i]
    array[i] = array[j]
    array[j] = x
  }
  return array
}

export class Question {
  category: string
  question: string
  correctAnswer: string
  answers: Array<string>

  constructor (_category: string, _question: string, _correctAnswer: string, _incorrectAnswers: Array<string>) {
    this.category = _category
    this.question = _question
    this.correctAnswer = _correctAnswer
    this.answers = _incorrectAnswers
    this.answers.push(this.correctAnswer)
    this.answers = shuffleAnswers(this.answers)
  }

  toString () {
    return `${this.question}\n${this.answers}`
  }
}
