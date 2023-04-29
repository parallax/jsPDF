import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input'
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HtmlexampleComponent } from '../htmlexample/htmlexample.component';


@NgModule({
  declarations: [
    AppComponent,
    HtmlexampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    PdfViewerModule,
    MatInputModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
