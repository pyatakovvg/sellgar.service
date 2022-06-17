
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Category extends Model {}

  Category.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    },
    code: {
      type: DataType.STRING(64),
      allowNull: false,
      unique: true,
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

  Category.associate = ({ Group, Brand }) => {

    Category.belongsToMany(Group, {
      through: 'GroupCategory',
      foreignKey: 'categoryUuid',
      timestamps: false,
      as: 'group',
    });

    Category.belongsToMany(Brand, {
      through: 'CategoryBrand',
      foreignKey: 'categoryUuid',
      timestamps: false,
      as: 'brands',
    });
  };

  return Category;
};
