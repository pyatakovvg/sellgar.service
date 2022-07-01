

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
    paymentCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryCode: {
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

  Order.associate = ({ Product, Customer, OrderStatus, Delivery, Payment, Currency, Description }) => {

    Order.hasMany(Product, {
      foreignKey: 'orderUuid',
      as: 'products',
    });

    Order.hasOne(Customer, {
      foreignKey: 'orderUuid',
      as: 'customer',
    });

    Order.hasOne(Description, {
      foreignKey: 'orderUuid',
      as: 'description',
    });

    Order.belongsTo(OrderStatus, {
      foreignKey: 'statusCode',
      as: 'status',
    });

    Order.belongsTo(Delivery, {
      foreignKey: 'deliveryCode',
      as: 'delivery',
    });

    Order.belongsTo(Payment, {
      foreignKey: 'paymentCode',
      as: 'payment',
    });

    Order.belongsTo(Currency, {
      foreignKey: 'currencyCode',
      as: 'currency',
    });
  };

  return Order;
}

export default init;
