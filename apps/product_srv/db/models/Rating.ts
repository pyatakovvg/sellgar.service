
function init({ sequelize, DataTypes, Model }): any {
  class Rating extends Model {}

  Rating.init({
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
    commentUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    common: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    view: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    quality: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Rating.associate = () => {

  };

  return Rating;
}

export default init;
