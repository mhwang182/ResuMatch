import { Component, inject, signal, WritableSignal } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ModalService } from "../services/modal.service";

@Component({
    selector: 'user-info',
    standalone: true,
    imports: [],
    template: `
        <div class="size-full flex justify-center">
            <div class="w-full max-w-[800px] flex flex-col space-y-4">
                <span class="text-2xl font-semibold">Personal Information </span>
                <div class="flex flex-wrap gap-2">
                    <div class="flex flex-col p-4 border rounded-lg shadow-sm w-full max-w-[49%] justify-center space-y-3">
                        <span class="font-bold text-lg">Username</span>
                        <span class="text-gray-500 font-light">{{userDetails().username}}</span>
                    </div>
                    <div class="flex flex-col p-4 border rounded-lg shadow-sm w-full max-w-[49%] justify-center space-y-3">
                        <span class="font-bold text-lg">Email:</span>
                        <span class="text-gray-500 font-light">{{userDetails().email}}</span>
                    </div>
                    <div class="flex flex-col p-4 border rounded-lg shadow-sm w-full max-w-[49%] justify-center space-y-3">
                        <span class="font-bold text-lg">Account Created:</span>
                        <span class="text-gray-500 font-light">{{userDetails().createdAt}}</span>
                    </div>
                    <div class="flex flex-col p-4 border rounded-lg shadow-sm w-full max-w-[49%] justify-center space-y-3">
                        <span class="font-bold text-lg">Logout:</span>
                        <!-- <span class="text-gray-500">{{userDetails().createdAt}}</span> -->
                        <div class="flex space-x-2">
                            <button 
                                class="bg-emerald-500 p-2 rounded-md text-sm w-fit text-white"
                                (click)="logout(false)"
                            >Logout</button>
                            <button 
                                class="bg-emerald-500 p-2 rounded-md text-sm w-fit text-white"
                                (click)="logout(true)"
                            >Logout All Devices</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UserInfoComponent {

    private authService: AuthService = inject(AuthService);

    private modalService: ModalService = inject(ModalService);

    userDetails: WritableSignal<any> = signal({ username: "", email: "", createdAt: "" })

    ngOnInit() {
        this.userDetails = this.authService.userInfo;
    }

    logout(all: boolean) {
        this.modalService.setAccept(() => {
            if (all) {
                this.authService.updateRefreshVersion().subscribe();
                this.authService.logout();
            } else {
                this.authService.logout();
            }
        })
        this.modalService.setHeading("Logout");
        this.modalService.setMessage(all ? "Are you sure you want to logout of all devices?" : "Are you sure you want to logout?");
        this.modalService.setButtonLabel("Ok");
        this.modalService.setOpen();
    }
}