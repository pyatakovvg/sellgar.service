
function init({ sequelize, DataTypes, Model }): any {
  class Group extends Model {}

  Group.init({
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

  Group.associate = ({ Category, Product }) => {

    Group.belongsToMany(Category, {
      through: 'GroupCategory',
      foreignKey: 'groupUuid',
      timestamps: false,
      as: 'categories',
    });

    Group.hasMany(Product, {
      foreignKey: 'groupUuid',
      as: 'products',
    });
  };

  return Group;
}

export default init;
