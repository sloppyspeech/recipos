import { Directive,ElementRef,Output,EventEmitter } from '@angular/core';


@Directive({
  selector: '[deferLoad]'
})
export class ImageLazyLoadDirective {
    @Output() public deferLoad: EventEmitter<any> = new EventEmitter();
  
     interSecObserver? : IntersectionObserver;
  
    constructor (
        private elementRef: ElementRef
    ) {}
  
  
    ngAfterViewInit() {
      this.interSecObserver = new IntersectionObserver(entries => {
        this.checkForIntersection(entries);
    }, {});
    this.interSecObserver.observe(<Element>(this.elementRef.nativeElement));
    }
  
    checkForIntersection(entries:Array<IntersectionObserverEntry>){
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (this.checkIfIntersecting(entry)) {
            this.deferLoad.emit();
            this.interSecObserver.unobserve(<Element>(this.elementRef.nativeElement));
            this.interSecObserver.disconnect();
        }
    });
  }
  
  
  private checkIfIntersecting (entry: IntersectionObserverEntry) {
    return (<any>entry).isIntersecting && entry.target === this.elementRef.nativeElement;
  }
  
  }
