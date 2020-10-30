import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatIconModule
    ]
})
export class MaterialModule { }
