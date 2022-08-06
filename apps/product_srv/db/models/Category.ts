
function init({ sequelize, DataTypes, Model }): any {
  class Category extends Model {}

  Category.init({
    code: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    groupCode: {
      type: DataTypes.STRING,
      allowNull: false,
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

  Category.associate = ({ Group, Product }) => {

    Category.belongsTo(Group, {
      foreignKey: 'groupCode',
      as: 'group',
    });

    Category.hasMany(Product, {
      foreignKey: 'categoryCode',
      as: 'products',
    });
  };

  return Category;
}

export default init;
