import config from '@payload-config'
import { CollectionSlug, PaginatedDocs, Payload } from 'payload'
import { getPayload } from 'payload'

export interface BaseQueryParams {
  limit?: number
  offset?: number
  sort?: string
  page?: number
}

export type QueryParams<T = {}> = BaseQueryParams & T

export interface BaseRepositoryInterface<T, D, TQueryParams extends QueryParams> {
  collection: CollectionSlug
  getMany(params: TQueryParams): Promise<D[]>
  getOne(id: number): Promise<D>
  create(data: Partial<T>): Promise<T>
  mapper(data: Partial<T>, Decorator: new (data: Partial<T>) => D): D
}

export abstract class BaseRepository<T, D, TQueryParams extends QueryParams = QueryParams>
  implements BaseRepositoryInterface<T, D, TQueryParams>
{
  protected readonly defaultLimit = 10
  protected readonly defaultOffset = 0
  protected readonly defaultSort = '-createdAt'
  protected readonly client: Promise<Payload>
  abstract collection: CollectionSlug
  abstract decorator: new (data: Partial<T>) => D
  constructor() {
    this.client = getPayload({ config })
  }

  mapper = (data: Partial<T>, Decorator: new (data: Partial<T>) => D): D => {
    return new Decorator(data)
  }

  create = async (data: Partial<T>): Promise<T> => {
    const payload = await this.client

    const result = (await payload.create({
      collection: this.collection,
      data,
    })) as T

    return result
  }

  getOne = async (id: number): Promise<D> => {
    const payload = await this.client

    const record = (await payload.findByID({
      collection: this.collection,
      id,
    })) as T

    return this.mapper(record, this.decorator)
  }

  getMany = async (params: TQueryParams = {} as TQueryParams): Promise<D[]> => {
    const payload = await this.client

    const records = (await payload.find({
      collection: this.collection,
      page: params.page,
      limit: params.limit ?? this.defaultLimit,
      sort: params.sort ?? this.defaultSort,
    })) as PaginatedDocs<T>

    return records.docs.map((r) => this.mapper(r, this.decorator))
  }
}
