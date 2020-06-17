import { Component } from '@angular/core';

import { jsonData } from './localdata';

interface jsonData {
    Model: string;
    RAM: string;
    HDD: number;
    Location: number;
    Price: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'infibeam';
    jsonData: jsonData[] = jsonData;

    constructor() { }

    ngOnInit() {
        console.log(this.jsonData);
    }
}
