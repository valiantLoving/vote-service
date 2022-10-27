import { IsNumberString, IsOptional, IsString } from 'class-validator';

/**分页查询 DTO */
export class PageQueryDto {
  /**第几页 */
  @IsOptional()
  @IsNumberString()
  page: string;

  /**每页多少行 */
  @IsOptional()
  @IsNumberString()
  perpage: string;

  /**排序字段 */
  @IsOptional()
  @IsString()
  orderby: string;

  /**desc 降序, asc 升序 */
  @IsOptional()
  @IsString()
  order: string;
}
