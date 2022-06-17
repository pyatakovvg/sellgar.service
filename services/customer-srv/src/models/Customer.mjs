
import { Sequelize } from '@sellgar/db';

export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Customer extends Model {}

  Customer.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    },
    profileUuid: {
      type: DataType.UUID,
      allowNull: false,
    },

  }, {
    sequelize,
    timestamps: true,
  });

  Customer.associate = ({ Profile }) => {

    Customer.belongsTo(Profile, {
      as: 'profile',
    });
  };

  return Customer;
};
