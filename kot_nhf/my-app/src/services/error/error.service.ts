import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(public snackBar: MatSnackBar) { }
    showError(message: string): void {
      // The second parameter is the text in the button. 
      // In the third, we send in the css class for the snack bar.
      this.snackBar.open(message, 'X', {panelClass: ['error']});
    }
}
