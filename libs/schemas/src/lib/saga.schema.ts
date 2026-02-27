import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { SagaStatuses, SagaStepStatuses, SagaType } from '@shared/constants/enums/saga.enum';

export class SagaStepData {
  @Prop({ type: String, required: true })
  stepName: string;

  @Prop({ type: String, enum: SagaStepStatuses, default: SagaStepStatuses.PENDING })
  status: SagaStepStatuses;

  @Prop({ type: Object })
  data?: any;

  @Prop({ type: String })
  error?: string;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;
}

@Schema({
  collection: 'saga_instances',
})
export class SagaInstance extends BaseSchema {
  @Prop({ type: String, enum: SagaType, required: true })
  sagaType: SagaType;

  @Prop({ type: String, enum: SagaStatuses, default: SagaStatuses.PENDING })
  status: SagaStatuses;

  @Prop({ type: Number, default: 0 })
  currentStep: number;

  @Prop({ type: [Object], default: [] })
  steps: SagaStepData[];

  @Prop({ type: Object, required: true })
  context: Record<string, any>;

  @Prop({ type: String })
  error?: string;
}

const SagaInstanceSchema = createSchema(SagaInstance);
export const SagaInstanceDefinition = {
  name: SagaInstance.name,
  schema: SagaInstanceSchema,
};
