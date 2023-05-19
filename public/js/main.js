jQuery(function($) {'use strict',
	//Initiat WOW JS
	new WOW().init();
	
	//goto top
	$('.gototop').click(function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $("body").offset().top
		}, 500);
	});	

});

var finalBooking = null;
$(document).ready(function() {
  var selectedBeds = {};
  var totalDays = parseInt($("#totalDays").val());
  var cin = ($("#cin").val());
  var cout = ($("#cout").val());
	var locID = ($("#locationID").val());
	var gts = ($("#numbedsel").val());
	if(gts == ''){
		gts = 'unknown no of';
	}
  finalBooking = {
		locationId: locID,
		guests: gts,
    rooms: [],
    totalDays: totalDays,
    sdate: cin,
    edate: cout
  };
		
	$(document).on("click", ".clearselection", function(e) {
    var ul = $(this).parent().parent();
    var roomId = ul.attr("room-id");
    $("#dropdown" + roomId).text($(this).text());
    //console.log(roomId);
    delete selectedBeds[roomId];
		$("#roomwrapper").html("");
		$('.choose-your-room').show();
		$('.paymentdetails').hide();
    calculateTotalBeds();
  });
	
	$(document).on("click", ".deleteselection", function(e) {
		e.preventDefault();
    var roomId = $(this).attr("data-href");
    $("#dropdown" + roomId).text('Select Beds');
    //console.log(roomId);
    delete selectedBeds[roomId];
		$("#roomwrapper").html("");
		$('.choose-your-room').show();
		$('.paymentdetails').hide();
    calculateTotalBeds();
  });

  function isEmptyObject(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }
		
	$(document).on("click", ".roomBed", function(e) {
    var elem = $(this);
    var roomId = elem.attr("room-id");
    var title = elem.attr("card-title");
    var fullObj = JSON.parse(elem.parent().find("textarea").val());
    fullObj.reqRoom = parseInt(elem.attr("value"))
    selectedBeds[roomId] = fullObj
    //console.log(roomId, title, fullObj, fullObj.reqRoom);
    $("#dropdown" + roomId).text(elem.text());
    calculateTotalBeds()
  });
		
	var trcon = '<tr>' +
    '<td><b>@room</b></td>' +
    '<td class="text-center"><span class="hide-for-lg">Price: </span>@price</td>' +
    '<td class="text-center"><span class="hide-for-lg">Beds: </span>@bed</td>' +
    '<td class="text-center"><span class="hide-for-lg">Total Days: </span>@nights</td>' +
    '<td class="text-right"><span class="hide-for-lg">Amount: </span>@total</td>' +
  '</tr>';
	
	var dvcon = '<div class="room-wrapper">'+
								'<div class="room-type text-bold">@room</div>'+
								'<div class="room-name">'+
									'@bed for <span class="total-price">@total</span> <a class="deleteselection fa fa-trash" data-href="@number"></i>'+
								'</div>'+
							'</div>';
							
  var totalFinalPrice = 0;

  function calculateTotalBeds() {
    var html = "";
    var arr = [];
    var total = 0;
    var price = 0;
    var pvt = 0;
    var pdsc = 0;
    finalBooking = {
			locationId: locID,
			guests: gts,
      rooms: [],
      totalDays: totalDays,
      sdate: cin,
      edate: cout
    };
		//console.log(finalBooking);
    if (isEmptyObject(selectedBeds)) $("#bookbegin").prop('disabled', true);
      else $("#bookbegin").prop('disabled', false);
      for (var key in selectedBeds) {
        finalBooking.rooms.push(selectedBeds[key]);
        arr.push(selectedBeds[key].reqRoom + " Beds (" + selectedBeds[key].name + ") x " + totalDays + " Nights");
        total = total + selectedBeds[key].reqRoom;
				pvt = selectedBeds[key].privte;
				if(pvt == 1){
					pdsc = selectedBeds[key].pdiscount;					
					if(selectedBeds[key].reqRoom == 1){
						var pp = selectedBeds[key].price;
						pp = (pp - (pp * pdsc/100));
						price = price + pp;
					}
					else{
						price = price + selectedBeds[key].price;
					}
				}
				else{
					price = price + selectedBeds[key].reqRoom * selectedBeds[key].price;
				}
      }
			//alert(price);
      $("#tbreak").text("");
      $("#tbeds").text(0);
      $("#tprice").text("");
      $("#tprice2x").text("");

      $("#tbreak").text(arr.join(" + "));
      if (total > 0){
        $("#tbeds").text(total + " for " + totalDays + " Nights");
        $("#tprice").text("₹" + Math.ceil(totalDays * price * .25));
        $("#tprice2x").text("₹" + Math.floor(totalDays * price * .75));
				$("#totalAmount").text("₹" + Math.floor(totalDays * price));
        $("#tbody").html("");
				$("#roomwrapper").html("");
				$('.choose-your-room').hide();
				$('.paymentdetails').show();
			}

      for (var i = 0; i < finalBooking.rooms.length; i++) {
        var room = finalBooking.rooms[i];
        var html = trcon;
				var html2 = dvcon;
				var rprice = room.price;
				var rtotal = totalDays * room.reqRoom * room.price;
				var bds = room.reqRoom;
				var privt = room.privte;
				var pdsc = room.pdiscount;
				//alert(bds);
				if(privt == '1'){
					var bs = 'person';
					if(bds == 1){
						rprice = rprice - (rprice * (pdsc/100));
					}
					rtotal = totalDays * rprice;
				}
				else{
					var bs = 'bed';
				}
				if(bds > 1){
					var bbb = bds + ' ' + bs + 's';
				}
				else{
					var bbb = bds + ' ' + bs;
				}
        html = html.replace("@room", room.name);
        html = html.replace("@price", "₹" + rprice);
				html = html.replace("@bed", room.reqRoom);
        html = html.replace("@nights", totalDays);
				
				html2 = html2.replace("@room", room.name);
        html2 = html2.replace("@bed", bbb);
				html2 = html2.replace("@number", room.id);
						
        if (total > 0){
          html = html.replace("@total", "₹" + rtotal);
					html2 = html2.replace("@total", "₹" + rtotal);
				}
				$("#tbody").append(html);
				$("#roomwrapper").append(html2);
			}
      totalFinalPrice = Math.floor(totalDays * price * .75);
      $("#tbody").append('<tr class="bb0"><td colspan="5">To Pay ₹ <b id="tprice1">' + Math.ceil(totalDays * price * .25) + '</b> (Non-refundable) <span class="pull-right">Outstanding ₹ <b><span id="tprice21x"> ' + Math.floor(totalDays * price * .75) + '</span></b></span></td></tr>');
    }
		
		$("#bookbegin").click(function() {
        var xyroom = 0;
        for (var i = 0; i < finalBooking.rooms.length; i++) xyroom = xyroom + finalBooking.rooms[i].reqRoom;

        if (xyroom > 8) {
            alert("Due to high demand, we are allowing just 8 beds per booking. Please reduce the number of beds. We are sorry for the inconvenience.");
            return;
        }
        $("#exampleModalCenter").modal("show");
    })
		
		function reserveBegin() {
        finalBooking.email = $("#orderEmail").val();
        finalBooking.phone = $("#orderPhone").val();
        finalBooking.name = $("#orderName").val();
        finalBooking.totalPrice = $("#tprice1").text();
        finalBooking.outstanding = $("#tprice21x").text();
        console.log(JSON.stringify(finalBooking));
				$.ajax({
					url: "booking/checkout",
					method: 'POST',
					data: JSON.stringify(finalBooking),
					type: 'JSON',
					beforeSend: function () {
						
					},
					success: function (data) {
						//console.log(data);
						var resp = $.parseJSON(data);
						if (resp.error == false) {
							//console.log(resp.message);
							if(resp.message['status'] == 'ERROR'){
								alert('There is an error processing your payment. Please try again later.');
								location.reload();
							}
							else{
								location.href = resp.message
							}
            }
						else {
							console.log(data.message);
              $("#editBooking").attr('disabled', false);
              $("#finalBooking").attr('disabled', false);
              $("#finalBooking").find(".fa-spin").hide();
            }
						
					}
				});

    }

    $(document).on("click", "#finalBooking", function(e) {
        $("#editBooking").attr('disabled', true);
        $(this).attr('disabled', true);
        $(this).find(".fa-spin").show();
        reserveBegin()
    });
		
		$(document).on("click", "#checkavailability", function(e) {
        e.preventDefault();
				if(validated()){
					//alert('xxxxxx');
					$('#bookingform').submit();
				}
    });
		
		function validated(){
			var result = true;
			var locID = $('#bookingform .locationId').val();
			var sdate = $('#bookingform .t-input-check-in').val();
			var edate = $('#bookingform .t-input-check-out').val();
			//var guests = $('#bookingform .guest').val();
			//console.log(locID);
			//console.log(sdate);
			//console.log(edate);
			//console.log(guests);
			if((locID == '') || (sdate == 'null') || (edate == 'null')){
				result = false;
			}
			return result;
		}
});