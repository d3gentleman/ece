export type SimulationStep = {
  id: string;
  name: string;
  description: string;
  action: () => void;
};

export class SimulationEngine {
  private steps: SimulationStep[] = [];
  private currentStepIndex: number = 0;

  constructor(steps: SimulationStep[]) {
    this.steps = steps;
  }

  public nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.executeCurrentStep();
    }
  }

  public prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.executeCurrentStep();
    }
  }

  public reset() {
    this.currentStepIndex = 0;
    this.executeCurrentStep();
  }

  private executeCurrentStep() {
    const step = this.steps[this.currentStepIndex];
    if (step && step.action) {
      step.action();
    }
  }

  public getCurrentStep(): SimulationStep | null {
    return this.steps[this.currentStepIndex] || null;
  }
}
