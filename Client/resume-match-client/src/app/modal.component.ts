import { CommonModule } from "@angular/common";
import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ModalService } from "./services/modal.service";

@Component({
    selector: 'modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="w-screen h-screen absolute border bg-gray-500/75 inset-0 flex justify-center items-center" *ngIf="isOpen()">
            <div class="w-96 bg-gray-100 rounded-lg relative shadow-xl flex flex-col p-4">
                <div class="font-bold">
                    {{getHeading()}}
                </div>
                <div class="flex-grow flex justify-center items-center py-4">
                    <div class="w-full text-sm">
                        {{message()}}
                    </div>
                </div>
                <div class="h-fit flex justify-end space-x-2">
                    <button 
                        (click)="onCancel()"
                        class=" border p-2 text-black font-semibold rounded-md bg-white text-sm"
                    >
                        Close
                    </button>
                    <button 
                        (click)="onAccept()"
                        class="bg-emerald-500 p-2 text-white font-semibold rounded-md min-w-12 text-sm"
                    >
                        {{buttonLabel()}}
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent {

    private modalService: ModalService = inject(ModalService);

    isOpen: WritableSignal<boolean> = signal(false);

    message: WritableSignal<string> = signal("");

    buttonLabel: WritableSignal<string> = signal("");


    ngOnInit() {
        this.isOpen = this.modalService.isOpen;
        this.message = this.modalService.message;
        this.buttonLabel = this.modalService.buttonLabel;
    }

    getHeading() {
        return this.modalService.heading();
    }

    onAccept() {
        this.modalService.accept();
    }

    onCancel() {
        this.modalService.close();
    }
}