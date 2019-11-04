import 'mocha'
import { expect } from 'chai'
import { Question } from '../model/question.class'
import { Game } from '../model/game.class'
import { Player } from '../model/player.interface'

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
