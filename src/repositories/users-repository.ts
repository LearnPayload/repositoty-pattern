import { User } from '@/payload-types'
import { BaseRepository, BaseRepositoryInterface, QueryParams } from './base-repository'
import { CollectionSlug } from 'payload'

export interface UsersQueryParams
  extends QueryParams<{
    email?: string
  }> {}

export interface UsersRepositoryInterface extends BaseRepositoryInterface<User, UsersQueryParams> {}

export class UsersRepository
  extends BaseRepository<User, UsersQueryParams>
  implements UsersRepositoryInterface
{
  collection = 'users' as CollectionSlug
}
