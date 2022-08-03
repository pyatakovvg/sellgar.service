
function init({ sequelize, Model }): any {
  class ProductAttribute extends Model {}

  ProductAttribute.init({}, {
    sequelize,
    timestamps: false,
  });

  ProductAttribute.associate = ({ AttributeValue }) => {

    ProductAttribute.hasOne(AttributeValue, {
      foreignKey: 'attributeUuid',
      as: 'value',
      onDelete: 'cascade',
    });
  };

  return ProductAttribute;
}

export default init;
