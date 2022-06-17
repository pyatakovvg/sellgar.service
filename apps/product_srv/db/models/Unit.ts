
function init({ sequelize, DataTypes, Model }): any {
  class Unit extends Model {}

  Unit.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Unit.associate = () => {};

  return Unit;
}

export default init;
