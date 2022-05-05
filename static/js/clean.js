
$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },

        validation: function (attrValue) {
            if (attrValue === null || attrValue === "" || attrValue === undefined) {
                toastr.error("Lütfen Metin girişi yapınız !");
                return false;
            } else {
                return true;
            }
        },

        cleantTextButtonClick: function () {
            var rawtext = $(elements.rawText).val()
            if (rawtext === null || rawtext === "" || rawtext === undefined) {
                toastr.error("Lütfen Metin girişi yapınız !");
                return;
            }

            var value = {
                rawtext: rawtext,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            // window.waitBox(true);
            $.ajax({
                url: "clean",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    // window.waitBox(false);
                    if (result.success) {
                        toastr.success("İşlem tamamlandı.");
                        $("#cleantext").val(result.cleantext);
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        },

        editDictButtonClick: function () {
            var rawDict = $(elements.rawDict).val()
            if (rawDict === null || rawDict === "" || rawDict === undefined) {
                toastr.error("Lütfen Metin girişi yapınız !");
                return;
            }

            var value = {
                rawdict: rawDict,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            // window.waitBox(true);
            $.ajax({
                url: "dictclean",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    // window.waitBox(false);
                    if (result.success) {
                        $(elements.cleanDict).val(result.cleandict);
                        $("#rawCount").val(result.prevcount);
                        $("#cleanCount").val(result.suffcount);
                        $(".dictionaryinfo").show();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        },

        showUnprintableFileButtonClick: function () {
            $.ajax({
                url: "unprintablecharacter",
                type: "get", // or "get"
                // data: value,
                success: function (result) {
                    toastr.success("İşlem başarıyal gerçekleşti.")
                    if (result.success) {
                        $("#filelist").html(result.filenamelist);
                    } else {
                        toastr.error(result.message);
                    }
                }
            });

        },

        findWordFileButtonClick: function () {
            var word = $("#findword").val();
            if (!handlers.validation(word)) {
                return;
            }

            var value = {
                word: word,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            // window.waitBox(true);
            $.ajax({
                url: "findword",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    // window.waitBox(false);
                    if (result.success) {
                        var index = 1;
                        for (i = 0; i < result.filenamelist.length; i++) {
                            var newRowContent = "<tr><td>" + index + "</td><td>" + result.filenamelist[i] + "</td></tr>";
                            $("#filelisttable tbody").append(newRowContent);
                            index++;
                        }
                        $("#filelistforfindword").show();

                    } else {
                        toastr.error(result.message);
                    }
                }
            });

            // $('#filelisttable').DataTable({ TODO add datatable
            //     paging: false,
            //     //searching: false,
            //     sort: false
            // });
        },

        copyButtonClick: function () {
            $(elements.cleanText).select();
            document.execCommand('copy');
        },

        textRTLButtonClick: function () {
            var rawtext = $(elements.rawText).val()
            if (rawtext === null || rawtext === "" || rawtext === undefined) {
                $(elements.rawText).focus();
                toastr.error("Lütfen Metin girişi yapınız !");
                return;
            }

            var value = {
                rawtext: rawtext,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            // window.waitBox(true);
            $.ajax({
                url: "textrtl",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    // window.waitBox(false);
                    if (result.success) {
                        toastr.success("İşlem tamamlandı.");
                        $("#cleantext").val(result.cleantext);
                    } else {
                        toastr.error(result.message);
                    }
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
        btnSuff: ".btnSuff",
        rawText: "#rawtext",
        cleanText: "#cleantext",
        btnClean: "#btnClean",
        rawDict: "#rawdict",
        cleanDict: "#cleandict",
        btnEdit: "#btnEdit",
        btnShowFile: "#btnShowFile",
        btnFind: "#btnFind",
        btnCopy: "#btnCopy",
        btnTextRTL:"#btnTextRTL"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.btnClean, container: document, event: "click", handler: handlers.cleantTextButtonClick, data: {} },
        { selector: elements.btnEdit, container: document, event: "click", handler: handlers.editDictButtonClick, data: {} },
        { selector: elements.btnShowFile, container: document, event: "click", handler: handlers.showUnprintableFileButtonClick, data: {} },
        { selector: elements.btnFind, container: document, event: "click", handler: handlers.findWordFileButtonClick, data: {} },
        { selector: elements.btnCopy, container: document, event: "click", handler: handlers.copyButtonClick, data: {} },
        { selector: elements.btnTextRTL, container: document, event: "click", handler: handlers.textRTLButtonClick, data: {} }
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});