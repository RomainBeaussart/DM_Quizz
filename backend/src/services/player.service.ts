import { User } from '../models/user.model'
import { Player } from '../models/player.model'

export const createPlayer = (user: User): Player => (
  { user: user, points: 0 }
)
