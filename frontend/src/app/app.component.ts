import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AppConfigService } from './services/app-config.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AppConfig, AppResponsiveStyles, User } from '@shared/models';
import { SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 1 }),
                animate(AppComponent.LOGIN_FADE_TIME, style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AppComponent implements OnInit {
    public static readonly LOGIN_FADE_TIME = 1250;

    public authenticatingUser: User;
    public authenticationFailureMessage;

    public appConfig: AppConfig;
    public isAppConfigFetched: boolean;
    public isSmallScreen: boolean;
    public isAuthenticated: boolean;

    constructor(
        public readonly authService: AuthService,
        private readonly appConfigService: AppConfigService,
        private readonly breakpointObserver: BreakpointObserver
    ) {
        this.isAuthenticated = null;
        this.isAppConfigFetched = false;
        this.authenticatingUser = new User(null, null);
        this.authenticationFailureMessage = null;
        this.appConfigService.get().then((appConfig: AppConfig) => {
            this.appConfig = appConfig;
            this.isAppConfigFetched = true;
        });
    }

    public ngOnInit(): void {
        // Listen for media screen changes
        this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small])
            .subscribe((state: BreakpointState) => {
                this.isSmallScreen = state.matches;
            });

        // Check if user is already authenticated
        this.authService.isAlreadyAuthenticated().then((isAuthenticated: boolean) => {
            this.isAuthenticated = isAuthenticated;
            if (this.isAuthenticated) {
                this.authService.redirectOnUrl();
            }
        });
    }

    public getStyle(screenStyles: AppResponsiveStyles): Partial<CSSStyleDeclaration> {
        let styleDeclaration: Partial<CSSStyleDeclaration> = {};

        if (screenStyles) {
            if (screenStyles.defaultScreenStyle) {
                styleDeclaration = Object.assign(styleDeclaration, screenStyles.defaultScreenStyle);
            }

            if (this.isSmallScreen && screenStyles.smallScreenStyle) {
                // Has style for small screens
                styleDeclaration = Object.assign(styleDeclaration, screenStyles.smallScreenStyle);
            } else if (!this.isSmallScreen && screenStyles.largeScreenStyle) {
                // Has style for large screens
                styleDeclaration = Object.assign(styleDeclaration, screenStyles.largeScreenStyle);
            }
        }

        return styleDeclaration;
    }

    public onSubmit(username: string, password: string): void {
        this.authService
            .authenticate(username, password)
            .then(() => {
                this.isAuthenticated = true;
            })
            .catch(status => {
                this.authenticationFailureMessage = status.message;
            });
    }

    public sanitize(htmlText: string): SafeHtml {
        return this.appConfigService.sanitize(htmlText);
    }

    public onFadeDone($event: any): void {
        if (this.isAppConfigFetched) {
            $event.element.remove();
        }
    }

    public onLogout(): void {
        this.authService.logout();
    }
}
