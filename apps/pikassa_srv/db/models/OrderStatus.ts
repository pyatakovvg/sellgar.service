

function init({ sequelize, DataTypes, Model }): any {
  class OrderStatus extends Model {}

  OrderStatus.init({
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: 'bucket',
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  return OrderStatus;
}

export default init;
