export interface AppLabels {
    welcomeTitle?: string;
    authenticatedText?: string;
    loginButtonText?: string;
    logoutButtonText?: string;
    placeholders?: { username: string; password: string };
    errors?: { unauthorized: string; badRequest: string; serverError: string };
}
