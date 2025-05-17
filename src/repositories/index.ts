import { PostsRepository } from './respository'

export const db = {
  posts: new PostsRepository(),
}
