import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]',
})
export class FileDragDropDirective {
  @Output() private filesChangeEmitter: EventEmitter<File[]> =
    new EventEmitter();
  @HostBinding('style.background') private background = '#eee';
  // @HostBinding('style.border') private borderStyle = '2px dashed';
  @HostBinding('style.border-color') private borderColor = '#696D7D';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'lightgray';
    this.borderColor = 'cadetblue';
    // this.borderStyle = '3px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#696D7D';
    // this.borderStyle = '2px dashed';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    console.log('file dropped');
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    this.filesChangeEmitter.emit(valid_files);
  }
}
