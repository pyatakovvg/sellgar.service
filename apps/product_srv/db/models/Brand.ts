
function init({ sequelize, DataTypes, Model }): any {
  class Brand extends Model {}

  Brand.init({
    code: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
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

  Brand.associate = ({ Product }) => {

    Brand.hasMany(Product, {
      foreignKey: 'brandCode',
      as: 'products',
    });
  };

  return Brand;
}

export default init;