$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },


        translationTurkishButtonClick: function () {
            const ottoman = $("#ottoman").val();

            if (ottoman == null || ottoman == undefined || ottoman === "") {
                toastr.error("Osmanlıca boş olamaz!");
                return;
            }
            window.waitBox(true);
            $.post("translate", {
                ottoman: ottoman,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem başarılı bir şekilde tamamlandı.");
                    $("#turkish_sentences").val(result.turkish);
                    //$("#turkish_sentences").html(result.turkish);
                } else {
                    toastr.error(result.message ?? "Hata Oluştu!");
                }
            });
        },


    };

    var elements = {
        messages: {
            // errormsg: window.getMessage("res_errormsg"),
        },
        btnTranslationTurkish: "#btnTranslationTurkish"
    };

    var eventMetaData = [
        {selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {}},
        {
            selector: elements.btnTranslationTurkish,
            container: document,
            event: "click",
            handler: handlers.translationTurkishButtonClick,
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