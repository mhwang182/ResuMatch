import { Component, Input } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'signup-button',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
        <button class="bg-emerald-500 px-5 py-2 rounded-lg 
            text-slate-100  hover:brightness-90 
            shadow-md text-lg
        "
        [routerLink]="link"
        >
            {{title}}
        </button>
    `
})
export class SignUpButton {

    title = "Sign up"

    @Input() link!: string;

}