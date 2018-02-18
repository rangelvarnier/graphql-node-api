import { ModelsInterface } from './ModeslInterface';

export interface BaseModelInterface {
  prototype?;
  associate?(models: ModelsInterface): void;
}
