var ifr;
var buttonParent;
var now = 2;
var buttons = [];
var pages = [];
var firstPage ={
    undefined:"/Student/FirstPage.html",
    "STUDENT":"/Student/FirstPage.html",
    "DRIVER":"/Driver/Map.html",
    "ADMINISTRATOR":"/Administrator/FirstPage.html",
};

$(function(){
    ifr =  $("#Iframe");
    buttonParent = $("FrameSuffix");
    buttons = [ undefined , $("#MapHome"), $("#ReservationHome"), $("#NoticeHome"), $("#MyInfoHome") ]
    pages = [ undefined, "Map", "Reservation", "Alarm", "MyPage" ]
    pre = { "STUDENT" : "Student", "DRIVER" : "Driver"};
    buttons[1].on("click",() => Click(1));
    buttons[2].on("click",() => Click(2));
    buttons[3].on("click",() => Click(3));
    buttons[4].on("click",() => Click(4));
    ifr.attr("src", window.location.origin + firstPage[args["role"]]);        //frame's first page
});

function Click(to){
    var src = pre[args["role"]] + "/" + pages[to] + ".html";
        src =  + src;    //it should be attach window.location.origin, if error is rising then attach it.

    ifr.attr("src", src + window.location.search);
    buttons[to].addClass("select");
    buttons[now].removeClass("select");
    now = to;
}

/* Frame의 동적움직임을 정의 */