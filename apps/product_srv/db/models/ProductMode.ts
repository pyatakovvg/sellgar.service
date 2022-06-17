
function init({ sequelize, DataTypes, Model }): any {
  class ProductMode extends Model {}

  ProductMode.init({
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    productUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vendor: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    isUse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isTarget: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  ProductMode.associate = ({ Product, Currency }) => {

    ProductMode.belongsTo(Product, {
      foreignKey: 'productUuid',
      as: 'product',
    });

    ProductMode.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return ProductMode;
}

export default init;
