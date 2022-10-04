
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Price extends Model {}

  Price.init({
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
    createdAt: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Price.associate = ({ Product, Currency }) => {

    Price.belongsTo(Product, {
      foreignKey: 'productUuid',
      as: 'product',
    });

    Price.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return Price;
};
