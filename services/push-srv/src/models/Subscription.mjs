
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Subscription extends Model {}

  Subscription.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    userUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    endpoint: {
      type: DataType.STRING,
      allowNull: false,
    },
    auth: {
      type: DataType.STRING,
      allowNull: false,
    },
    p256dh: {
      type: DataType.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Subscription.associate = () => {};

  return Subscription;
};
