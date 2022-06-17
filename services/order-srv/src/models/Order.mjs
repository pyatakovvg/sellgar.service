
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Order extends Model {}

  Order.init({
    uuid: {
      type: DataType.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    externalId: {
      type: DataType.STRING(9),
      allowNull: false,
      unique: true,
      defaultValue: () => Date.now().toString(32),
    },
    userUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    title: {
      type: DataType.STRING(256),
      allowNull: true,
    },
    dateTo: {
      type: DataType.DATE,
      allowNull: true,
    },
    description: {
      type: DataType.STRING(2024),
      allowNull: true,
    },
    total: {
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get(column) {
        return Number(this.getDataValue(column));
      },
    },
    currencyCode: {
      type: DataType.STRING(4),
      allowNull: false,
      defaultValue: 'RUB',
    },
    statusCode: {
      type: DataType.STRING,
      allowNull: false,
    },
    paymentCode: {
      type: DataType.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
  });

  Order.associate = ({ OrderProduct, OrderAddress, Status, Currency, Payment, Customer }) => {

    Order.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });

    Order.belongsTo(Payment, {
      foreignKey: 'paymentCode',
      as: 'payment',
    });

    Order.belongsTo(OrderAddress, {
      foreignKey: 'uuid',
      sourceKey: 'orderUuid',
      as: 'address',
    });

    Order.hasMany(OrderProduct, {
      foreignKey: 'orderUuid',
      as: 'products',
    });

    Order.belongsTo(Status, {
      foreignKey: 'statusCode',
      as: 'status',
    });

    Order.belongsTo(Customer, {
      foreignKey: 'userUuid',
      as: 'customer',
    });
  };

  return Order;
};
