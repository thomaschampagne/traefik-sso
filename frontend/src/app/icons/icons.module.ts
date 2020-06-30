import { NgModule } from '@angular/core';
import { Key, Person } from 'ng-bootstrap-icons/icons';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';

const icons = {
    Person,
    Key
};

@NgModule({
    imports: [BootstrapIconsModule.pick(icons)],
    exports: [BootstrapIconsModule]
})
export class IconsModule {}
