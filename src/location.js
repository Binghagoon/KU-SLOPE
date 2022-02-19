// this file might need to be import JQuery file. otherwise it works not fine.
class Location {    //pos returns {lat:Number,lng:Number}, position returns {latitude:Number, longitude:Number}
  static async checkIsValueExist(id) {    //To be merged on getPosViaServer()
    let isValueExist;
    await $.ajax({
      url: window.location.origin + "/node/my-location-select",
      type: "GET",
      data: {
        id: args["id"],
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      },
      success: function (data, status, xhr) {
        if ($.isEmptyObject(data)) {
          isValueExist = false;   //TBD
        } else {
          isValueExist = true;
        }
      },
    });
    return isValueExist;
  }

  static getCurPosPromise = new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  static async getPositionViaClient(callback){
    let lat,lng;
    this.getCurPosPromise.then(function(position) {
      let coords = position.coords;
      lat = coords.latitude;
      lng = coords.longitude;
      callback(position);
    }).catch(function(err) {
      console.log("Could not get Position via client");
    });
    return {
      lat:lat,
      lng:lng,
    };
  }
  
  static async serverPosUpdate(pos,id,successCallback){
    $.ajax({
      url: window.location.origin + "/node/my-location-update",
      type: "POST",
      data: {
        id: id,
        latitude: pos.lat,
        longitude: pos.lng,
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("failed on location update");
      },
      success: function (data, status, xhr) {
        successCallback(data);
      },
    });
  }

  static async getPosViaServer(id){
    let location = {};
    await $.ajax({
      type: "GET",
      url: window.location.origin + "/node/get-location",
      data: {
        "id": id,
      },
      dataType: "JSON",
      success: function (response) {
        location = {
          lat: responce.latitude,
          lng: response.longitude,
        };
      },
    });
    return location;
  }

  constructor(lat, lng, intervalEnable, id) {
    try {
      function chackInput(val){
        if(parseFloat(val) == NaN)
          throw new Error("input is not float!");
      }
      chackInput(lat);
      chackInput(lng);
      this.lat = lat;
      this.lng = lng;
      this.id = id;
      if(intervalEnable){

      }
    } catch (e) {
      console.log(e);
      alert(e.massage);
    }
  }

  get pos() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  get position(){
    return {
      latitude: this.lat,
      longitude: this.lng,
    };
  }

  awakeInterval(timed = 1000){
    this.interval = setInterval(function(){
      Location.getPosViaClient().then(function (pos) {
        Location.serverPosUpdate(pos,this.id);
      });
    }, timed);
  }

  killInterval(){
    try{
      clearInterval(this.interval)
    } catch(e){
      console.log(e);
    }
  }
  delete(){
    $.ajax({
      url: window.location.origin + "/node/my-location-delete",
      type: "POST",
      //async: false,
      data: {
        id: args["id"],
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("failed on location delete");
        return false;
      },
      success: function (data, status, xhr) {
        console.log("Delete success");
        return true;
      },
      complete: function (jqXHR, textStatus) {},
    });
  }
}
