import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SagaStatuses, SagaType } from '@shared/constants/enums/saga.enum';
import { SagaInstance, SagaInstanceDefinition } from '@shared/schemas/saga.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class SagaOrchestrationRepository {
  constructor(@InjectModel(SagaInstanceDefinition.name) private readonly model: Model<SagaInstance>) {}

  create(sagaType: SagaType, context: Record<string, any>, stepNames: string[]) {
    return this.model.create({
      sagaType,
      context,
      steps: stepNames.map((stepName) => ({ stepName })),
    });
  }

  findById(id: string) {
    return this.model.findById(new ObjectId(id)).exec();
  }

  updateStatus(id: string, status: SagaStatuses, error?: string) {
    const data: Partial<SagaInstance> = { status };
    if (error) {
      data.error = error;
    }
    return this.model.findByIdAndUpdate(new ObjectId(id), data, { new: true }).exec();
  }

  updateCurrentStep(id: string, stepIndex: number) {
    return this.model.findByIdAndUpdate(new ObjectId(id), { currentStep: stepIndex }, { new: true }).exec();
  }

  updateContext(id: string, context: Record<string, any>) {
    return this.model.findByIdAndUpdate(new ObjectId(id), { context }, { new: true }).exec();
  }

  makeStepRunning(id: string, stepIndex: number) {
    return this.model
      .findByIdAndUpdate(
        new ObjectId(id),
        {
          [`steps.${stepIndex}.status`]: SagaStatuses.RUNNING,
          [`steps.${stepIndex}.startedAt`]: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  makeStepCompleted(id: string, stepIndex: number, data?: any) {
    return this.model
      .findByIdAndUpdate(
        new ObjectId(id),
        {
          [`steps.${stepIndex}.status`]: SagaStatuses.COMPLETED,
          [`steps.${stepIndex}.completedAt`]: new Date(),
          [`steps.${stepIndex}.data`]: data,
        },
        { new: true },
      )
      .exec();
  }

  makeStepFailed(id: string, stepIndex: number, error: string) {
    return this.model
      .findByIdAndUpdate(
        new ObjectId(id),
        {
          [`steps.${stepIndex}.status`]: SagaStatuses.FAILED,
          [`steps.${stepIndex}.completedAt`]: new Date(),
          [`steps.${stepIndex}.error`]: error,
        },
        { new: true },
      )
      .exec();
  }

  makeStepCompensating(id: string, stepIndex: number) {
    return this.model
      .findByIdAndUpdate(
        new ObjectId(id),
        {
          [`steps.${stepIndex}.status`]: SagaStatuses.COMPENSATING,
          [`steps.${stepIndex}.startedAt`]: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  makeStepCompensated(id: string, stepIndex: number) {
    return this.model
      .findByIdAndUpdate(
        new ObjectId(id),
        {
          [`steps.${stepIndex}.status`]: SagaStatuses.COMPENSATED,
          [`steps.${stepIndex}.completedAt`]: new Date(),
        },
        { new: true },
      )
      .exec();
  }
}
