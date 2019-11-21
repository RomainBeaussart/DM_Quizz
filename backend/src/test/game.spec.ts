import 'mocha'
import { expect } from 'chai'
import { Question } from '../models/question.model'
import { Game } from '../models/game.model'
import { Player } from '../models/player.model'

describe('Game object', function () {
  const p0: Player = {
    id: 0,
    name: 'Louis',
    points: 50
  }

  const p1: Player = {
    id: 1,
    name: 'Romain',
    points: 10
  }

  const game = new Game([p0, p1], [])

  describe('winner', function () {
    it('should find Louis as winner', function () {
      const winner: Player = game.endOfGame()
      expect(winner.id).to.equal(0)
    })
  })
})
