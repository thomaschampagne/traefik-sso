import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppConfigService } from './services/app-config.service';
import { IconsModule } from './icons/icons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerService } from './services/logger/logger.service';
import { ConsoleLoggerService } from './services/logger/console-logger.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        IconsModule
    ],
    providers: [
        { provide: LoggerService, useClass: ConsoleLoggerService },
        AppConfigService,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
