import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileUploaderService } from './file-uploader.service';
// Reference: https://stackblitz.com/edit/angular-5-file-upload-queue?file=app%2Ffile-uploader.component.html
// https://gist.github.com/stuartaccent/51afc6b17d89d4dc6f3968ede5d789b6
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    FileUploaderComponent,
  ],
  providers: [
    // FileUploaderService,
  ],
  exports: [
    FileUploaderComponent
  ]
})
export class FileUploaderModule { }
