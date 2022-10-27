/**标准分页参数数据结构 */
export interface IStdPage {
  orderby: string;
  order: 'DESC' | 'ASC';
  skip: number;
  limit: number;
  meta: {
    orderby: string;
    order: string;
    page: number;
    perpage: number;
    total: number;
  };
}
