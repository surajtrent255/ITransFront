import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FixedAssets } from 'src/app/models/Fixed Assets/FixedAssets';
import { FixedAssetsService } from 'src/app/service/shared/Assets And Expenses/fixed-assets.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-edit-fixed-assets',
  templateUrl: './edit-fixed-assets.component.html',
  styleUrls: ['./edit-fixed-assets.component.css'],
})
export class EditFixedAssetsComponent {
  @Input() FixedAssetsId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);
  asset: FixedAssets = new FixedAssets();

  constructor(
    private AssetService: FixedAssetsService,
    private commonService: CommonService
  ) {}

  ngOnChanges() {
    this.getFixedAssetDetailsBySn(this.FixedAssetsId);
  }

  getFixedAssetDetailsBySn(SN: number) {
    this.AssetService.getFixedAssetsDetailsBySN(SN).subscribe((res) => {
      this.asset = res.data;
      let date = this.commonService.formatDate(Number(this.asset.date));
      this.asset.date = date;
    });
  }

  fixedAssetEdit() {
    this.AssetService.updateFixedAssetsDetails(this.asset).subscribe({
      next: () => {
        this.updatedSuccessful.emit(true);
      },
    });
  }
}
