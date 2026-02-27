import { Injectable, Logger } from '@nestjs/common';
import { SagaOrchestrationRepository } from './saga-orchestration.repository';
import { SagaContext, SagaStep } from '@shared/contracts/saga/saga.interface';
import { SagaStatuses, SagaStepStatuses, SagaType } from '@shared/constants/enums/saga.enum';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';

@Injectable()
export class SagaOrchestrationService {
  private readonly logger = new Logger(SagaOrchestrationService.name);

  constructor(private readonly repository: SagaOrchestrationRepository) {}

  async execute<TContext extends SagaContext>({
    sagaType,
    steps,
    context,
  }: {
    sagaType: SagaType;
    steps: SagaStep<TContext>[];
    context: TContext;
  }) {
    const saga = await this.repository.create(
      sagaType,
      context,
      steps.map((step) => step.name),
    );
    this.logger.log(`Saga ${saga.id} created for type ${sagaType}`);

    context.sagaId = saga.id;
    await this.repository.updateContext(saga.id, context);
    await this.repository.updateStatus(saga.id, SagaStatuses.RUNNING);

    try {
      for (let i = 0; i < steps.length; i++) {
        await this.repository.updateCurrentStep(saga.id, i);
        await this.executeStep(saga.id, i, steps[i], context);
      }

      const completedSaga = await this.repository.updateStatus(saga.id, SagaStatuses.COMPLETED);
      this.logger.log(`Saga ${saga.id} completed successfully`);
      return completedSaga;
    } catch (error) {
      const message = error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR;
      this.logger.error(`Saga ${saga.id} failed: ${message}`, error instanceof Error ? error.stack : '');
      await this.repository.updateStatus(saga.id, SagaStatuses.FAILED, message);

      await this.compensate(saga.id, steps, context);
      throw error;
    }
  }

  private async executeStep<TContext extends SagaContext>(
    sagaId: string,
    stepIndex: number,
    step: SagaStep<TContext>,
    context: TContext,
  ) {
    this.logger.log(`Executing step ${stepIndex}: ${step.name} for saga ${sagaId}`);
    await this.repository.makeStepRunning(sagaId, stepIndex);
    try {
      const result = await step.execute(context);
      if (!result.success) {
        throw new Error(result.error || `Step ${step.name} failed`);
      }

      if (result.data) {
        Object.assign(context, result.data);
        await this.repository.updateContext(sagaId, context);
      }

      await this.repository.makeStepCompleted(sagaId, stepIndex, result.data);
      this.logger.log(`Step ${stepIndex}: ${step.name} completed for saga ${sagaId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR;
      this.logger.error(`Step ${stepIndex}: ${step.name} failed for saga ${sagaId}: ${message}`);
      await this.repository.makeStepFailed(sagaId, stepIndex, message);
      throw error;
    }
  }

  private async compensate<TContext extends SagaContext>(
    sagaId: string,
    steps: SagaStep<TContext>[],
    context: TContext,
  ) {
    this.logger.log(`Starting compensation for saga ${sagaId}`);
    const saga = await this.repository.updateStatus(sagaId, SagaStatuses.COMPENSATING);
    if (!saga) {
      this.logger.error(`Saga ${sagaId} not found for compensation`);
      return;
    }

    const completedSteps = saga.steps.filter((step) => step.status === SagaStepStatuses.COMPLETED);
    for (let i = completedSteps.length - 1; i >= 0; i--) {
      const step = steps.find((step) => step.name === completedSteps[i].stepName);
      if (step && step.compensate) {
        try {
          this.logger.log(`Compensating step: ${step.name} for saga ${sagaId}`);
          const stepIndex = steps.findIndex((step) => step.name === completedSteps[i].stepName);
          await this.repository.makeStepCompensating(sagaId, stepIndex);

          await step.compensate(context);

          await this.repository.makeStepCompensated(sagaId, stepIndex);
          this.logger.log(`Step ${step.name} compensated for saga ${sagaId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Failed to compensate step ${step.name} for saga ${sagaId}: ${errorMessage}`);
        }
      }
    }

    await this.repository.updateStatus(sagaId, SagaStatuses.COMPENSATED);
    this.logger.log(`Compensation completed for saga ${sagaId}`);
  }
}
