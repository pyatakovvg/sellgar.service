
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Product extends Model {}

  Product.init({
    uuid: {
      type: DataType.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    title: {
      type: DataType.STRING(256),
      allowNull: false,
      defaultValue: '',
    },
    isUse: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAvailable: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
  });

  Product.associate = ({ Comment }) => {

    Product.belongsToMany(Comment, {
      through: 'ProductComment',
      foreignKey: 'productUuid',
      as: 'comments',
    });
  };

  return Product;
};
