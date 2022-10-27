import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { PageQueryDto } from 'src/common/page-query.dto';
import { IStdPage } from 'src/interfaces/std-page.interface';

@Injectable()
export class Utils {
  /**获取标准分页参数, 先只支持单字段排序 */
  standardizedPage(query: PageQueryDto): IStdPage {
    const page =
      query.page && parseInt(query.page) > 1 ? parseInt(query.page) : 1;
    const perpage =
      query.perpage && parseInt(query.perpage) > 0
        ? parseInt(query.perpage)
        : 10;

    //每张表都应该有个创建时间的字段(暂未处理)，默认用其倒序排
    const orderby = query.orderby || 'createDate';
    const order = query.order
      ? <'ASC' | 'DESC'>query.order.toLocaleUpperCase()
      : 'DESC';

    return {
      orderby,
      order,
      skip: (page - 1) * perpage,
      limit: perpage,
      meta: { page, perpage, orderby: orderby, order, total: 0 },
    };
  }
}
