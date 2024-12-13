import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        Hello world!
    `,
})
export class TestComponent {

}