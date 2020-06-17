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

    hddFilter = "";
    locationFilter = "";
    storageFilter = "";

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
        this.locationList = this.locationList.filter(this.removeDuplicate);
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
        this.getThisPage(1);
    }

    /**
     * 
     * This function removed duplicate element from an array
     * @param value value to check the index
     * @param index looped index
     * @param self array
     */
    removeDuplicate(value, index, self) { 
        return self.indexOf(value) === index;
    }

    /**
     * 
     * This function is used to filter the data from the array of json
     * @param element value
     * @param itemName section
     */
    filterData(element, itemName) {
        switch (itemName) {
            case "HDD":
                this.hddFilter = element;
                break;
            case "Location":
                this.locationFilter = element;
                break;
            case "STORAGE":
                this.storageFilter = element;
                break;
            default:
                this.hddFilter = this.hddFilter;
                break;
        }

        this.showData = this.jsonData.filter((el) => {
            if (el.HDD.includes(this.hddFilter) && el.Location.includes(this.locationFilter) && el.HDD.includes(this.storageFilter)) {
                return el;
            }
        });

        if (this.checkedRam.length) {
            let tempArray = [];
            this.checkedRam.map((el, i) => {
                let tempData = this.findByMatchingPropertiesCheckbox(this.showData, { RAM: el });
                if (tempData.length > 0) {
                    tempArray.push(tempData);
                }                
            });
            this.showData = [];
            tempArray.map((element) => {
                element.map((subel) => {
                    this.showData.push(subel);
                });
            });
        }
        this.filteredData = this.showData;
        this.total_records = this.filteredData.length;
        this.getThisPage(1);
    }

    /**
     * 
     * This function is used to add / remove checked / unchecked  element in array
     * @param event event
     */
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
        this.filterData(this.hddFilter, '');
    }

    /**
     * 
     * This function is used to get the selected number grid from pagination
     * @param cur_page number
     */
    getThisPage(cur_page) {
        this.cur_page = cur_page;
        let offset = (this.cur_page - 1) * this.selectedValue;
        let endOffset = this.selectedValue * this.cur_page;
        this.showData = this.filteredData.slice(offset, endOffset);
        this.total_records = this.filteredData.length;
    }

    /**
     * 
     * This function is used to set the total number of records to show in the grid
     * @param selectedValue number
     */
    setThisPageSize(selectedValue) {
        this.page_size = selectedValue;
        this.selectedValue = selectedValue;
        let offset = (this.cur_page - 1) * selectedValue + 1;
        let endOffset = (selectedValue * this.cur_page) + 1;
        this.showData = this.filteredData.slice(offset, endOffset);
    }

    /**
     * 
     * This function is used to filter the given key value from the array of object with dynamic regex
     * @param set Object
     * @param properties Key Value pair of object to match
     */
    findByMatchingPropertiesCheckbox(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                let patt = new RegExp("^"+properties[key]);
                return patt.test(entry[key]);
            });
        });
    }
}
