
function init({ sequelize, DataTypes, Model }): any {
  class CommentTheme extends Model {}

  CommentTheme.init({
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: '',
    },
  }, {
    sequelize,
    timestamps: false,
  });

  CommentTheme.associate = () => {};

  return CommentTheme;
}

export default init;
