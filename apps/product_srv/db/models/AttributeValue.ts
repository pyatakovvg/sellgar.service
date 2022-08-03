
function init({ sequelize, DataTypes, Model }): any {
  class AttributeValue extends Model {}

  AttributeValue.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    attributeUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  AttributeValue.associate = ({ Attribute, Product }) => {

    AttributeValue.belongsTo(Attribute, {
      primaryKey: 'attributeUuid',
      as: 'attribute',
      constraints: false,
    });

    AttributeValue.belongsToMany(Product, {
      through: 'ProductAttribute',
      foreignKey: 'attributeUuid',
      as: 'products',
    });
  };

  return AttributeValue;
}

export default init;
