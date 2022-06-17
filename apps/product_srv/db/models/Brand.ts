
function init({ sequelize, DataTypes, Model }): any {
  class Brand extends Model {}

  Brand.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING(64),
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

  Brand.associate = ({ Category }) => {

    Brand.belongsToMany(Category, {
      through: 'CategoryBrand',
      foreignKey: 'brandUuid',
      timestamps: false,
      as: 'categories',
    });
  };

  return Brand;
}

export default init;