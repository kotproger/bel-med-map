import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
// import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
// import { MatListModule } from '@angular/material/list';
// import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        MatTooltipModule,
        MatIconModule,
        MatTabsModule,
        // MatBadgeModule,
        MatDividerModule,
        // MatListModule,
        // MatExpansionModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule { }
