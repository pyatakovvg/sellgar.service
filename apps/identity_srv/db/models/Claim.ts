
function init({ sequelize, DataTypes, Model }): any {
  class Claim extends Model {}

  Claim.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(128),
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
}

export default init;
