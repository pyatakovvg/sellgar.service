
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Product extends Model {}

  Product.init({
    uuid: {
      type: DataType.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    seoTitle: {
      type: DataType.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    seoDescription: {
      type: DataType.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    seoKeywords: {
      type: DataType.STRING(1024),
      allowNull: false,
      defaultValue: '',
    },
    groupUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    categoryUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    brandUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    externalId: {
      type: DataType.STRING(64),
      allowNull: false,
      unique: true,
      defaultValue: () => Date.now().toString(32),
    },
    title: {
      type: DataType.STRING(256),
      allowNull: false,
      defaultValue: '',
    },
    originalName: {
      type: DataType.STRING(256),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataType.STRING(2024),
      allowNull: false,
      defaultValue: '',
    },
    isUse: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAvailable: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
  });

  Product.associate = ({ Group, Category, Brand, Attribute, Price, ProductGallery }) => {

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

    Product.hasMany(Price, {
      foreignKey: 'productUuid',
      as: 'price',
    });

    Product.belongsToMany(Attribute, {
      through: 'ProductAttribute',
      foreignKey: 'productUuid',
      as: 'attributes',
    });
  };

  return Product;
};
