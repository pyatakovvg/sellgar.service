
function init({ sequelize, DataTypes, Model }): any {
  class RefreshToken extends Model {}

  RefreshToken.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      index: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING(255),
    },
    ip: {
      type: DataTypes.STRING(15),
    },
    expiresIn: {
      type: DataTypes.BIGINT,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  return RefreshToken;
}

export default init;
