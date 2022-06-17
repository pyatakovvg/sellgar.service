
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class ProductMode extends Model {}

  ProductMode.init({
    uuid: {
      type: DataType.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    productUuid: {
      type: DataType.UUID,
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
      get(column) {
        return Number(this.getDataValue(column));
      },
    },
    currencyCode: {
      type: DataType.STRING(4),
      allowNull: false,
    },
    isUse: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isTarget: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  ProductMode.associate = ({ Product, Currency }) => {

    ProductMode.belongsTo(Product, {
      foreignKey: 'productUuid',
      as: 'product',
    });

    ProductMode.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return ProductMode;
};
