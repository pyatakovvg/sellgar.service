
import { models, Op } from '@sellgar/db';
import request from '@package/request';


export default () => async (ctx) => {
  let where = {};
  let whereMode = {};
  let offset = {};
  let options = {};

  const { Order, OrderProduct, OrderAddress, Status, Currency, Payment, Customer } = models;

  const {
    externalId = null,
    limit = null,
    skip = null,
    take = null,
    uuid = null,
    userUuid = null,
    isUse = null,
    vendor = null,
    status = null,
    minPrice = null,
    maxPrice = null,
    minDateTo = null,
    maxDateTo = null,
    minDateCreate = null,
    maxDateCreate = null,
  } = ctx['request']['query'];

  if (externalId) {
    where['externalId'] = {
      [Op.like]: `%${externalId}%`,
    };
  }

  if (uuid) {
    where['uuid'] = uuid;
  }

  if (status) {
    where['statusCode'] = status;
  }

  if (vendor) {
    whereMode['vendor'] = {
      [Op.like]: `%${vendor}%`,
    };
  }

  if (minDateCreate && maxDateCreate) {
    where['createAt'] = {
      [Op.between]: [minDateCreate, maxDateCreate],
    };
  }
  else if (minDateCreate) {
    where['createAt'] = {
      [Op.gte]: minDateCreate,
    };
  }
  else if (maxDateCreate) {
    where['createAt'] = {
      [Op.lte]: maxDateCreate,
    };
  }

  if (minDateTo && maxDateTo) {
    where['dateTo'] = {
      [Op.between]: [minDateTo, maxDateTo],
    };
  }
  else if (minDateTo) {
    where['dateTo'] = {
      [Op.gte]: minDateTo,
    };
  }
  else if (maxDateTo) {
    where['dateTo'] = {
      [Op.lte]: maxDateTo,
    };
  }

  if (minPrice && maxPrice) {
    where['total'] = {
      [Op.between]: [minPrice, maxPrice],
    };
  }
  else if (minPrice) {
    where['total'] = {
      [Op.gte]: minPrice,
    };
  }
  else if (maxPrice) {
    where['total'] = {
      [Op.lte]: maxPrice,
    };
  }

  if (userUuid) {
    where['userUuid'] = userUuid;
  }

  if (isUse !== null) {
    where['isUse'] = isUse;
  }

  if (limit) {
    options['limit'] = Number(limit);
  }

  if (skip && take) {
    offset['offset'] = Number(skip);
    offset['limit'] = Number(take);
  }

  const result = await Order.findAndCountAll({
    ...options,
    ...offset,
    distinct: true,
    where: {
      statusCode: {
        [Op.not]: 'basket'
      },
      ...where,
    },
    order: [
      ['createdAt', 'desc'],
      ['status', 'order', 'asc'],
      ['products', 'order', 'asc'],
    ],
    attributes: ['uuid', 'externalId', 'userUuid', 'title', 'description', 'dateTo', 'total', 'currencyCode', 'createdAt', 'updatedAt'],
    include: [
      {
        model: OrderAddress,
        attributes: ['city', 'street', 'house', 'building', 'apartment', 'front', 'floor'],
        as: 'address',
      },
      {
        model: OrderProduct,
        required: !! Object.keys(whereMode).length,
        where: { ...whereMode },
        attributes: ['uuid', 'externalId', 'orderUuid', 'productUuid', 'modeUuid', 'imageUuid', 'title', 'vendor', 'value', 'price', 'total', 'number'],
        as: 'products',
        include: [
          {
            model: Currency,
            attributes: ['code', 'displayName'],
            as: 'currency',
          }
        ],
      },
      {
        model: Status,
        attributes: ['code', 'displayName'],
        as: 'status',
      },
      {
        model: Currency,
        attributes: ['code', 'displayName'],
        as: 'currency',
      },
      {
        model: Payment,
        attributes: ['code', 'displayName'],
        as: 'payment',
      },
      {
        model: Customer,
        attributes: ['uuid', 'name', 'phone', 'email'],
        as: 'customer',
      },
    ],
  });

  ctx.body = {
    success: true,
    data: result['rows'].map((item) => item.toJSON()),
    meta: {
      total: result['count'],
    },
  };
};
