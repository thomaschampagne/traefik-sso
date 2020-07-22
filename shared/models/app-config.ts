import { AppLabels } from './app-labels';
import { AppStyles } from './app-styles';

export interface AppConfig {
    labels?: AppLabels;
    styles?: AppStyles;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
    labels: {
        welcomeTitle:
            'Please login to this domain<br/><i style="font-size: 16px; color: dodgerblue;">(You can change all texts and styles from the "config.json" file)</i>',
        authenticatedText:
            'You\'re authenticated.<br/>Apps in the current domain protected by this sso are now reachable.<br/><br/><i style="font-size: 16px; color: dodgerblue;">(You can change all texts and styles from the "config.json" file)</i>',
        loginButtonText: 'Login',
        logoutButtonText: 'Logout',
        placeholders: {
            username: 'Username',
            password: 'Password'
        },
        errors: {
            unauthorized: 'Not authorized',
            badRequest: 'Invalid username or password provided',
            serverError: 'Server encountered an issue'
        }
    },
    styles: {
        body: {
            defaultScreenStyle: {
                backgroundColor: '#d9d9d9'
            },
            largeScreenStyle: {},
            smallScreenStyle: {}
        },
        welcomeTitle: {
            defaultScreenStyle: {
                textAlign: 'center',
                fontSize: '26px'
            },
            largeScreenStyle: {
                paddingBottom: '50px'
            },
            smallScreenStyle: {
                paddingBottom: '50px'
            }
        },
        form: {
            defaultScreenStyle: {
                backgroundColor: 'white'
            },
            largeScreenStyle: {
                width: '500px',
                paddingTop: '60px',
                paddingBottom: '60px',
                webkitBoxShadow: '0px 0px 48px -20px rgba(0, 0, 0, 1)',
                boxShadow: '0px 0px 48px -20px rgba(0, 0, 0, 1)'
            },
            smallScreenStyle: {
                height: '100%',
                width: '100%'
            }
        },
        loginButton: {
            defaultScreenStyle: {
                marginBottom: '25px'
            }
        },
        logoutButton: {},
        authSuccess: {
            defaultScreenStyle: {
                backgroundColor: 'red',
                textAlign: 'center',
                padding: '40px',
                fontSize: '22px'
            },
            largeScreenStyle: {
                width: '400px',
                paddingTop: '100px',
                paddingBottom: '100px',
                webkitBoxShadow: '0px 0px 48px -20px rgba(0, 0, 0, 1)',
                boxShadow: '0px 0px 48px -20px rgba(0, 0, 0, 1)'
            },
            smallScreenStyle: {
                height: '100%',
                width: '100%'
            }
        },
        authFailure: {
            defaultScreenStyle: {
                color: 'crimson',
                height: '20px'
            },
            smallScreenStyle: {
                fontSize: '22px'
            }
        }
    }
};
