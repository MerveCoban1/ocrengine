
$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },


        saveButtonClick: function () {
            var ottomanTextVal = $("#ottoman").val()
            var imagepk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            window.waitBox(true);
            $.post("save", { ottoman: ottomanTextVal, bookId: bookId, imagepk: imagepk, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false)
                if (result.success) {
                    toastr.success("Değişiklikler kayıt edildi.");
                } else {
                    toastr.error(result.message);
                }
            });
        },

        tranTurkishuttonClick: function () {
            window.waitBox(true);
            $.post("transliterate", { ottoman: $("#ottoman").val(), csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem başarılı bir şekilde tamamlandı.");
                    $("#ottoman").val(result.ottoman);
                    $(elements.recordInput).val(result.recordid);
                    $("#translate-save-button").show();
                    var rawturkish = ""
                    $.each(result.turkish, function (index, value) {

                        // console.log(Object.keys(value).length);
                        for (let i = 0; i < Object.keys(value).length; i++) {
                            const element = value[i];

                            var is_exist = element.includes(",");
                            if (is_exist) {
                                rawturkish = rawturkish + '<select class="optWords"  name="words-select">'
                                $.each(element.split(","), function (i, val) {
                                    rawturkish = rawturkish + "<option value=" + i + ">" + val + "</option>"
                                })
                                rawturkish = rawturkish + '</select>'
                            } else {
                                rawturkish = rawturkish + "<span class='ottoman-word'>" + element + " </span>"
                            }
                            rawturkish = " " + rawturkish
                        }
                        rawturkish = rawturkish + "<br />"
                    })

                    $("#turkish_sentences").html(rawturkish);
                    // $("#turkish_deep").val(result.truthosm);
                }
                else {
                    toastr.error("Hata Oluştu!");
                }
            });
        },

        turkishSaveTextButtonClick: function (e) {
            var turkish = $("#turkish_dict").html();
            var data = {
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                turkish: turkish,
            }

            window.waitBox(true);
            $.post("saveturkishtext", data).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem Başarılı.")

                } else {
                    toastr.error(result.message ? result.message : "Hata Oluştu.");
                }
            });
        },

        translateSaveButtonClick: function (e) {
            var turkish = $("#turkish_sentences").html();
            var data = {
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                turkish: turkish,
                ottoman: $(elements.ottomanInput).val(),
                pk: $(elements.recordInput).val()
            }

            window.waitBox(true);
            $.post("trans_save", data).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem Başarılı.")

                } else {
                    toastr.error(result.message ? result.message : "Hata Oluştu.");
                }
            });
        },
        wordOptionsChangeClick: function () {

            $('option', this).removeAttr('selected');
            var currentVal = $(this).val();
            $("option[value='" + currentVal + "']", this).attr("selected", "selected");

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
        btnTranslate: "#btnTranslate",
        btnTranTurkish: "#btnTranTurkish",
        imgName: "#imageName",
        btnSave: "#btnSave",
        btnPrev: ".btnPrev",
        btnSuff: ".btnSuff",
        btnCompare: "#btnCompare",
        btnLineByLine: "#btnLineByLine",
        btnGoPage: ".btnGoPage",
        btnAddTrainData: "#btnAddTrainData",
        btnSaveImageLine: "#btnSaveImageLine",
        imageLineLength: 0,
        spanOttomanWord: ".ottoman-word",
        btnFindOttomanWord: "#findOttomanWord",
        btnSaveWord: "#btnSaveWord",
        tabpanelclick: ".tabpanelclick",
        image_pk: ".image_pk",
        btnTurkishSaveText: "#btnTurkishSaveText",
        btnTranlateSave: "#btnTranlateSave",
        ottomanInput: "#ottoman",
        recordInput: "#record_id",
        optWords: ".optWords"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.btnTranslate, container: document, event: "click", handler: handlers.translateButtonClick, data: {} },
        { selector: elements.btnTranTurkish, container: document, event: "click", handler: handlers.tranTurkishuttonClick, data: {} },
        { selector: elements.btnSave, container: document, event: "click", handler: handlers.saveButtonClick, data: {} },
        { selector: elements.btnTurkishSaveText, container: document, event: "click", handler: handlers.turkishSaveTextButtonClick, data: {} },
        { selector: elements.btnTranlateSave, container: document, event: "click", handler: handlers.translateSaveButtonClick, data: {} },
        { selector: elements.optWords, container: document, event: "change", handler: handlers.wordOptionsChangeClick, data: {} },

    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});