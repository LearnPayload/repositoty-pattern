import { PostsRepository } from './posts-repository'

export const db = {
  posts: new PostsRepository(),
}
