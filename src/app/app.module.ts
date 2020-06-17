import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PaginationComponent } from './pagination/pagination/pagination.component';

import { CustomRangeSlideDirective } from './directive/custom-range.directive';

@NgModule({
    declarations: [
        AppComponent,
        PaginationComponent,
        CustomRangeSlideDirective
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
