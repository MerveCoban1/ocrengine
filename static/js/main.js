$('document').ready(function () {

  var savedAreaArray = []
  $('img#image').selectAreas({
    minSize: [10, 10],
    onChanged: debugQtyAreas,
    areas: savedAreaArray,
  });

  $('#btnView').click(function () {
    var areas = $('img#image').selectAreas('areas');
    displayAreas(areas);
  });
  $('#btnViewRel').click(function () {
    var areas = $('img#image').selectAreas('relativeAreas');
    displayAreas(areas);
  });
  $('#btnReset').click(function () {
    output("reset")
    $('img#image').selectAreas('reset');
  });
  $('#btnDestroy').click(function () {
    $('img#image').selectAreas('destroy');
    output("destroyed")
    $('.actionOn').attr("disabled", "disabled");
    $('.actionOff').removeAttr("disabled")
  });
  $('#btnCreate').attr("disabled", "disabled").click(function () {
    $('img#image').selectAreas({
      minSize: [10, 10],
      onChanged: debugQtyAreas,
    });

    output("created")
    $('.actionOff').attr("disabled", "disabled");
    $('.actionOn').removeAttr("disabled")
  });
  $('#btnNew').click(function () {
    var areaOptions = {
      x: Math.floor((Math.random() * 200)),
      y: Math.floor((Math.random() * 200)),
      width: Math.floor((Math.random() * 100)) + 50,
      height: Math.floor((Math.random() * 100)) + 20,
    };
    output("Add a new area: " + areaToString(areaOptions))
    $('img#image').selectAreas('add', areaOptions);
  });
         
  function areaToString(area) {
    return (typeof area.id === "undefined" ? "" : (area.id + ": ")) + area.x + ':' + area.y + ' ' + area.width + 'x' + area.height + '<br />'
  }

  function output(text) {
    $('#output').html(text);
  }

  // Log the quantity of selections
  function debugQtyAreas(event, id, areas) {
    console.log(areas.length + " areas", arguments);
  };

  // Display areas coordinates in a div
  function displayAreas(areas) {
    var text = "";
    $.each(areas, function (id, area) {
      text += areaToString(area);
    });

    output(text);
  };
});

