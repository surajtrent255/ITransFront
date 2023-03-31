// $(function () {
//   $("#registerButton").click((event) => {
//     alert("clicked");
//   });
// });

// $(function () {
//   $(".tableOptionWrapper ul li").draggable({
//     appendTo: "body",
//     helper: "clone",
//     zIndex: 20,
//   });
//   var validationError = false;
//   $(".paneSelectionTable tr td.panes").droppable({
//     accept: ".tableOptionWrapper ul li",
//     drop: function (event, ui) {
//       // $(this).removeClass('panes');
//       var tableID = ui.draggable.attr("table");
//       $(this)
//         .parents(".paneSelectionTable")
//         .children()
//         .find(".panes")
//         .each(function () {
//           if ($(this).attr("tableId") == "") {
//             //alert($(this).text());
//             validationError = true;
//             return false;
//           } else {
//             validationError = false;
//           }
//         });
//       $(this).text(ui.draggable.text());
//       $(this).attr("tableId", ui.draggable.attr("table"));
//       $(this).removeClass("adjustmentRecordTable");
//       $(this).removeClass("productsRecordTable");
//       $(this).removeClass("customerRecordTable");
//       $(this).addClass(tableID);
//       if (
//         $(".paneSelectionTable:visible .panes.adjustmentRecordTable").length ==
//           1 &&
//         $(".paneSelectionTable:visible .panes.productsRecordTable").length ==
//           1 &&
//         $(".paneSelectionTable:visible .panes.customerRecordTable").length == 1
//       ) {
//         validationError = false;
//       } else {
//         validationError = true;
//       }
//       if (validationError == true) {
//         $(".panesSelectionWarning").show();
//       } else {
//         $(".panesSelectionWarning").hide();
//       }
//     },
//   });

//   $("#saveSelectedPanesButton").live("click", function () {
//     if (validationError == true) {
//       alert("Please select the panes appropriately");
//       return false;
//     }
//     var paneFirstId = $(".paneSelectionTable:visible tr td.selectedPane1").attr(
//       "tableId"
//     );
//     // alert(paneFirstId);
//     var paneSecondId = $(
//       ".paneSelectionTable:visible tr td.selectedPane2"
//     ).attr("tableId");
//     //alert(paneSecondId);
//     var paneThirdId = $(".paneSelectionTable:visible tr td.selectedPane3").attr(
//       "tableId"
//     );
//     //alert(paneThirdId);

//     if ($(".paneSelectionTable:visible").hasClass("tabbedComponent")) {
//       $(".tabbed-layout-links li").removeClass("pane-1-link");
//       $(".tabbed-layout-links li").removeClass("pane-2-link");
//       $(".tabbed-layout-links li").removeClass("pane-3-link");
//       $(".tabbed-layout-links li.active").removeClass("active");
//       $(".tabbed-layout-links li#link-" + paneFirstId).addClass("pane-1-link");
//       $(".tabbed-layout-links li#link-" + paneSecondId).addClass("pane-2-link");
//       $(".tabbed-layout-links li#link-" + paneThirdId).addClass("pane-3-link");
//       $(".tabbed-layout-links li.pane-1-link").addClass("active");

//       $(".tabbed-layout-links li.pane-1-link").after(
//         $(".tabbed-layout-links li.pane-2-link")
//       );
//       $(".tabbed-layout-links li.pane-2-link").after(
//         $(".tabbed-layout-links li.pane-3-link")
//       );
//     } else {
//       $(
//         ".contentRecordsTableContainer.master-data-table-container .recordTableWrapper.pane-1"
//       ).show();
//       $(
//         ".contentRecordsTableContainer.master-data-table-container .recordTableWrapper.pane-2"
//       ).show();
//       $(
//         ".contentRecordsTableContainer.master-data-table-container .recordTableWrapper.pane-3"
//       ).show();
//     }

//     $(".contentRecordsTableContainer .recordTableWrapper").removeClass(
//       "pane-1"
//     );
//     $(".contentRecordsTableContainer .recordTableWrapper").removeClass(
//       "pane-2"
//     );
//     $(".contentRecordsTableContainer .recordTableWrapper").removeClass(
//       "pane-3"
//     );

//     $("#" + paneFirstId).addClass("pane-1");
//     $("#" + paneSecondId).addClass("pane-2");
//     $("#" + paneThirdId).addClass("pane-3");

//     $(".recordTableWrapper.pane-1").after($(".recordTableWrapper.pane-2"));
//     $(".recordTableWrapper.pane-2").after($(".recordTableWrapper.pane-3"));

//     $(".pageOverlay").fadeOut("fast");
//     $(".popupWrapper").fadeOut("fast");
//     addLayoutConfiguration(
//       paneFirstId + "," + paneSecondId + "," + paneThirdId,
//       "LAYOUT_PANE_POSITION_1,LAYOUT_PANE_POSITION_2,LAYOUT_PANE_POSITION_3"
//     );
//     return false;
//   });
// });

// $(function () {
//   $(".newReportQueryLink").live("click", function () {
//     $("#newReportQueryPopup").fadeIn("fast");
//     return false;
//   });
// });

// /*---- Date Picker input ---- */
// $(".datepickerInput").datepicker({
//   dateFormat: "mm/dd/yy",
//   showOn: "button",
//   buttonImage: "resources/images/calendar-bg.png",
//   buttonImageOnly: true,
// });
// dragNDrop();

// $(function () {
//   $("#custPartName").blur(function () {
//     $("#masterPartName").val($("#custPartName").val());
//   });
// });

// $(".datepickerInput").datepicker({
//   dateFormat: "mm/dd/yy",
//   showOn: "button",
//   buttonImage: "resources/images/calendar-bg.png",
//   buttonImageOnly: true,
// });

// $(function () {
//   /*---- Date Picker input ---- */

//   $(".datepickerInput").datepicker({
//     dateFormat: "mm/dd/yy",
//     showOn: "button",
//     buttonImage: "resources/images/calendar-bg.png",
//     buttonImageOnly: true,
//   });
//   $(".calculatorBrowseButton").live("click", function (event) {
//     event.preventDefault();
//     $(".calculatorBrowse").trigger("click");
//     return false;
//   });
//   $(".textEditorBrowseButton").live("click", function (event) {
//     event.preventDefault();
//     $(".textEditorBrowse").trigger("click");
//     return false;
//   });

//   $(".textEditorBrowse").live("change", function () {
//     $(".textEditorInput").val($(this).val());
//   });
//   $(".calculatorBrowse").live("change", function () {
//     $(".calculatorInput").val($(this).val());
//   });
// });
