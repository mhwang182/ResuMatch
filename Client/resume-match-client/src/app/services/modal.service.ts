import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    isOpen: WritableSignal<boolean> = signal(false);

    accepted: WritableSignal<boolean> = signal(false);

    message: WritableSignal<string> = signal("");

    buttonLabel: WritableSignal<string> = signal("");

    heading: WritableSignal<string> = signal("");

    onAccept: undefined | (() => any) = undefined;

    setOpen() {
        this.isOpen.update(() => true);
    }

    setAccept(func: any) {
        this.onAccept = func;
    }

    setMessage(message: string) {
        this.message.update(() => message);
    }

    setButtonLabel(label: string) {
        this.buttonLabel.update(() => label);
    }

    setHeading(text: string) {
        this.heading.update(() => text);
    }

    accept() {
        if (this.onAccept) {
            this.onAccept();
        }
        this.close();
    }

    close() {
        this.onAccept = undefined;
        this.isOpen.update(() => false);
        this.message.update(() => "");
        this.buttonLabel.update(() => "");
        this.heading.update(() => "");
    }

}