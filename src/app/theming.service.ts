import {inject, Injectable} from '@angular/core';
import {HighlightLoader} from "ngx-highlightjs";

@Injectable({
    providedIn: 'root'
})
export class ThemingService {

    private darkmode = false;
    private hljsLoader: HighlightLoader = inject(HighlightLoader);

    constructor() {
        const storedDarkmode = localStorage.getItem('darkmode');
        if (storedDarkmode !== null) {
            this.darkmode = storedDarkmode === 'true';
        }
        this.hljsLoader.setTheme(this.darkmode ? 'assets/themes/dark.css' : 'assets/themes/light.css');
    }

    isDarkmode(): boolean {
        return this.darkmode;
    }

    setDarkmode(isDarkmode: boolean): void {
        this.darkmode = isDarkmode;
        this.hljsLoader.setTheme(this.darkmode ? 'assets/themes/dark.css' : 'assets/themes/light.css');
        localStorage.setItem('darkmode', String(isDarkmode));
    }
}
