$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {
        },
        translateButtonClick: function () {
            var page_number = $("#imagepk").val();
            var version = $("#versionId").val();
            var bookId = $("#bookId").val();
            var pagemode = $('input[name="pagemode"]:checked').val();
            var data = {
                page_number: page_number,
                book_id: bookId,
                coords: "",
                tessVersion: version,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                pagemode: pagemode
            }

            window.waitBox(true);
            if (page_number !== "") {
                $.post("ottomanocr", data).done(function (result) {
                    window.waitBox(false);
                    if (result.success) {
                        toastr.success("İşlem başarılı bir şekilde tamamlandı.");
                        $("#ottoman").val(result.ottoman)
                        $("#turkish").val(result.turkish);
                        $("#ottoman_orijinal").val(result.truthosm);
                        $("#turkish_orijinal").val(result.truth_tur);
                        $('a[href="#tabs-6"]').click();
                    } else {
                        toastr.error(result.message);
                    }
                });
            }
        },

        saveButtonClick: function () {
            var ottomanTextVal = $("#ottoman").val()
            var imagepk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            window.waitBox(true);
            $.post("save", {
                ottoman: ottomanTextVal,
                bookId: bookId,
                imagepk: imagepk,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }).done(function (result) {
                window.waitBox(false)
                if (result.success) {
                    toastr.success("Değişiklikler kayıt edildi.");
                } else {
                    toastr.error(result.message);
                }
            });
        },


        prevButtonClick: function () {
            var pk = $("#imagepk").val();
            pk = parseInt(pk) - 1;
            var bookId = $("#bookId").val();
            handlers.getPageInfo(pk, bookId);
            // value = {
            //     pk: pk,
            //     bookid: bookId,
            //     csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            // };
            // window.waitBox(true);
            // $.ajax({
            //     url: "image",
            //     type: "post", // or "get"
            //     data: value,
            //     success: function (result) {
            //         window.waitBox(false);
            //         if (result.success) {

            //             $("#imagepk").val(result.page_number);
            //             $("#ottoman").val(result.ottoman);
            //             $("#turkish").val(result.turkish);
            //             $("#ottoman_orijinal").val(result.truthosm);
            //             $("#turkish_orijinal").val(result.truth_tur);
            //             $('img').attr('src', "" + result.image + "");
            //         } else {
            //             toastr.error("Önceki resim bulunmadı!");
            //         }
            //     }
            // });
        },


        goPageButtonClick: function () {
            var pk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            if (pk == undefined || pk == null) {
                toastr.error("Sayfa Numarası bulunamdı!");
                return;
            }
            handlers.getPageInfo(pk, bookId);

        },

        getPageInfo: function (pk, bookid) {
            value = {
                pk: pk,
                bookid: bookid,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            window.waitBox(true);
            $.ajax({
                url: "image",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    window.waitBox(false);
                    if (result.success) {

                        if (result.is_paid) {
                            $("#btnShowAllOttomanText").hide();
                        } else {
                            $("#btnShowAllOttomanText").show();
                        }
                        //$("#imagepk").val(result.page_number);
                        $(".image_pk").val(result.page_number);
                        $("#ottoman").val(result.ottoman);
                        $("#turkish_dict").html(result.turkish);
                        $("#ottoman_orijinal").val(result.truthosm);
                        $("#turkish_orijinal").val(result.truth_tur);
                        $("#turkish_text_with_ottoman").html(result.turkish);
                        $('img').attr('src', "" + result.image + "");
                    } else {
                        toastr.error(result.message ? result.message : "Resim bulunmadı!");
                    }
                }
            });

        },


        suffButtonClick: function () {
            var pk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            pk = parseInt(pk) + 1;
            handlers.getPageInfo(pk, bookId);

            // value = {
            //     pk: pk,
            //     bookid: bookId,
            //     csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            // };
            // window.waitBox(true);
            // $.ajax({
            //     url: "image",
            //     type: "post", // or "get"
            //     data: value,
            //     success: function (result) {
            //         window.waitBox(false);
            //         if (result.success) {
            //             $("#imagepk").val(result.page_number);
            //             $('img').attr('src', "" + result.image + "");
            //             $("#ottoman").val(result.ottoman);
            //             $("#turkish").val(result.turkish);
            //             $("#ottoman_orijinal").val(result.truthosm);
            //             $("#turkish_orijinal").val(result.truth_tur);
            //             callback(result.pk);
            //         } else {
            //             toastr.error("Sonraki Resim bulunamadı!");
            //         }
            //     }
            // });
            // function callback(pk) {
            //     $('#imagepk').val(pk);
            // }
        },

        tranTurkishuttonClick: function () {

            var pk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            value = {
                pk: pk,
                bookid: bookId,
                version: $("#versionId").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            window.waitBox(true);
            $.post("translate", {
                ottoman: $("#ottoman").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem başarılı bir şekilde tamamlandı.");
                    $("#ottoman").val(result.ottoman)

                    var rawturkish = ""
                    $.each(result.turkish, function (index, value) {

                        // console.log(Object.keys(value).length);
                        for (let i = 0; i < Object.keys(value).length; i++) {
                            const element = value[i];

                            var is_exist = element.includes(",");
                            if (is_exist) {
                                rawturkish = rawturkish + '<select class="optWords" name="words-select">'
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

                    $("#turkish_dict").html(rawturkish);
                    $("#turkish_text_with_ottoman").html(rawturkish);
                    $('a[href="#tabs-7"]').click();
                    // $("#turkish_deep").val(result.truthosm);
                } else {
                    toastr.error("Hata Oluştu!");
                }
            });
        },


        drawCharRect: function (text) {
            var sp = ""
            for (i = 0; i <= text.length - 1; i++) {
                var html = text.substr(i, 1);
                sp = sp + "<span style='font-size:18px; font-weight:bold; font-family:hanzala; border:1px solid green; display:inline-block; width:23px;'; class='pwn'>" + html + " </span> &nbsp;";
            }
            return sp;
        },

        drawCharRectWithDict: function (dictValue) {

            var gruSp = ""
            var ocrSp = ""
            var opcSp = ""

            var preGruSp = ""
            var preOcrSp = ""
            var preOpcSp = ""


            $.each(dictValue, function (index, value) {

                gruSp = gruSp + "<span style='font-size:18px; font-weight:bold; font-family:hanzala; border:1px solid " + value.color + "; display:inline-block; width:23px;'; class='pwn'>" + value.gru + " </span>";
                opcSp = opcSp + "<span style='font-size:18px; font-weight:bold; font-family:hanzala; border:1px solid " + value.color + "; display:inline-block; width:23px;'; class='pwn'>" + value.opc + " </span>";
                ocrSp = ocrSp + "<span style='font-size:18px; font-weight:bold; font-family:hanzala; border:1px solid " + value.color + "; display:inline-block; width:23px;'; class='pwn'>" + value.ocr + " </span>";

                preGruSp = preGruSp + "<span style='color:" + value.color + "'>" + value.gru + "</span>";
                preOpcSp = preOpcSp + "<span style='color:" + value.color + "'>" + value.opc + "</span>";
                preOcrSp = preOcrSp + "<span style='color:" + value.color + "'>" + value.ocr + "</span>";

                // $('#comparetable > tbody').append("<tr><td></td><td>" + (index + 1) + ".Satır</td></tr>");
                // $('#comparetable > tbody').append("<tr><td> GROUND TRUTH : </td><<td>" + gruRes + "</td></tr>");
                // $('#comparetable > tbody').append("<tr><td> OP CODE :  </td><td>" + opcRes + "</td></tr>");
                // $('#comparetable > tbody').append("<tr><td> OCR RESULT  :  </td><td>" + ocrRes + "</td></tr>");
                // // <tr><td> OP CODE : </td><td>'" + value.opc + "'</td></tr><tr><td> OCR RESULT : </td><td>'" + value.ocr + "'</td></tr>

            });

            gruLine = "<pre style='font-family:courier,courier new;margin:0px; font-size: 1.6em; text-align: center;'>" + preGruSp + "</pre>";
            opcLine = "<pre style='font-family:courier,courier new;margin:0px; font-size: 1.6em; text-align: center;'>" + preOpcSp + "</pre>";
            ocrLine = "<pre style='font-family:courier,courier new;margin:0px; font-size: 1.6em; text-align: center;'>" + preOcrSp + "</pre>";


            //+ "<tr><td> GRU: </td><<td>" + gruSp + "</td></tr><tr><td> OPC:  </td><td>" + opcSp + "</td></tr><tr><td> OCR:  </td><td>" + ocrSp + "</td></tr>";

            return gruLine + opcLine + ocrLine;

        },


        compareButtonClick: function () {
            var pk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            value = {
                pk: pk,
                bookid: bookId,
                version: $("#versionId").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            $("#compareModal").modal("hide");
            window.waitBox(true);
            $("#comparetable > tbody").empty()
            $.ajax({
                url: "compare",
                type: "post", // or "get"
                data: value,

                success: function (result) {
                    window.waitBox(false);
                    if (result.success) {
                        $("#ottoman").val(result.ottoman);
                        $("#ottoman_orijinal").val(result.truthosm);
                        $("#truthtext").val(result.a);
                        $("#ocrtext").val(result.b);
                        $("#ratio").val(result.ratio);
                        // $('#comparetable > tbody').append("<tr><td>'" + result.lines + "'</td></tr>");

                        var charLines = $.parseJSON(result.charLines);
                        var prelines = "";
                        $.each(charLines, function (index, value) {

                            prelines = prelines + handlers.drawCharRectWithDict(value) + "<div class='divider'></div>";
                            // $('#comparetable > tbody').append("<tr><td></td><td>" + index + ".Satır</td></tr>");

                            // $('#comparetable > tbody').append(handlers.drawCharRectWithDict(value));
                        });


                        $(".comparePreLine").html(prelines);


                        // $.each(result.lines, function (index, value) {
                        //     var gruRes = handlers.drawCharRect(value.gru);
                        //     var opcRes = handlers.drawCharRect(value.opc);
                        //     var ocrRes = handlers.drawCharRect(value.ocr);

                        //     $('#comparetable > tbody').append("<tr><td></td><td>" + (index + 1) + ".Satır</td></tr>");
                        //     $('#comparetable > tbody').append("<tr><td> GROUND TRUTH : </td><<td>" + gruRes + "</td></tr>");
                        //     $('#comparetable > tbody').append("<tr><td> OP CODE :  </td><td>" + opcRes + "</td></tr>");
                        //     $('#comparetable > tbody').append("<tr><td> OCR RESULT  :  </td><td>" + ocrRes + "</td></tr>");
                        //     // <tr><td> OP CODE : </td><td>'" + value.opc + "'</td></tr><tr><td> OCR RESULT : </td><td>'" + value.ocr + "'</td></tr>

                        // });


                    } else {
                        toastr.error("OCR Yapılırken Hata Oluştu...!");
                    }
                }
            });
        },

        lineByLineOcrButtonClick: function (e) {
            e.preventDefault();
            var pk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            var version = $("#versionId").val();
            if (pk == undefined || pk == null) {
                toastr.error("Hata Oluştu");
                return;
            }
            if (bookId == undefined || bookId == null) {
                toastr.error("Hata Oluştu");
                return;
            }
            value = {
                pk: pk,
                bookid: bookId,
                version: version,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            };
            $('#imagelinetable > tbody').empty();
            window.waitBox(true);
            $.ajax({
                url: "imageline",
                type: "post", // or "get"
                data: value,
                success: function (result) {
                    window.waitBox(false);
                    if (result.success) {
                        elements.imageLineLength = result.image_line_list.length;

                        $.each(result.image_line_list, function (index, value) {
                            $('#imagelinetable > tbody').append("<tr><td><img class= 'card-img-bottom img-fluid target' src = '"
                                + value.imgUrl + "' alt = 'Card image cap' ></td></tr><tr><td> <input id='image_" + index + "_line' dir='rtl' style = 'font-family: hanzala; padding: 10px; font-size:2.0em;width:100%; text-align:center;' value='"
                                + value.text + "'></td></tr>");
                        });
                        // $('#lineImageModal').modal('show');
                        // var url = location.href;               //Save down the URL without hash.
                        // location.href = "#lineimage";                 //Go to the target element.
                        // history.replaceState(null, null, url);   //Don't like hashes. Changing it back.
                    } else {
                        toastr.error("Resim satır satır bölünürken hata oluştu!");
                        $("#btnCloseModal").trigger('click');
                    }
                }
            });


            // window.waitBox(true);
            //window.location = '/imageline?bookid=' + bookId + '&pk=' + pk + '&version=' + version; bir sayfaya yönlediriyordu şimdi burada modal gösterilecektir.
        },

        addPageTrainDataButtonClick: function () {
            var imagepk = $("#imagepk").val();
            var bookId = $("#bookId").val();
            window.waitBox(true);
            $.post("addtraindata", {
                bookId: bookId,
                imageid: imagepk,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }).done(function (result) {
                window.waitBox(false)
                if (result.success) {
                    toastr.success("Sayfa eğitim veri seti için kaydedildi.");
                } else {
                    toastr.error(result.message);
                }
            });
        },

        saveImageLineTextButtonClick: function (e) {
            e.preventDefault();
            var inputText = ""
            for (let index = 0; index < elements.imageLineLength; index++) {
                var inputAttr = "#image_" + index + "_line";
                inputText += $(inputAttr).val() + "\n";
            }
            toastr.info("Yapılan değişiklikler kayıt edildi.");
            toastr.info("Lütfen Sayfayı kontrol ediniz.!");
            $("#ottoman").val(inputText);
            $("#btnCloseModal").trigger('click');
        },

        ottomanWordSelectDoubleClick: function () {
            var text = $(this).text();
            $("#find_ottoman_word").val(text);
            $('#myModal').modal('show');
            handlers.findOttomanWordButtonClick();
            // $('#tabs-7').tabs('option', 'active');
            // $("#find_ottoman_word").focus();
            // $.scrollTo("#kelimeduzelt"); //TODO
            // $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
        },

        findOttomanWordButtonClick: function (e) {
            // e.preventDefault();
            var ottoman_word = $("#find_ottoman_word").val();
            var data = {
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                ottoman_word: ottoman_word
            }

            window.waitBox(true);
            $.post("findottomanword", data).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem Başarılı.")
                    $("#edit_ottoman_word").val(result.ottoman);
                    $("#find_result_ottoman_word").val(result.ottoman);
                    $("#edit_turkish_word1").val(result.turkish);

                } else {
                    toastr.error(result.message ? result.message : "Hata Oluştu.");
                }
            });
        },

        saveOttomanWordButtonClick: function () {

            var pos = $('input[name="pos"]:checked').val();
            var roottype = $('input[name="dil"]:checked').val();
            var savetype = $('input[name="cesit"]:checked').val();

            var data = {
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                ottoman: $("#edit_ottoman_word").val(),
                turkish1: $("#edit_turkish_word1").val(),
                turkish2: $("#edit_turkish_word2").val(),
                turkish3: $("#edit_turkish_word3").val(),
                turkish4: $("#edit_turkish_word4").val(),
                pos: pos,// #$("#pos option:selected").val(),
                roottype: roottype, // $("#roottype option:selected").val(),
                savetype: savetype // $("#savetype option:selected").val()

            }

            window.waitBox(true);
            $.post("saveottomanword", data).done(function (result) {
                window.waitBox(false);
                if (result.success) {
                    toastr.success("İşlem Başarılı.")

                } else {
                    toastr.error(result.message ? result.message : "Hata Oluştu.");
                }
            });


        },

        tabPanelButtonClick: function (e) {
            e.preventDefault();
            var tabpanel_id = $(this).data("id");
            var stepsId = $(this).data("steps");

            $("a").removeClass("tabpanel_active");
            for (let index = 1; index <= 4; index++) {
                $("#tabpanel_" + index).hide();
            }

            $("#steps1").removeClass("active");
            $("#steps2").removeClass("active");
            $("#steps3").removeClass("active");
            for (let index = 1; index <= stepsId; index++) {
                $("#steps" + index).addClass("active");
            }
            $("#" + tabpanel_id).show();
            $(this).addClass("tabpanel_active");
        },

        gotoButtonClick: function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                handlers.goPageButtonClick();
            }
        },

        expandTextarea: function () {
            document.getElementById("ottoman").addEventListener('keyup', function () {
                this.style.overflow = 'hidden';
                this.style.height = 0;
                this.style.height = this.scrollHeight + 'px';
            }, false);
        },
        turkishSaveTextButtonClick: function (e) {
            var turkish = $("#turkish_dict").html();
            var imageId = $("#imagepk").val();
            var bookId = $("#bookId").val();
            var data = {
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                turkish: turkish,
                imageId: imageId,
                bookId: bookId
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
        wordOptionsChangeClick: function () {

            $('option', this).removeAttr('selected');
            var currentVal = $(this).val();
            $("option[value='" + currentVal + "']", this).attr("selected", "selected");

        },

        viewImageWithTextButtonClick: function () {
            const is_show = $(this).data("show");
            const ottoman = $("#ottoman").val();
            if (is_show) {
                $(".imagetextview").show();
                $("#ottomanocrtext").hide();
                $("#ottoman_view_with_image").val(ottoman);
                $(this).data("show", false);
                $(this).html("Resmi Gizle");
            } else {
                $(".imagetextview").hide();
                $("#ottomanocrtext").show();
                $("#ottoman_view_with_image").val(ottoman);
                $(this).data("show", true);
                $(this).html("Resmi Göster");
            }
        },
        increaseSizeFontButtonClick: function () {
            const current_size = parseInt($('#ottoman').css('font-size')) + 2;
            if (current_size <= 60) {
                $('#ottoman').css('font-size', current_size);
                $("#ottoman_view_with_image").css('font-size', current_size);
            }
        },
        decreaseSizeFontButtonClick: function () {
            const current_size = parseInt($('#ottoman').css('font-size')) - 2;
            if (current_size => 12) {
                $('#ottoman').css('font-size', current_size);
                $("#ottoman_view_with_image").css('font-size', current_size);
            }
        },
        showOttomanTextButtonClick: function () {
            const is_show = $(this).data("show");
            const ottoman = $("#ottoman").val();
            if (is_show) {
                $(".ottoman_and_turkishtext").show();
                $("#turkish_content").hide();
                $("#ottoman_view_with_turkish").val(ottoman)
                $(this).data("show", false);
                $(this).html("Osmanlıca Gizle");
            } else {
                $(".ottoman_and_turkishtext").hide();
                $("#turkish_content").show();
                $(this).data("show", true);
                $(this).html("Osmanlıca Göster");
            }
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
        optWords: ".optWords",
        btnViewImage: "#btnViewImage",
        btnIncreaseSize: ".btnIncreaseSize",
        btnDecreaseSize: ".btnDecreaseSize",
        btnShowOttomanText: "#btnShowOttomanText"


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
            selector: elements.btnTranTurkish,
            container: document,
            event: "click",
            handler: handlers.tranTurkishuttonClick,
            data: {}
        },
        {selector: elements.btnSave, container: document, event: "click", handler: handlers.saveButtonClick, data: {}},
        {
            selector: elements.btnIncreaseSize,
            container: document,
            event: "click",
            handler: handlers.increaseSizeFontButtonClick,
            data: {}
        },
        {
            selector: elements.btnDecreaseSize,
            container: document,
            event: "click",
            handler: handlers.decreaseSizeFontButtonClick,
            data: {}
        },
        {selector: elements.btnPrev, container: document, event: "click", handler: handlers.prevButtonClick, data: {}},
        {selector: elements.btnSuff, container: document, event: "click", handler: handlers.suffButtonClick, data: {}},
        {
            selector: elements.btnCompare,
            container: document,
            event: "click",
            handler: handlers.compareButtonClick,
            data: {}
        },
        {
            selector: elements.btnLineByLine,
            container: document,
            event: "click",
            handler: handlers.lineByLineOcrButtonClick,
            data: {}
        },
        {
            selector: elements.btnGoPage,
            container: document,
            event: "click",
            handler: handlers.goPageButtonClick,
            data: {}
        },
        {
            selector: elements.btnAddTrainData,
            container: document,
            event: "click",
            handler: handlers.addPageTrainDataButtonClick,
            data: {}
        },
        {
            selector: elements.btnSaveImageLine,
            container: document,
            event: "click",
            handler: handlers.saveImageLineTextButtonClick,
            data: {}
        },
        {
            selector: elements.spanOttomanWord,
            container: document,
            event: "dblclick",
            handler: handlers.ottomanWordSelectDoubleClick,
            data: {}
        },
        {
            selector: elements.btnFindOttomanWord,
            container: document,
            event: "click",
            handler: handlers.findOttomanWordButtonClick,
            data: {}
        },
        {
            selector: elements.btnSaveWord,
            container: document,
            event: "click",
            handler: handlers.saveOttomanWordButtonClick,
            data: {}
        },
        {
            selector: elements.tabpanelclick,
            container: document,
            event: "click",
            handler: handlers.tabPanelButtonClick,
            data: {}
        },
        {selector: elements.image_pk, container: document, event: "keyup", handler: handlers.gotoButtonClick, data: {}},
        {
            selector: elements.btnTurkishSaveText,
            container: document,
            event: "click",
            handler: handlers.turkishSaveTextButtonClick,
            data: {}
        },
        {
            selector: elements.optWords,
            container: document,
            event: "change",
            handler: handlers.wordOptionsChangeClick,
            data: {}
        },
        {
            selector: elements.btnViewImage,
            container: document,
            event: "click",
            handler: handlers.viewImageWithTextButtonClick,
            data: {}
        },
        {
            selector: elements.btnShowOttomanText,
            container: document,
            event: "click",
            handler: handlers.showOttomanTextButtonClick,
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