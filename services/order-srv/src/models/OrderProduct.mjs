
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class OrderProduct extends Model {}

  OrderProduct.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    },
    orderUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    productUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    modeUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    imageUuid: {
      type: DataType.STRING(40),
      allowNull: true,
      defaultValue: null,
    },
    externalId: {
      type: DataType.STRING(9),
      allowNull: false,
    },
    title: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    vendor: {
      type: DataType.STRING(32),
      allowNull: false,
    },
    value: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get(column) {
        return Number(this.getDataValue(column));
      },
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
    number: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    order: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  OrderProduct.associate = ({ Currency }) => {

    OrderProduct.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return OrderProduct;
};
