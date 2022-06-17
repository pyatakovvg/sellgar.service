
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Attribute extends Model {}

  Attribute.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    },
    unitUuid: {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: null,
    },
    categoryUuid: {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: null,
    },
    name: {
      type: DataType.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataType.STRING(1024),
      defaultValue: '',
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

  Attribute.associate = ({ Product, Category, Unit }) => {

    Attribute.belongsTo(Category, {
      as: 'category',
    });

    Attribute.belongsTo(Unit, {
      as: 'unit',
    });

    Attribute.belongsToMany(Product, {
      through: 'ProductAttribute',
      foreignKey: 'attributeUuid',
      as: 'products',
    });
  };

  return Attribute;
};
