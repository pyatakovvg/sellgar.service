
function init({ sequelize, DataTypes, Model }): any {
  class Product extends Model {}

  Product.init({
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    externalId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      defaultValue: () => Date.now().toString(32),
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false,
      defaultValue: '',
    },
    originalName: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: '',
    },
  }, {
    sequelize,
  });

  Product.associate = ({ Comment }) => {

    Product.hasMany(Comment, {
      foreignKey: 'productUuid',
      as: 'comments',
    });
  };

  return Product;
}

export default init;
