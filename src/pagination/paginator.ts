import { off } from "process";
import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions{
  limit: number;
  currentPage: number,
  total?: number
}


export interface PaginationResult<T>{
  first: number,
  last: number,
  total?: number, 
  limit: number,
  data: T[]
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginationOptions = {
    limit:10,
    currentPage: 1
}
): Promise<PaginationResult<T>> {
  // eslint-disable-next-line prettier/prettier
  const offset = (options.currentPage-1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();
  return {
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    data: data,
    total: options.total ? await qb.getCount() : null,
  }
}