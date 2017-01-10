import { Component } from '@angular/core';


@Component({
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent { 
    gameName = 'Hearthstone: Heroes of Warcraft'
}