
$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },
        changeBookItemHandlers: function () {
            var bookid = $(elements.selectBookItem).val();
            $("#fileupload").data("bookid", bookid);
        },
        ocrButtonClick: function () {
            var bookid = $(elements.selectBookItem).val();
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Eser Seçiniz!");
                $(elements.selectBookItem).focus();
                return;
            }
            var ocrtype = $(elements.select_ocr_type).val();
            var start_page = $(elements.start_number).val();
            toastr.info("Bu işlem yaklaşık 10 dk süre bilir!");

            var data = {
                start_page: start_page,
                ocrtype: ocrtype,
                bookid: bookid,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }

            $.post("/user/bulkocr/", data).done(function (result) {
                if (result.success) {
                    toastr.info("Bu işlem yaklaşık 10 dk süre bilir!");
                } else {
                    toastr.error(result.message);
                }
            });
        }

    };

    var elements = {
        messages: {
            // operationFail: window.getMessage("res-operation-fail"),
            // warning: window.getMessage("res-warning"),
            // pleaseWait: window.getMessage("res-please-wait"),
            // deleteConfirm: window.getMessage("res-delete-confirm"),
            // clearBasketComfirm: window.getMessage("res-clearbasket-confirm"),
            // basketSubmitComfirm: window.getMessage("res-basketsubmit-confirm"),
            // success: window.getMessage("res-success"),
            // removebasketitem: window.getMessage("res-removebasketitem"),
            // errormsg: window.getMessage("res_errormsg"),
            // pleaseinputemptyfield: window.getMessage("res-pleaseinputemptyfield")
        },
        selectBookItem: "#id_BookId",
        btnTesseractOcr: ".btn-tesseract-ocr",
        start_number: "#start_number",
        select_ocr_type: "#select_ocr_type"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.selectBookItem, container: document, event: "change", handler: handlers.changeBookItemHandlers, data: {} },
        { selector: elements.btnTesseractOcr, container: document, event: "click", handler: handlers.ocrButtonClick, data: {} },
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});