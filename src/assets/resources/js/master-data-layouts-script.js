$(function(){

	$('#chooseLayoutLink').live('click',function(){
		$('html, body').animate({scrollTop:0}, 'slow');
		$('.pageOverlay').fadeIn('fast');
		$('#chooseLayoutOptionsPopup').fadeIn('fast');
		return false;
	})

	$('#saveSelectedLayoutButton').live('click',function(){
		selectedLayoutId = $('.masterlayoutOptionTable input[type="radio"]:checked').attr('id');
		$('.contentRecordsTableContainer').removeClass('horizontal-stack-layout-container');
		$('.contentRecordsTableContainer').removeClass('mixed-layout-A-container');
		$('.contentRecordsTableContainer').removeClass('vertical-stack-layout-container');
		$('.contentRecordsTableContainer').removeClass('mixed-layout-B-container');
		$('.contentRecordsTableContainer').removeClass('tabbed-layout-container');
		$('.layout-pane-selection .changeable').hide();
		var layoutClass='';
		switch(selectedLayoutId){
			case 'horizontally-stacked-option':
				//$('.contentRecordsTableContainer').attr('id','horizontal-stack-layout-container');
				$('.recordsWrapper .contentRecordsTableContainer').addClass('horizontal-stack-layout-container', 500)
				$('.layout-pane-selection .horizontalComponent').show();
				setPaneName('.horizontalComponent');
				layoutClass='horizontal-stack-layout-container';
				break;
			case 'mixed-layout-A-option':
				// $('.contentRecordsTableContainer').attr('id','mixed-layout-A-container');
				$('.recordsWrapper .contentRecordsTableContainer').addClass('mixed-layout-A-container', 500);
				$('.layout-pane-selection .mixedTypeAComponent').show();
				setPaneName('.mixedTypeAComponent');
				layoutClass='mixed-layout-A-container';
				break;
			case 'vertically-stacked-option':
				// $('.contentRecordsTableContainer').attr('id','vertical-stack-layout-container');
				$('.recordsWrapper .contentRecordsTableContainer').addClass('vertical-stack-layout-container', 500);
				$('.layout-pane-selection .verticalComponent').show();
				setPaneName('.verticalComponent');
				layoutClass='vertical-stack-layout-container';
				break;
			case 'mixed-layout-B-option':
				// $('.contentRecordsTableContainer').attr('id','mixed-layout-A-container');
				$('.recordsWrapper .contentRecordsTableContainer').addClass('mixed-layout-B-container', 500);
				$('.layout-pane-selection .mixedTypeBComponent').show();
				setPaneName('.mixedTypeBComponent');
				layoutClass='mixed-layout-B-container';
				break;
			case 'tabbed-layout-option':
				// $('.contentRecordsTableContainer').attr('id','tabbed-layout-container');
				$('.recordsWrapper .contentRecordsTableContainer').addClass('tabbed-layout-container', 500);
				$('.layout-pane-selection .tabbedComponent').show();
				setPaneName('.tabbedComponent');
				layoutClass='tabbed-layout-container';
				break;
		}
		addLayoutConfiguration(layoutClass,"LAYOUT");
		// $('.pageOverlay').fadeOut('fast');
		$('.popupWrapper').fadeOut('fast');
		$('#paneSelectionPopup').fadeIn('fast');
		return false;
	});

	$('.tabbed-layout-links li').live('click',function(){
		$('.tabbed-layout-links li.active').removeClass('active');
		$('.tabbed-layout-container .recordTableWrapper').hide();
		var tableToShow = $(this).attr('linktable');
		$('.tabbed-layout-container .recordTableWrapper#'+tableToShow).show();
		$(this).addClass('active');
	});
	function setPaneName(selectedLayoutCls){		
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane1').text(getName($('#selectedPane1Name').html()));
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane1').attr('tableid',$('#selectedPane1Name').html().trim());
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane2').text(getName($('#selectedPane2Name').html()));
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane2').attr('tableid',$('#selectedPane2Name').html().trim());
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane3').text(getName($('#selectedPane3Name').html()));		
		$('.layout-pane-selection '+selectedLayoutCls+' tr td.selectedPane3').attr('tableid',$('#selectedPane3Name').html().trim());
	}
	function getName(paneName){		
		if(paneName.trim()=='customerRecordTable'){
			return 'Customer';
		}else if(paneName.trim()=='adjustmentRecordTable'){
			return 'Adjustment';
		}else if(paneName.trim()=='productsRecordTable'){
			return 'Product';
		}		
	}
})