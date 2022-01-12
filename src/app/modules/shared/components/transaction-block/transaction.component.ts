import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
    private _currentFlowStep: TransactionFlowStep;
    statuses = TransactionFlowStep;
    stepStatuses = TransactionStepStatus;
    currentStep: TransactionConfigStep;
    approveStep: TransactionConfigStep;
    private _config: TransactionConfig;
    etherscanUrl = environment.etherscanUrl;

    @Input()
    set config(value: TransactionConfig) {
        if (value) {
            this._config = value;
            this.updateStep();
        }
    };

    get config(): TransactionConfig  {
        return this._config;
    }

    @Input()
    set currentFlowStep(value: TransactionFlowStep) {
        this._currentFlowStep = value;
        if (value && this._config?.steps.length) {
            this.updateStep()
        }
    }

    get currentFlowStep(): TransactionFlowStep {
        return this._currentFlowStep;
    }

    @Output() submit = new EventEmitter<void>();
    @Output() approve = new EventEmitter<void>();


    constructor() {
    }

    ngOnInit(): void {
        this.updateStep();
    }

    private updateStep(): void {
        this.currentStep = this.config?.steps.find(x => x.type === this.currentFlowStep) as TransactionConfigStep;
        this.approveStep = this.config?.steps.find(x => x.type === TransactionFlowStep.APPROVE) as TransactionConfigStep;
    }

    onApprove(): void {
        this.approve.emit();
    }

    onSubmit(): void {
        this.submit.emit();
    }
}
