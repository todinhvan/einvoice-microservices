import { SagaStepStatuses } from '@shared/constants/enums/saga.enum';

export interface SagaStepResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SagaStep<TContext = any> {
  name: string;
  execute: (context: TContext) => Promise<SagaStepResult>;
  compensate?: (context: TContext) => Promise<void>;
}

export interface SagaStepExecution {
  stepName: string;
  status: SagaStepStatuses;
  data?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface SagaContext {
  sagaId: string;
  [key: string]: any;
}
