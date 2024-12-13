import { Component, Input } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'standard-button',
    imports: [RouterOutlet, RouterLink],
    standalone: true,
    template: `
        <button class="bg-slate-200 px-5 py-2 rounded-lg
          hover:brightness-90 shadow-md text-lg text-slate-600
        "
        >
            {{title}}
        </button>
    `,
})
export class StandardButton {

    @Input() title: string = "";

}