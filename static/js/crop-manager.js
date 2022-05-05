$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },

        cropAndOcrImageButtonClick: function (event) {

            const is_active = $(this).data("active");
            if (is_active) {
                $("#imageid").data("iscrop", true);
                $('#target').cropper();
                $(this).data("active", false);
                $(this).html("Kaldır");
            } else {
                $("#imageid").data("iscrop", false);
                $('#target').cropper("destroy");
                $(this).data("active", true);
                $(this).html("Kes");
            }

        },
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
        btnCropAndOcrImage: "#btnCropAndOcrImage",
        btnCropAndOcrImageOK: "#btnCropAndOcrImageOK"

    };

    var eventMetaData = [
        {selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {}},
        {
            selector: elements.btnCropAndOcrImage,
            container: document,
            event: "click",
            handler: handlers.cropAndOcrImageButtonClick,
            data: {}
        },
        {
            selector: elements.btnCropAndOcrImageOK,
            container: document,
            event: "click",
            handler: handlers.cropAndOcrImageOKButtonClick,
            data: {}
        },
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});