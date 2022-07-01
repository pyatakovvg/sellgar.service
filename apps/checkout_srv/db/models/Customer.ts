
function init({ sequelize, DataTypes, Model }): any {
  class Customer extends Model {}

  Customer.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    orderUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Customer.associate = ({ Address }) => {

    Customer.hasOne(Address, {
      foreignKey: 'customerUuid',
      as: 'address',
    });
  };

  return Customer;
}

export default init;
