
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Claim extends Model {}

  Claim.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataType.UUIDV4,
    },
    type: {
      type: DataType.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataType.STRING(128),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Claim.associate = ({ User, UserClaims }) => {

    Claim.belongsToMany(User, {
      through: UserClaims,
      foreignKey: 'claimUuid',
      as: 'users',
    });
  };

  return Claim;
};
