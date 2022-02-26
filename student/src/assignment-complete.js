// import ../src/url-parameter.js
const query = queryToObject();
let clicked = 0;
$(function () {
  startMap(function () {
    let driverID = query["driverId"];
    let studentID = sessionStorage.getItem("kubus_member_id");
    try {
      let driverLoc = new Location(driverID, function (loc) {
        let driverMarker = markerCreate(loc.pos, "DRIVER");
        loc.awakeInterval(1000, function (pos) {
          markerLocationChange(driverMarker, {
            latitude: pos.lat + 0.0001 * clicked,
            longitude: pos.lng,
          });
        });
      });

      let studentLoc = new Location(studentID, function (loc) {
        let studentMarker = markerCreate(loc.pos, "STUDENT");
        loc.awakeInterval(1000, function (pos) {
          markerLocationChange(studentMarker, {
            latitude: pos.lat - 0.0001 * clicked,
            longitude: pos.lng,
          });
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  });
  $("#cancel-reservation").on("click", function () {
    $.ajax({
      url: "../node/reservation-delete",
      data: {
        id: query["callNo"],
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error");
      },
      success: function (data, textStatus, jqXHR) {
        console.log("Move to ConfirmReservation");
        window.location.href = "confirm-reservation";
      },
    });
  });
  $("#send-message").on("click", function (e) {
    //for use debug
    //e.preventDefault();
    clicked = clicked + 1;
  });
});
