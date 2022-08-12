

function init({ sequelize, DataTypes, Model }): any {
  class Folder extends Model {}

  Folder.init({
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
    parentUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  }, {
    sequelize,
    timestamps: true,
  });

  Folder.associate = ({ Image }) => {

    Folder.hasMany(Folder, {
      foreignKey: 'parentUuid',
      as: 'folders',
    });

    Folder.belongsToMany(Image, {
      through: 'FolderImage',
      foreignKey: 'folderUuid',
      as: 'images',
      onDelete: 'cascade',
    });
  };

  return Folder;
}

export default init;
