
function init({ sequelize, DataTypes, Model }): any {
  class Comment extends Model {}

  Comment.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    productUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    themeCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Гость',
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Comment.associate = ({ CommentTheme }) => {

    Comment.belongsTo(CommentTheme, {
      foreignKey: 'themeCode',
      as: 'theme',
    });
  };

  return Comment;
}

export default init;
