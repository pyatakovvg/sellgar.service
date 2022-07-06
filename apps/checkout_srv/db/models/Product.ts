

function init({ sequelize, DataTypes, Model }): any {
  class Product extends Model {}

  Product.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    productUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    imageUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    modeUuid: {
      type: DataTypes.UUID,
      allowNull: false,
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
    vendor: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get(column) {
        return Number(this.getDataValue(column));
      },
    },
    currencyCode: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Product.associate = ({ Currency }) => {

    Product.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return Product;
}

export default init;
