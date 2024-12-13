import { Component } from "@angular/core";

@Component({
    selector: "top-bar",
    standalone: true,
    template: `
        <div class="w-full p-4 flex justify-center">
            <div class="w-full max-w-[1500px]">
                <div class="font-extrabold flex text-2xl">
                    <p class="text-emerald-500">Resu</p><p class="text-slate-700">Match</p>
                </div>
            </div>
        </div>
    `
})

export class TopBar {

}