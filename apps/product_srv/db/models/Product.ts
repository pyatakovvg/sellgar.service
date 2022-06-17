
function init({ sequelize, DataTypes, Model }): any {
  class Product extends Model {}

  Product.init({
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    seoTitle: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    seoDescription: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    seoKeywords: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    groupUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    categoryUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    brandUuid: {
      type: DataTypes.UUID,
      allowNull: true,
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
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING(2024),
      allowNull: false,
      defaultValue: '',
    },
    isUse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
  });

  Product.associate = ({ Group, Category, Brand, Attribute, ProductMode, ProductGallery }) => {

    Product.belongsTo(Group, {
      as: 'group',
    });

    Product.belongsTo(Category, {
      as: 'category',
    });

    Product.belongsTo(Brand, {
      as: 'brand',
    });

    Product.hasMany(ProductGallery, {
      foreignKey: 'productUuid',
      as: 'gallery',
    });

    Product.hasMany(ProductMode, {
      foreignKey: 'productUuid',
      as: 'modes',
    });

    Product.belongsToMany(Attribute, {
      through: 'ProductAttribute',
      foreignKey: 'productUuid',
      as: 'attributes',
    });
  };

  return Product;
}

export default init;
