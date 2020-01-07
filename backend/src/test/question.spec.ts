import 'mocha'
import { expect } from 'chai'
import { Question } from '../models/question.model'

describe('Question object', function () {
  describe('constructor', function () {
    it('should be constructed correctly', function () {
      const newGameObject = new Question('categoryTest', 'questionTest', 'correctAnswer', ['incorrectAnswer0', 'incorrectAnswer1'])
    })
  })
})
