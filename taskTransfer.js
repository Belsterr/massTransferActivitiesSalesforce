import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUsers from '@salesforce/apex/TaskTransferController.getUsers';
import getRecordOwner from '@salesforce/apex/TaskTransferController.getRecordOwner';
import transferActivities from '@salesforce/apex/TaskTransferController.transferActivities';

export default class TaskTransfer extends LightningElement {
    @api recordId; 
    @track isModalOpen = false;
    @track isLoading = false;
    @track message = '';
    @track messageClass = '';
    @track userOptions = [];
    @track currentUser = '';
    @track newUser = '';
    @track activityType = '';
    @track startDate = '';
    @track endDate = '';

    connectedCallback() {
        this.loadUsers();
    }

    loadUsers() {
        this.isLoading = true;
        getUsers()
            .then((result) => {
                this.userOptions = result.map((user) => ({
                    label: user.Name,
                    value: user.Id,
                }));
                this.isLoading = false;
            })
            .catch((error) => {
                this.showMessage('Erro ao carregar usuários: ' + (error.body?.message || 'Erro desconhecido'), 'error');
                this.isLoading = false;
            });
    }

    openModal() {
        this.isModalOpen = true;
        if (this.recordId) {
            this.loadRecordOwner();
        }
        this.resetFormPartial();
    }

    loadRecordOwner() {
        this.isLoading = true;
        getRecordOwner({ recordId: this.recordId })
            .then((ownerId) => {
                this.currentUser = ownerId;
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('Erro ao buscar dono do registro:', error);
                this.isLoading = false;
            });
    }

    closeModal() {
        this.isModalOpen = false;
        this.resetForm();
    }

    resetForm() {
        this.activityType = '';
        this.currentUser = '';
        this.newUser = '';
        this.startDate = '';
        this.endDate = '';
        this.message = '';
        this.messageClass = '';
    }

    resetFormPartial() {
        this.activityType = '';
        this.newUser = '';
        this.startDate = '';
        this.endDate = '';
        this.message = '';
        this.messageClass = '';
    }

    handleActivityTypeChange(event) {
        this.activityType = event.target.value;
    }

    handleCurrentUserChange(event) {
        this.currentUser = event.detail.value;
    }

    handleNewUserChange(event) {
        this.newUser = event.detail.value;
    }

    handleStartDateChange(event) {
        this.startDate = event.detail.value;
    }

    handleEndDateChange(event) {
        this.endDate = event.detail.value;
    }

    get isTransferDisabled() {
        return !this.activityType || !this.currentUser || !this.newUser;
    }

    transferActivities() {
        if (this.isTransferDisabled) {
            this.showMessage('Preencha os campos obrigatórios', 'warning');
            return;
        }

        this.isLoading = true;
        transferActivities({
            activityType: this.activityType,
            currentUserId: this.currentUser,
            newUserId: this.newUser,
            startDate: this.startDate || null,
            endDate: this.endDate || null,
        })
            .then((result) => {
                this.showMessage(
                    `✅ ${result} atividade(s) transferida(s) com sucesso!`,
                    'success'
                );
                this.isLoading = false;
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                this.showMessage('Erro: ' + (error.body?.message || 'Erro desconhecido'), 'error');
                this.isLoading = false;
            });
    }

    showMessage(msg, type) {
        this.message = msg;
        this.messageClass = type === 'error' 
            ? 'slds-notify slds-notify_alert slds-alert_error' 
            : type === 'success'
            ? 'slds-notify slds-notify_alert slds-alert_success'
            : 'slds-notify slds-notify_alert slds-alert_warning';
    }
}
