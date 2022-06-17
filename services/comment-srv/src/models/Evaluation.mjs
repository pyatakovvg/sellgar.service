
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType)  {
  const { Model } = Sequelize;

  class Evaluation extends Model {}

  Evaluation.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    },
    commentUuid: {
      type: DataType.UUID,
      allowNull: null,
    },
    customerUuid: {
      type: DataType.UUID,
      allowNull: null,
    },
    evaluate: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Evaluation.associate = () => {};

  return Evaluation;
};
