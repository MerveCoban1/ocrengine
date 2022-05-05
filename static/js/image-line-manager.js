$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },
        verifyButtonClick: function () {
            var imgurl = $(this).data("imgurl");
            var ocrtext = $(this).data("ocrtext");
            var inputText = $("#" + ocrtext).val();
            var bookid = $("#bookid").val();
            var imageid = $("#imageid").val();

            var data = {
                imgurl: imgurl,
                ocrText: inputText,
                bookid: bookid,
                imageid: imageid,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }

            handlers.postForm("addimageline", data);
        },

        postForm: function (url, data) {
            window.waitBox(true);
            $.post("addimageline", data).done(function (result) {
                window.waitBox(false)
                if (result.success) {
                    toastr.success("Değişiklikler kayıt edildi.");
                } else {
                    toastr.error(result.message);
                }
            });
        },
    }
    var elements = {
        messages: {

        },
        btnVerify: ".verify"

    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.btnVerify, container: document, event: "click", handler: handlers.verifyButtonClick, data: {} }

    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});