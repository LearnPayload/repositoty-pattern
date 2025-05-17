import { PostsRepository } from './posts-repository'
import { UsersRepository } from './users-repository'

export const db = {
  posts: new PostsRepository(),
  users: new UsersRepository(),
}
