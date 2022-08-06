
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
    groupCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandCode: {
      type: DataTypes.STRING,
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
      allowNull: true,
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
      defaultValue: false,
    },
  }, {
    sequelize,
  });

  Product.associate = ({ Group, Category, Brand, AttributeValue, ProductMode, ProductGallery }) => {

    Product.belongsTo(Group, {
      foreignKey: 'groupCode',
      as: 'group',
      constraints: false,
    });

    Product.belongsTo(Category, {
      foreignKey: 'categoryCode',
      as: 'category',
      constraints: false,
    });

    Product.belongsTo(Brand, {
      foreignKey: 'brandCode',
      as: 'brand',
      constraints: false,
    });

    Product.hasMany(ProductGallery, {
      foreignKey: 'productUuid',
      as: 'gallery',
      onDelete: 'CASCADE'
    });

    Product.hasMany(ProductMode, {
      foreignKey: 'productUuid',
      as: 'modes',
      onDelete: 'cascade'
    });

    Product.belongsToMany(AttributeValue, {
      through: 'ProductAttribute',
      foreignKey: 'productUuid',
      as: 'attributes',
      onDelete: 'cascade',
    });
  };

  return Product;
}

export default init;
