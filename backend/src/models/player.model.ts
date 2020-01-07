import { User } from './user.model'

export interface Player {
  readonly user: User
  points: number
}
