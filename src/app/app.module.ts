import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { HttpClientModule,HttpClient } from "@angular/common/http"
import { SortablejsModule } from 'angular-sortablejs';

import { HttpService } from '../common/http.server'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
