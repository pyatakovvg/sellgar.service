

function init({ sequelize, DataTypes, Model }): any {
  class Delivery extends Model {}

  Delivery.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2024),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
    },
    isUse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Delivery.associate = ({}) => {};

  return Delivery;
}

export default init;
