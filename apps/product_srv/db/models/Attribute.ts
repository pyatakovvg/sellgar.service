
function init({ sequelize, DataTypes, Model }): any {
  class Attribute extends Model {}

  Attribute.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryCode: {
      type: DataTypes.STRING,
      allowNull: true,
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
    description: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
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

  Attribute.associate = ({ AttributeValue, Category, Unit }) => {


    Attribute.belongsTo(Category, {
      foreignKey: 'categoryCode',
      as: 'category',
      constraints: false,
    });

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
