$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },
        translateButtonClick: function () {
            var imgName = $(elements.imgName).val()
            if (imgName !== "") {
                $.post("/ottomanocr", {imgname: imgName, coords: ""}).done(function (result) {

                    if (result.success) {
                        toastr.success("Çeviri işlemi gerçekleşmiştir!")
                        $("#turkish").val(result.ottotext)
                    } else {
                        // window.showErrorMessage("Hata Oluştu!");
                    }
                });
            }
        },

        deleteButtonClick: function () {
            var imageId = $(this).data('id');
            $.post("/delete", {imageId: imageId}).done(function (result) {
                console.log(result)
                if (result.success) {
                    toastr.info("Resminiz silinmiştir!")
                } else {
                    toastr.error("Hata Oluştu!");
                }
            });

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
        btnTranslate: "#btnTranslate",
        imgName: "#imageName",
        btnDelete: ".btn-delete"
    };

    var eventMetaData = [
        {selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {}},
        {
            selector: elements.btnTranslate,
            container: document,
            event: "click",
            handler: handlers.translateButtonClick,
            data: {}
        },
        {
            selector: elements.btnDelete,
            container: document,
            event: "click",
            handler: handlers.deleteButtonClick,
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