
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Profile extends Model {}

  Profile.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    name: {
      type: DataType.STRING(64),
      allowNull: false,
      defaultValue: 'No name',
    },
    email: {
      type: DataType.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    phone: {
      type: DataType.STRING(12),
      allowNull: false,
      defaultValue: '',
    },
    birthday: {
      type: DataType.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Profile.associate = ({}) => {};

  return Profile;
};
