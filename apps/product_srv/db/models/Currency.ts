
function init({ sequelize, DataTypes, Model }): any {
  class Currency extends Model {}

  Currency.init({
    code: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Currency.associate = () => {};

  return Currency;
}

export default init;
