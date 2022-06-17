
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType)  {
  const { Model } = Sequelize;

  class Comment extends Model {}

  Comment.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    themeUuid: {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: null,
    },
    parentUuid: {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: null,
    },
    message: {
      type: DataType.STRING(2024),
      allowNull: false,
    },
    isAdmin: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Comment.associate = ({ Product, Customer, Theme }) => {

    Comment.belongsToMany(Customer, {
      through: 'CustomerComment',
      foreignKey: 'commentUuid',
      as: 'customers',
    });

    Comment.belongsToMany(Product, {
      through: 'ProductComment',
      foreignKey: 'commentUuid',
      as: 'products',
    });

    Comment.belongsTo(Theme, {
      as: 'theme',
    });

    Comment.hasMany(Comment, {
      foreignKey: 'parentUuid',
      as: 'comments',
    });
  };

  return Comment;
};
