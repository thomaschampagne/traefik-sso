export abstract class LogTransport {
    public abstract readonly appendAsync: boolean;

    public abstract append(args: [any?, ...any[]], callback?: () => void): void;

    public abstract appendSync(args: [any?, ...any[]]): void;
}
