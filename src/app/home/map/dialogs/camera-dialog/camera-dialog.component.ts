import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-camera-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './camera-dialog.component.html',
  styleUrl: './camera-dialog.component.scss',
})
export class CameraDialogComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  seconds = 30;

  ngOnInit(): void {
    setInterval(() => {
      this.seconds = this.seconds - 1;
    }, 1000);
  }
}
