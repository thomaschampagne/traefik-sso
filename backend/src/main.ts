import 'reflect-metadata';
import { Banner } from './banner';
import { container } from 'tsyringe';
import { Server } from './server';

(() => {
    Banner.print();
    container.resolve(Server).start(); // Start server
})();
