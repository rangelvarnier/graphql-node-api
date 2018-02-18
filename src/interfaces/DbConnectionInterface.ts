import * as Sequelize from 'sequelize';
import { ModelsInterface } from './ModeslInterface';

export interface DbConnectionInterface extends ModelsInterface {
  sequelize: Sequelize.Sequelize;
}
