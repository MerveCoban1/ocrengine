
$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },

        bookListChangeHandlers: function () {
            var bookid = $(elements.selectBookList).val()
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Metin girişi yapınız !");
                return;
            }

            var value = {
                bookid: bookid,
            };
            $("#gallery > tbody > tr").remove();
            // window.waitBox(true);
            $.ajax({
                url: "get_train_images",
                type: "get", // or "get"
                data: value,
                dataType: "json",
                success: function (result) {
                    // window.waitBox(false);
                    if (result.success) {
                        toastr.success("İşlem tamamlandı.");
                        $.each(result.imagelist, function (index, value) {
                            $('#gallery > tbody').append('<tr><td>' + (index + 1) + '</td><td>' + value.bookname + '</td><td>' + value.page_number + '</td><td><a target="_blank" href=' + value.imageurl + '><i class="fa fa-eye" aria-hidden="true"></i></a>&nbsp;&nbsp;<a class="btn btn-danger remove_page" style="color:#fff" data-pagenumber=' + value.page_number + '><i class="fas fa-trash-alt"></i></a></td></tr>');

                        });

                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        },

        preparePageButtonClick: function (e) {
            var bookid = $(elements.selectBookList).val()
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Eser seçiniz !");
                return;
            }
            window.waitBox(true);
            $.post("prepare_train_file", { bookid: bookid, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success(result.message);
                } else {
                    toastr.error(result.message);
                }
            });
        },

        downloadButtonClick: function (e) {
            var bookid = $(elements.selectBookList).val()
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Eser seçiniz !");
                return;
            }
            window.location = '/user/download_train_file?bookid=' + bookid;
        },

        removeButtonClick: function (e) {

            var bookid = $(elements.selectBookList).val()
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Eser seçiniz !");
                return;
            }

            //TODO
            $.post("remove_train_file", { bookid: bookid, page_number: null, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success(result.message);
                    window.location.reload();
                } else {
                    toastr.error(result.message);
                }
            });
        },

        removeSinglePageButtonClick: function (e) {
            var bookid = $(elements.selectBookList).val()
            if (bookid === null || bookid === "" || bookid === undefined) {
                toastr.error("Lütfen Eser seçiniz !");
                return;
            }


            var pagenumber = $(this).data("pagenumber");
            if (pagenumber === null || pagenumber === "" || pagenumber === undefined) {
                toastr.error("Hata Oluştu !");
                return;
            }

            $.post("remove_train_file", { bookid: bookid, page_number: pagenumber, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success(result.message);
                    window.location.reload();
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
        selectBookList: "#booklist",
        btnPreparePage: "#btnPreparePage",
        btnDownload: "#btnDownload",
        btnRemove: "#btnRemove",
        btnRemoveSinglePage: ".remove_page"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.selectBookList, container: document, event: "change", handler: handlers.bookListChangeHandlers, data: {} },
        { selector: elements.btnPreparePage, container: document, event: "click", handler: handlers.preparePageButtonClick, data: {} },
        { selector: elements.btnDownload, container: document, event: "click", handler: handlers.downloadButtonClick, data: {} },
        { selector: elements.btnRemove, container: document, event: "click", handler: handlers.removeButtonClick, data: {} },
        { selector: elements.btnRemoveSinglePage, container: document, event: "click", handler: handlers.removeSinglePageButtonClick, data: {} }

    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});