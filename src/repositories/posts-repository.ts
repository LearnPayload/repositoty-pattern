import { Post } from '@/payload-types'
import { BaseRepository, BaseRepositoryInterface, QueryParams } from './base-repository'
import { CollectionSlug } from 'payload'

export interface PropertyQueryParams
  extends QueryParams<{
    author?: string
  }> {}

export interface PostsRepositoryInterface
  extends BaseRepositoryInterface<Post, PropertyQueryParams> {}

export class PostsRepository
  extends BaseRepository<Post, PropertyQueryParams>
  implements PostsRepositoryInterface
{
  collection = 'posts' as CollectionSlug
}
