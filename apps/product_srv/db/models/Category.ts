
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

  Category.associate = ({ Group, Brand }) => {

    Category.belongsToMany(Group, {
      through: 'GroupCategory',
      foreignKey: 'categoryUuid',
      timestamps: false,
      as: 'groups',
    });

    Category.belongsToMany(Brand, {
      through: 'CategoryBrand',
      foreignKey: 'categoryUuid',
      timestamps: false,
      as: 'brands',
    });
  };

  return Category;
}

export default init;
