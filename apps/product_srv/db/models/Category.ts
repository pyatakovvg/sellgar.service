
function init({ sequelize, DataTypes, Model }): any {
  class Category extends Model {}

  Category.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    groupUuid: {
      type: DataTypes.UUID,
      allowNull: false,
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

  Category.associate = ({ Group, Product }) => {

    Category.hasMany(Product, {
      foreignKey: 'categoryUuid',
      as: 'products',
    });

    Category.belongsTo(Group, {
      foreignKey: 'groupUuid',
      as: 'group',
    });
  };

  return Category;
}

export default init;
