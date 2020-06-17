import { Directive, ElementRef, OnInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as ranges from './custom-ranges';

@Directive({
	selector: '[customRangeSlider]'
})

export class CustomRangeSlideDirective implements OnInit {
	@Input('rangeType')rangeType;
	@Output('updatePrice') updatePrice: EventEmitter<any> = new EventEmitter<any>();
	position = 0;
	currentValue = 0;
	values = [];
	
	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private control : NgControl
		) {
	}

	ngOnInit() {
		this.setInputTags();
	}

	setInputTags() {
        console.log(this.control.control.value);
		this.values = ranges[this.rangeType];
		this.position = this.getPosition(this.control.control.value);
		const range = this.renderer.createElement('input');
		this.renderer.setAttribute(range,'type','range');
		this.renderer.setAttribute(range,'min','0');
		this.renderer.setAttribute(range,'max',(this.values.length-1).toString());
		this.renderer.addClass(range,'slider');
		this.renderer.setAttribute(range,'value',this.position.toString());

		this.renderer.appendChild(this.renderer.parentNode(this.elementRef.nativeElement),range);

		this.renderer.listen(range , 'input' , (event) => {
			let position = +event.target.value;
			this.setPositionValue(position);
		});

		this.control.control.valueChanges.subscribe((val) => {
			if(this.currentValue !== val) {
                this.currentValue = val;
                this.position = this.getPosition(val);
                range.value = this.position;
			}
		});
	}

	setPositionValue(position){
		this.currentValue = +this.getValue(position).toFixed(0);
		this.control.control.setValue(this.currentValue);
	}

	// Calculate slider value from a position
	getValue(position) {
		return this.values[position];
	}

	// Calculate slider position from a value
	getPosition(value) {
		return this.values.findIndex(v => v >= value);
	}
}
