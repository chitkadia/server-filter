import { Component, Input, Output, EventEmitter } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

    @Input() page: number;
    @Input() count: number;
    @Input() perPage: number = environment.default_page_size;
    @Input() loading: boolean;

    @Input() selectedValue: number = environment.default_page_size;
    @Input() hidePagination: boolean = false;

    @Output() goPrev = new EventEmitter<number>();
    @Output() goNext = new EventEmitter<number>();
    @Output() goPage = new EventEmitter<number>();
    @Output() setPageSize = new EventEmitter<number>();

    pageSize = environment.pageSize;
    pagesToShow = environment.pagesToShow;
    pages_array: any;

    constructor() { }

    getMin(): number {
        return ((this.perPage * this.page) - this.perPage) + 1;
    }

    getMax(): number {
        let max = this.perPage * this.page;
        if (max > this.count) {
            max = this.count;
        }
        return max;
    }

    onPage(n: number): void {
        this.goPage.emit(n);
    }

    onPrev(prev: number): void {
        this.goPage.emit(prev);
    }

    onNext(next: number): void {
        this.goPage.emit(next);
    }

    totalPages(): number {
        return Math.ceil(this.count / this.perPage) || 0;
    }

    lastPage(): boolean {
        return this.perPage * this.page > this.count;
    }
    getPages() {
        const c = Math.ceil(this.count / this.perPage);
        const p = this.page || 1;
        const pagesToShow = this.pagesToShow || 9;
        const pages: number[] = [];
        const halfWay = Math.ceil(this.pagesToShow / 2);
        const isStart = this.page <= halfWay;
        const isEnd = c - halfWay < this.page;
        const isMiddle = !isStart && !isEnd;

        let ellipsesNeeded = this.pagesToShow < c;
        let i = 1;
        const times = pagesToShow - 1;
        while (i <= c && i <= this.pagesToShow) {
            let label;
            let pageNumber = this.calculatePageNumber(i, this.page, this.pagesToShow, c);
            let openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
            let closingEllipsesNeeded = (i === this.pagesToShow - 1 && (isMiddle || isStart));
            if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                label = '...';
            } else {
                label = pageNumber;
            }

            pages.push(label);
            i++;
        }
        pages.sort((a, b) => a - b);
        return pages;
    }

    private calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
        let halfWay = Math.ceil(paginationRange / 2);
        if (i === paginationRange) {
            return totalPages;
        } else if (i === 1) {
            return i;
        } else if (paginationRange < totalPages) {
            if (totalPages - halfWay < currentPage) {
                return totalPages - paginationRange + i;
            } else if (halfWay < currentPage) {
                return currentPage - halfWay + i;
            } else {
                return i;
            }
        } else {
            return i;
        }
    }

    setThisPageSize(selectedValue: number): void {
        console.log("***** : ", selectedValue);
        this.setPageSize.emit(selectedValue);
    }

    ngOnDestroy() {
        this.pages_array = [];
        this.page = 0;
        this.count = 0;
        this.perPage = 0;
        this.pagesToShow = 0;
        this.selectedValue = environment.default_page_size;
        this.hidePagination = false;
    }

}
