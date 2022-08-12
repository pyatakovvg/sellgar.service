

function init({ sequelize, DataTypes, Model }): any {
  class Image extends Model {}

  Image.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    large: {
      type: DataTypes.BLOB,
    },
    order: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    timestamps: true,
  });

  Image.associate = ({ Folder }) => {

    Image.belongsToMany(Folder, {
      through: 'FolderImage',
      foreignKey: 'imageUuid',
      as: 'folders',
      onDelete: 'cascade',
    });
  };

  return Image;
}

export default init;
