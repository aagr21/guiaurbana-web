import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { LinesComponent } from './lines/lines.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatTabsModule, MatIcon, LinesComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {}
