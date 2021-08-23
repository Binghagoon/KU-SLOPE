
var recordList;
var map
var markers = [];
function get_geo() {
    if (!!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("현재 위치를 가져올 수 없습니다.");
    }
}


function successCallback(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //Anam station
        lat = 37.586232954034564;
        lng = 127.02928291766814;
    //end
    $("#set_location").html('latitude : ' + lat + ', longitude : ' + lng);
    var container = document.getElementById('Map');
    var options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
    };
    map = new kakao.maps.Map(container, options);
    /*  var markerPosition = new kakao.maps.LatLng(lat,lng);
        var marker = new kakao.maps.Marker({
        position: markerPosition
        });
        marker.setMap(map); */
    var iwContent = "현재 있는 위치.";
    var iwPosition = new kakao.maps.LatLng(lat, lng);
    var iwRemoveable = true;
    var infowindow = new kakao.maps.InfoWindow({
        map: map,
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable
    });
}
function errorCallback() {
    alert('현재 위치를 가져올 수 없습니다.');
}

function RecordPositionGet(){
    $.ajax({
        url: "http://smartku.bingha.me/php/record-position-get.php",
        type: "GET",
        error:function(request,status,error){
            //alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            alert("record position get error");
        },
        success: function(data, status, xhr){
            MapPinWithRecord(data);
        }
    })
}

function MapPinWithRecord(data){
    var iwContent = "", // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

    recordList = JSON.parse(data);
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
    recordList.forEach(function(value, index){
        //refernce with https://apis.map.kakao.com/web/sample/multipleMarkerImage/

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);
        
        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: new kakao.maps.LatLng(value.lat,value.lon), // 마커를 표시할 위치
            title : value.name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image : markerImage // 마커 이미지 
        });
        markers.push(marker);
        kakao.maps.event.addListener(marker, 'click', function() {
            $("#PositionName").html(marker["Fb"])
            iwContent = $("#InfowindowTemplete").html();
            var infowindow = new kakao.maps.InfoWindow({
                content : iwContent,
                removable : iwRemoveable
            });   
            infowindow.open(map, marker); 
        });
    });
    // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
    // 인포윈도우를 생성합니다
    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(markers[1], 'click', function() {
        $("#PositionName").html(markers[1]["Fb"])
        iwContent = $("#InfowindowTemplete").html();
        var infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });    
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, markers[1]);
    });

}