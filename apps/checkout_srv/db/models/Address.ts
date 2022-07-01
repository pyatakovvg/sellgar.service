
function init({ sequelize, DataTypes, Model }): any {
  class Address extends Model {}

  Address.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    customerUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Address.associate = () => {};

  return Address;
}

export default init;
