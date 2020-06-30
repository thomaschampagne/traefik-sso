import versions from './versions.json';

const asciiBanner = `
  _______              __ _ _       _____ _____  ____
 |__   __|            / _(_) |     / ____/ ____|/ __ \\
    | |_ __ __ _  ___| |_ _| | __ | (___| (___ | |  | |
    | | '__/ _\` |/ _ \\  _| | |/ /  \\___ \\\\___ \\| |  | |
    | | | | (_| |  __/ | | |   <   ____) |___) | |__| |
    |_|_|  \\__,_|\\___|_| |_|_|\\_\\ |_____/_____/ \\____/  Version ${versions.app}
`;

export class Banner {
    public static print(): void {
        console.log(asciiBanner);
    }
}
