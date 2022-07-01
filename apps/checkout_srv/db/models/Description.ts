
function init({ sequelize, DataTypes, Model }): any {
  class Description extends Model {}

  Description.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    orderUuid: {
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

  Description.associate = () => {};

  return Description;
}

export default init;
