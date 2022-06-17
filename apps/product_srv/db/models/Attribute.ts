
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
    categoryUuid: {
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Attribute.associate = ({ Product, Category, Unit }) => {

    Attribute.belongsTo(Category, {
      as: 'category',
    });

    Attribute.belongsTo(Unit, {
      as: 'unit',
    });

    Attribute.belongsToMany(Product, {
      through: 'ProductAttribute',
      foreignKey: 'attributeUuid',
      as: 'products',
    });
  };

  return Attribute;
}

export default init;
