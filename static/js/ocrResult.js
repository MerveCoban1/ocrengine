var istek;

var elementCoor = [];
var elementRealCoordinates = [];
var elementLength = 0;
var firstHeight = 0;
var secondHeight = 0;
var gelenKordinatlar = [];
var gelenKordinatlarHepsi = [];
var gelenKordinatlarYukseklik = [];
var realWidth;
var realHeight;
var ratioWidth;
var ratioHeight;

$.get("getOcrResult").done(function (result) {

    if (result.success) {
        //toastr.success("Ocr işlemi başarılı bir şekilde tamamlandı.");

        //get real image size////////////////////////
        var imgLoader = new Image();

        const imageurl = $("#source").attr("src");
        imgLoader.src = imageurl;
        imgLoader.onload = function () {
            realHeight = imgLoader.height;
            realWidth = imgLoader.width;
            ratioWidth = realWidth / $('#source').width();
            ratioHeight = realHeight / $('#source').height();

            veri = result.text;

            //var veri = JSON.parse(result.text);
            let elements = ``;
            var i;
            for (i = 0; i < veri.length; i++) {
                elements += `<input id="ocr${i}" class="ocr form-control ocrinput" type="text" value="` + veri[i]["text"] + `"></input><br>`;
                gelenKordinatlar = veri[i]["coord"];
                gelenKordinatlarHepsi.push(gelenKordinatlar);
                gelenKordinatlarYukseklik.push(gelenKordinatlar[0]);
                secondHeight = firstHeight + gelenKordinatlar[0];
                elementCoor.push(firstHeight / ratioHeight);
                elementCoor.push(secondHeight / ratioHeight);
                elementRealCoordinates.push(firstHeight);
                elementRealCoordinates.push(secondHeight);
                elementLength += 2;
                firstHeight = secondHeight;
            }
            $("#ocrResultDiv").append(elements);

            let elements2 = ``;
            elements2 += `<p>Girdiğiniz dosyanın fontu: ` + result.fontText + `</p><br>`;
            $("#fontResultDiv").append(elements2);
        }

        var counter;
        var count;
        var id = '';

        //Normal Mode
        $('#btnNormalMod').click(function () {
            $("#processedImageDiv").children().remove();
            let elements = ``;
            elements += `<div class="border"></div>`;
            elements += `<img src="` + imageurl + `" id="source"></img>`;
            $("#processedImageDiv").append(elements);

            //sağ tarafı gösterelim
            $(".section2").css({ "display": "block" });

            $('#source').on("mousemove", function (e) {
                var offset = $(this).offset();
                var X = (e.pageX - offset.left);
                var Y = (e.pageY - offset.top);

                if (!this.canvas) {
                    this.canvas = $('<canvas id="canvas"/>')[0];
                }
                var cnvas = $(this.canvas);

                count = 0;
                for (counter = 0; counter <= elementLength; counter += 2) {
                    if (Y >= elementCoor[counter] && Y <= elementCoor[counter + 1]) {
                        img = document.getElementById("source");
                        var lineHeigtht = (elementCoor[counter + 1] - elementCoor[counter])
                        var lineWidth = img.width

                        cnvas.appendTo($('#processedImageDiv'));

                        cnvas.css({
                            position: 'absolute',
                            left: $("#source").offset().left - this.left,
                            top: elementCoor[counter],
                            "height": lineHeigtht + "px",
                            "width": lineWidth + "px",
                            "border": "3px solid blue",
                            "background-color": "transparent"
                        });

                        $('#source').hover(function () {

                            $('#canvas').toggle();
                        })
                        id = "#ocr" + count;
                        $(".ocr").css({ "background-color": "darkgrey" });
                        $(id).css({ "background-color": "gray" });
                    }
                    count++;
                }
            });
        });

        //Line Mode
        $('#btnLineMod').click(function () {
            img = document.getElementById("source");

            var linesCount = 0;
            var id;
            ratioHeight = realHeight / $('#source').height();

            console.log("elementRealCoordinates");
            console.log(elementRealCoordinates);
            var ocr_view_url = 'cropLines'
            $.ajax({
                method: 'POST',
                url: ocr_view_url,
                data: {
                    "coordinates": elementRealCoordinates,
                    "width": realWidth,
                    "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val()
                },
                datatype: 'json',
                success: function (data) {
                    toastr.success(data.message ? data.message : "İşlem başarılı bir şekilde tamamlandı.");
                    //alert("OK! post req send to cropLines view");	
                },
                error: function (data) {
                    alert("NOT OK! post req can not send to cropLines view");
                }
            }).done(function (result) {
                if (result.success) {
                    linesCount = elementRealCoordinates.length / 2;
                } else {
                    console.log("can not open line mod");
                }
            }).then(function () {
                console.log("*********************************************" + inputWidth + "****" + inputHeight)
                $("#processedImageDiv").children().remove();
                let elements = ``;
                var i;
                var ocrValue = "";
                var element;
                var inputHeight = 0;
                $("#processedImageDiv").append(`<div id="linescol" class="col-md" style="overflow: auto;"></div>`);

                //sağ tarafı yok edelim
                $(".section1").css({ "display": "block" });
                $(".section2").css({ "display": "none" });

                for (i = 1; i < linesCount; i++) {
                    id = "ocr" + (i - 1);
                    element = document.getElementById(id).attributes;
                    ocrValue = element.getNamedItem("value").value;

                    //input height
                    inputHeight = gelenKordinatlarYukseklik[i];
                    //
                    //    //inputHeight = { inputHeight };
                    //
                    var inputWidth = $('.section1').width();
                    elements += ` <div class="row" style="text-align:center;"><img class="" style="object-fit: contain;width:${inputWidth}px;" src="./media/images/cropped/crop${i}.png"> </div>`;
                    elements += ` <div class="row" style="text-align:center;"><input class="ocr ocrinput" style="width:${inputWidth}px; height:${inputHeight}px; text-align:right;border:none;border-right: 2px solid gray;" type="text"  value="${ocrValue}"></input> </div>`;
                }

                $("#linescol").append(elements);
            })
        });

        //overlap mode
        $('#btnOverlapMod').click(function () {
            //resmi ekleyelim
            $("#processedImageDiv").children().remove();
            let elements = ``;
            elements += `<img src="` + imageurl + `" id="source">`;
            $("#processedImageDiv").append(elements);

            //sağ tarafı yok edelim
            $(".section2").css({ "display": "none" });

            //resmi blurlaştıralım
            //$("#source").css({ "-webkit-filter": "blur(1px)" }, { "filter": "blur(5px)" });

            //yazı ekleyelim
            var element;
            img = document.getElementById("source");
            var lineWidth = img.width
            var linesCount = elementLength / 2;
            elements = ``
            var textTop = 0;
            var elementIndex = 0;
            var inputHeight = 0;

            //get ratio ////////////////////////
            $('#source').load(function () {
                ratioWidth = realWidth / $('#source').width();
                ratioHeight = realHeight / $('#source').height();

                console.log("overlap mod ratioHeight" + ratioHeight)

                for (i = 1; i <= linesCount; i++) {
                    //input height
                    inputHeight = gelenKordinatlarYukseklik[i] / ratioHeight;

                    textTop = textTop + inputHeight;
                    elementIndex += 2;
                    id = "ocr" + (i - 1);
                    element = document.getElementById(id).attributes;
                    ocrValue = element.getNamedItem("value").value;

                    elements += `<div class="ocr" style="position: absolute; top: ${textTop}px;right:` + $("#processedImageDiv").offset().right +
                        `;"><input class="ocr ocrinput" style="width:${lineWidth}px; height:${inputHeight}px; text-align:right;background-color:rgba(0, 0, 0, 0);font-weight:bold; border:none;color:rgba(255, 0, 0, 0.5);" type="text" value="${ocrValue}"></input></div>`;
                }
                $("#processedImageDiv").append(elements);
            });

        });

        //text size increase
        $('#btnSizeIncrease').click(function () {
            var font_size = $(".ocr").css("font-size");
            const myArray = font_size.split("p");
            font_size = myArray[0];
            font_size = parseInt(font_size);
            font_size += 5;
            font_size = "" + font_size + "px";
            $(".ocr").css({ "font-size": font_size });
        });

        //text size reduce
        $('#btnSizeReduce').click(function () {
            var font_size = $(".ocr").css("font-size");
            const myArray = font_size.split("p");
            font_size = myArray[0];
            font_size = parseInt(font_size);
            font_size -= 5;
            font_size = "" + font_size + "px";
            $(".ocr").css({ "font-size": font_size });
        });

        //line height increase
        $('#btnlineHeightIncrease').click(function () {
            var line_height = $(".ocr").css("line-height");
            const myArray = line_height.split("p");
            line_height = myArray[0];
            line_height = parseInt(line_height);
            line_height += 5;
            line_height = "" + line_height + "px";
            $(".ocr").css({ "line-height": line_height });
        });

        //line height reduce
        $('#btnLineHeightReduce').click(function () {
            var line_height = $(".ocr").css("line-height");
            const myArray = line_height.split("p");
            line_height = myArray[0];
            line_height = parseInt(line_height);
            line_height -= 5;
            line_height = "" + line_height + "px";
            $(".ocr").css({ "line-height": line_height });
        });

        //word spacing increase
        $('#btnWordSpacingIncrease').click(function () {
            var word_spacing = $(".ocr").css("word-spacing");
            const myArray = word_spacing.split("p");
            word_spacing = myArray[0];
            word_spacing = parseInt(word_spacing);
            word_spacing += 5;
            word_spacing = "" + word_spacing + "px";
            $(".ocr").css({ "word-spacing": word_spacing });
        });

        //word spacing reduce
        $('#btnWordSpacingReduce').click(function () {
            var word_spacing = $(".ocr").css("word-spacing");
            const myArray = word_spacing.split("p");
            word_spacing = myArray[0];
            word_spacing = parseInt(word_spacing);
            word_spacing -= 5;
            word_spacing = "" + word_spacing + "px";
            $(".ocr").css({ "word-spacing": word_spacing });
        });

        //back
        $('#backToHome').click(function () {
            //$(location).attr('href', 'index.html')
        });

        //change text color
        $('#btnChangeTextColor').click(function () {
            var color = document.getElementById("ocrTextColor").value;
            $(".ocr").css({ "color": color });
        });

        //save ocr changes
        $('#btnSaveOcrChanges').click(function () {
            var inputValues = [];
            var ocrInputs = document.getElementsByClassName("ocrinput");
            var i;
            for (i = 0; i < gelenKordinatlarHepsi.length; i++) {
                inputValues.push(ocrInputs[i].value);
                console.log("ocrinput" + ocrInputs[i].value);
                console.log("gelenkordinatlarhepsi" + gelenKordinatlarHepsi[i]);
            }

            //$.ajax({
            //    type: "POST",
            //    url: "back/saveInputData.php",
            //    data: {
            //        "data": inputValues,
            //        "coord": gelenKordinatlarHepsi,
            //    },
            //    success: function (data) {
            //        alert("Girdileriniz başarıyla kayıt edildi");  
            //    },
            //    error: function () {
            //        alert("entries could not be saved");
            //    },
            //});
        });
    } else {
        toastr.error(result.message);
    }
});



