import { Post } from '@/payload-types'
import { BaseRepository, BaseRepositoryInterface, QueryParams } from './base-repository'
import { CollectionSlug } from 'payload'

export interface PostsQueryParams
  extends QueryParams<{
    author?: string
  }> {}

export interface PostsRepositoryInterface
  extends BaseRepositoryInterface<Post, PostsDecorator, PostsQueryParams> {}

export class PostsRepository
  extends BaseRepository<Post, PostsDecorator, PostsQueryParams>
  implements PostsRepositoryInterface
{
  collection = 'posts' as CollectionSlug
  decorator = PostsDecorator
}

export const posts = new PostsRepository()

export class PostsDecorator {
  constructor(private readonly original: Partial<Post>) {}

  get authorEmail(): string {
    if (!this.original.author || typeof this.original.author === 'number') return 'N/A'
    return this.original.author.email
  }

  toJSON(): Partial<Post> & { authorEmail: string } {
    return { ...this.original, authorEmail: this.authorEmail }
  }
}
