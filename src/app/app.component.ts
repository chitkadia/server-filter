import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../environments/environment';

import { jsonData } from '../assets/data/localdata';

interface jsonData {
    Model: string;
    RAM: string;
    HDD: string;
    Location: string;
    Price: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Infibeam';
    jsonData: jsonData[] = jsonData; // Main data
    showData: Array<any> = []; // Filtered data
    filteredData: Array<any> = [];
    locationList: Array<any> = [];
    hdd: Array<any> = [
        { name: "SAS", value: "SAS" },
        { name: "SATA", value: "SATA" },
        { name: "SSD", value: "SSD" }
    ];
    ramList: Array<any> = [
        { name: "2GB", value: "2GB" },
        { name: "4GB", value: "4GB" },
        { name: "8GB", value: "8GB" },
        { name: "12GB", value: "12GB" },
        { name: "16GB", value: "16GB" },
        { name: "24GB", value: "24GB" },
        { name: "32GB", value: "32GB" },
        { name: "48GB", value: "48GB" },
        { name: "64GB", value: "64GB" },
        { name: "96GB", value: "96GB" }
    ];

    // Pagination
    cur_page: number = 1;
    page_size: number = environment.default_page_size;
    total_pages: number;
    total_records: number;
    selectedValue: number = environment.default_page_size;

    slide: FormGroup;
    checkedRam: Array<any> = [];

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.slide = this.formBuilder.group({
            exteriorRang: [0]
        });
    }

    ngOnInit() {
        this.showData = this.jsonData;
        this.filteredData = this.jsonData;
        this.total_records = this.jsonData.length;
        this.locationList = this.jsonData.map((location, i) => {
            return location.Location
        });
        this.locationList.filter((el, i) => {
            return this.locationList.indexOf(el) == i
        });
        this.slide.valueChanges.subscribe((val) => {
            if ('exteriorRang' in val) {
                if (val.exteriorRang != 0) {
                    let gbtb = "TB";
                    if (val.exteriorRang.toString().length == 3) {
                        gbtb = "GB";
                    }
                    this.filterData("x" + val.exteriorRang + gbtb, "STORAGE");
                } else {
                    this.filterData("x", "STORAGE");
                }
            }
        });
        this.getThisPage(1, this.filteredData);
    }

    filterData(element, itemName) {
        switch (itemName) {
            case "HDD":
                this.showData = this.findByMatchingProperties(this.filteredData, { HDD: element });
                this.filteredData = this.showData;
                var data = this.showData;
                if (element == 0) {
                    data = this.jsonData;
                    // this.showData = this.jsonData;
                    // this.filteredData = this.jsonData;
                }
                this.getThisPage(1, data);
                break;
            case "Location":
                this.showData = this.findByMatchingProperties(this.filteredData, { Location: element });
                // this.filteredData = this.showData;
                var data = this.showData;
                if (element == 0) {
                    data = this.jsonData;
                    // this.showData = this.jsonData;
                    // this.filteredData = this.jsonData;
                }
                this.getThisPage(1, data);
                break;
            case "STORAGE":
                this.showData = this.findByMatchingProperties(this.filteredData, { HDD: element });
                // this.filteredData = this.showData;
                var data = this.showData;
                if (element == 0) {
                    data = this.jsonData;
                    // this.showData = this.jsonData;
                    // this.filteredData = this.jsonData;
                }
                this.getThisPage(1, data);
                break;
            default:
                this.showData = this.findByMatchingProperties(this.filteredData, { HDD: element });
                // this.filteredData = this.showData;
                var data = this.showData;
                if (element == 0) {
                    data = this.jsonData;
                    // this.showData = this.jsonData;
                    // this.filteredData = this.jsonData;
                }
                this.getThisPage(1, data);
                break;
        }
    }

    checkUncheckThis(event) {
        this.showData = [];
        if (event.target.checked) {
            this.checkedRam.push(event.target.value);
        } else {
            let index = this.checkedRam.indexOf(event.target.value);
            if (index > -1) {
                this.checkedRam.splice(index, 1);
            }
        }
        if (this.checkedRam.length) {
            this.checkedRam.map((el) => {
                this.showData = [...this.showData, ...this.findByMatchingPropertiesCheckbox(this.filteredData, { RAM: el })];
            });
        } else {
            this.showData = this.filteredData;
            this.getThisPage(1);
        }
    }

    getThisPage(cur_page, data = null) {
        this.cur_page = cur_page;
        let offset = (this.cur_page - 1) * this.selectedValue + 1;
        let endOffset = (this.selectedValue * this.cur_page) + 1;
        this.showData = this.filteredData.slice(offset, endOffset);
        this.total_records = data.length;
    }

    setThisPageSize(selectedValue) {
        this.page_size = selectedValue;
        this.selectedValue = selectedValue;
        let offset = (this.cur_page - 1) * selectedValue + 1;
        let endOffset = (selectedValue * this.cur_page) + 1;
        this.showData = this.filteredData.slice(offset, endOffset);
    }

    findByMatchingProperties(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                return entry[key].includes(properties[key]);
            });
        });
    }

    findByMatchingPropertiesCheckbox(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                let patt = new RegExp("^"+properties[key]);
                return patt.test(entry[key]);
                // return entry[key].includes(properties[key]);
            });
        });
    }
}
