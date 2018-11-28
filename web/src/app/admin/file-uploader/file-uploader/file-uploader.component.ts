import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FileQueueObject, FileUploaderService } from '../file-uploader.service';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  _url: string;
  @Input() set url(value: string){
    console.log("set url",value);
    this._url = value;
    this.uploader.url = this.url;
  }
  get url(): string{
    return this._url;
  }
  @Output() onCompleteItem = new EventEmitter();

  @Input() singleFile: boolean = false;
  @Input() accept: string = '.png,.jpg,.jpeg,.btmp';

  @ViewChild('fileInput') fileInput;
  queue: Observable<FileQueueObject[]>;
  fileCount: number;

  public uploader: FileUploaderService;
  constructor(private httpClient:HttpClient) {
    this.uploader = new FileUploaderService(httpClient);
  }

  ngOnInit() {
    this.queue = this.uploader.queue;
    this.uploader.onCompleteItem = this.completeItem;
    this.queue.subscribe(queue=>{
      this.fileCount = queue.length;
    });
  }

  completeItem = (item: FileQueueObject, response: any) => {
    this.onCompleteItem.emit({ item, response });
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
  //   this.validateImage(fileBrowser.files[0]).subscribe(result=>{
  //       console.log("validateImage",result);
  // });
  }

  validateImage(imageFile){
    var _URL = window.URL;
    return Observable.create((observer:Observer<boolean>)=>{
      var image: HTMLImageElement = new Image();
      image.onload = function(imageLoad){
        let self: HTMLImageElement = <HTMLImageElement> this;
        console.log("imageLoad",imageLoad);
        console.log("this.width + this.height",self.width,self.height);

        // if (this.width + this.height === 0) {
        //     this.onerror();
        //     return;
        // }
        //
        // // Check the image resolution
        // if (this.width >= 400 && this.height >= 400) {
        //     deferred.resolve(true);
        // } else {
        //     alert("The image resolution is too low.");
        //     deferred.resolve(false);
        // }
        observer.next(true);
        observer.complete();
      };

      image.onerror = (error)=>{
        console.log("error",error);
        observer.next(false);
        observer.complete();
      }

      image.src = _URL.createObjectURL(imageFile);
    });
  }

}
