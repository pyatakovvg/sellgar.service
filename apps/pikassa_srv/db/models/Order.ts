

function init({ sequelize, DataTypes, Model }): any {
  class Order extends Model {}

  Order.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    statusCode: {
      type: DataTypes.STRING,
      allowNull: true,
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

  Order.associate = ({ OrderStatus, Currency }) => {

    Order.belongsTo(OrderStatus, {
      foreignKey: 'statusCode',
      as: 'status',
    });

    Order.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return Order;
}

export default init;
