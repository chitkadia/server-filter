import { Component } from '@angular/core';

import { LocaldataService } from './services/localdata.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'infibeam';
    jsonData: any = [];

    constructor(
        public readLocalData: LocaldataService
    ) {}

    async ngOnInit() {
        console.log(this.readLocalData.jsonData);
    }
}
