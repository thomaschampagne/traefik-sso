import fs from 'fs';
import path from 'path';
import { Request } from 'express';

export class Utils {
    public static readFileAsync(filePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(
                filePath,
                { encoding: 'utf-8' },
                (err: NodeJS.ErrnoException | null, data: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
            );
        });
    }

    public static readFile(filePath: string): string {
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    }

    public static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    public static mkdir(dirPath: string): string {
        return fs.mkdirSync(dirPath, { recursive: true });
    }

    public static normalizePath(filePath: string): string {
        return path.normalize(filePath);
    }

    public static dirname(filePath: string): string {
        return path.dirname(filePath);
    }

    public static getSourceIp(req: Request): string {
        return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
            .toString()
            .split(',')[0]
            .trim();
    }
}
