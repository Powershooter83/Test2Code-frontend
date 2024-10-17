import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemingService {

    private darkmode = false;

    constructor() {
        const storedDarkmode = localStorage.getItem('darkmode');
        if (storedDarkmode !== null) {
            this.darkmode = storedDarkmode === 'true';
        }
    }

    isDarkmode(): boolean {
        return this.darkmode;
    }

    setDarkmode(isDarkmode: boolean): void {
        this.darkmode = isDarkmode;
        localStorage.setItem('darkmode', String(isDarkmode));
    }
}
