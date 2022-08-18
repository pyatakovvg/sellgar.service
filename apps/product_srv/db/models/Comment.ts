
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
    positive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    negative: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Comment.associate = ({ Rating, CommentTheme }) => {

    Comment.belongsTo(CommentTheme, {
      foreignKey: 'themeCode',
      as: 'theme',
    });

    Comment.hasOne(Rating, {
      foreignKey: 'commentUuid',
      as: 'rating',
    });

    Comment.hasMany(Comment, {
      foreignKey: 'parentUuid',
      as: 'comments',
    });
  };

  return Comment;
}

export default init;
