import { Post } from '@/payload-types'
import {
  getPayload,
  Payload,
  CollectionConfig,
  CollectionSlug,
  DataFromCollectionSlug,
} from 'payload'
import config from '@/payload.config'

interface QueryParams {
  limit?: number
  offset?: number
  sort?: string
  page?: number
}

export interface BaseRepositoryInterface<T, TQueryParams extends QueryParams> {
  collection: string
  getMany(params: TQueryParams): Promise<T[]>
  getOne(id: number): Promise<T>
  create(data: T): Promise<T>
}

export interface PropertyQueryParams extends QueryParams {
  author?: string
}

export interface PostsRepositoryInterface
  extends BaseRepositoryInterface<Post, PropertyQueryParams> {}

export abstract class BaseRepository<T> {
  protected readonly defaultLimit = 10
  protected readonly defaultOffset = 0
  protected readonly defaultSort = '-createdAt'
  protected readonly client: Promise<Payload>

  abstract collection: CollectionSlug

  constructor() {
    this.client = getPayload({ config })
  }

  create = async (data: Partial<T>): Promise<T> => {
    const payload = await this.client

    const result = (await payload.create({
      collection: this.collection,
      data: data as any, // Type assertion needed due to Payload's type system
    })) as unknown as T

    return result
  }

  getOne = async (id: number) => {
    const payload = await this.client

    const post = await payload.findByID({
      collection: this.collection,
      id,
    })

    return post
  }

  getMany = async (params: PropertyQueryParams = {}): Promise<Post[]> => {
    const payload = await this.client

    const posts = await payload.find({
      collection: this.collection,
      page: params.page,
      limit: params.limit,
      sort: params.sort,
    })

    return posts.docs
  }
}

export class PostsRepository extends BaseRepository<Post> implements PostsRepositoryInterface {
  collection = 'posts' as CollectionSlug
}
