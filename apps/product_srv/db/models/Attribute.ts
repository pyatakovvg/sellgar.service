
function init({ sequelize, DataTypes, Model }): any {
  class Attribute extends Model {}

  Attribute.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    unitUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    groupUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    categoryUuid: {
      type: DataTypes.UUID,
      allowNull: true,
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
    isFiltered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Attribute.associate = ({ AttributeValue, Unit }) => {

    Attribute.hasMany(AttributeValue, {
      foreignKey: 'attributeUuid',
      as: 'values',
    });

    Attribute.belongsTo(Unit, {
      as: 'unit',
      constraints: false,
    });
  };

  return Attribute;
}

export default init;
