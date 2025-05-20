import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-modifie-prices-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modifie-prices-dialog.component.html',
  styleUrls: ['./modifie-prices-dialog.component.scss']
})
export class ModifiePricesDialogComponent {



  saveChanges(): void {

  }

  resetPrices(): void {

  }

  cancelChanges(): void {

  }

  closeDialog(): void {
  }


}
