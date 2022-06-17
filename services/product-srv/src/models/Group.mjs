
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Group extends Model {}

  Group.init({
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

  Group.associate = ({ Category, Product }) => {

    Group.belongsToMany(Category, {
      through: 'GroupCategory',
      foreignKey: 'groupUuid',
      timestamps: false,
      as: 'categories',
    });

    Group.hasMany(Product, {
      foreignKey: 'groupUuid',
      as: 'products',
    });
  };

  return Group;
};
