$(function ($) {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },
        ocrButtonClick: function () {
            const imageid = $("#imageid").val();
            const version = $("#versionId").val();
            const is_crop_image = $("#imageid").data("iscrop");

            if (imageid === null || imageid === "" || imageid === undefined) {
                toastr.error("Resim yüklenmesinde hata oluştu!")
                return;
            }

            if (is_crop_image) {
                handlers.cropAndOcrImageOKButtonClick(imageid);
            } else {
                window.waitBox(true);

                $.post('ocr', {
                    imageid: imageid,
                    coords: "",
                    version: version,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                }).done(function (result) {
                    window.waitBox(false);
                    if (result.success) {
                        toastr.success(result.message ? result.message : "İşlem başarılı bir şekilde tamamlandı.");
                        $("textarea#txtResult").val(result.text);                                           

                    } else {
                        toastr.error(result.message);
                    }
                });
            }

        },

    };

    var elements = {
        btnOCR: "#btnOCR",
        imgName: "#imageName",
        btnSave: "#btnSave",
        imageid: "#imageid",
    };

    var eventMetaData = [
        {selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {}},
        {
            selector: elements.btnOCR,
            container: document,
            event: "click",
            handler: handlers.ocrButtonClick,
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