import config from '@/payload.config'

import { CollectionSlug, getPayload, PaginatedDocs, Payload } from 'payload'

export interface BaseQueryParams {
  limit?: number
  offset?: number
  sort?: string
  page?: number
}

export type QueryParams<T = {}> = BaseQueryParams & T

export interface BaseRepositoryInterface<T, TQueryParams extends QueryParams> {
  collection: CollectionSlug
  getMany(params: TQueryParams): Promise<T[]>
  getOne(id: number): Promise<T>
  create(data: Partial<T>): Promise<T>
}

export abstract class BaseRepository<T, TQueryParams extends QueryParams = QueryParams> {
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

  getOne = async (id: number): Promise<T> => {
    const payload = await this.client

    const record = (await payload.findByID({
      collection: this.collection,
      id,
    })) as unknown as T

    return record
  }

  getMany = async (params: TQueryParams = {} as TQueryParams): Promise<T[]> => {
    const payload = await this.client

    const records = (await payload.find({
      collection: this.collection,
      page: params.page,
      limit: params.limit ?? this.defaultLimit,
      sort: params.sort ?? this.defaultSort,
    })) as unknown as PaginatedDocs<T>

    return records.docs
  }
}
