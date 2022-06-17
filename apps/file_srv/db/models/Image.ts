

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
    small: {
      type: DataTypes.BLOB,
    },
    middle: {
      type: DataTypes.BLOB,
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

  Image.associate = ({}) => {};

  return Image;
}

export default init;
