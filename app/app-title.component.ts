import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-title',
  template: ''
})
export class AppTitleComponent { 
    @Input() gameName = '';
    title = "ElectronChat";
}

