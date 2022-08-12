

function init({ sequelize, Model }): any {
  class FolderImage extends Model {}

  FolderImage.init({}, {
    sequelize,
    timestamps: false,
  });

  return FolderImage;
}

export default init;
