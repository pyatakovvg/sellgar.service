

function init({ sequelize, DataTypes, Model }): any {
  class Payment extends Model {}

  Payment.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    orderUuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
    },
    paymentLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Payment.associate = ({}) => {};

  return Payment;
}

export default init;
