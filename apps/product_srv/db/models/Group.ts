
function init({ sequelize, DataTypes, Model }): any {
  class Group extends Model {}

  Group.init({
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

  Group.associate = ({ Category, Product }) => {

    Group.hasMany(Category, {
      foreignKey: 'groupCode',
      timestamps: false,
      as: 'categories',
    });

    Group.hasMany(Product, {
      foreignKey: 'groupCode',
      as: 'products',
    });
  };

  return Group;
}

export default init;
