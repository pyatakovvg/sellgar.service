
import { Sequelize } from '@sellgar/db';

export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Customer extends Model {}

  Customer.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(64),
      allowNull: true,
      defaultValue: 'No name',
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Customer.associate = ({ Comment }) => {

    Customer.belongsToMany(Comment, {
      through: 'CustomerComment',
      foreignKey: 'customerUuid',
      as: 'comments',
    });
  };

  return Customer;
};
