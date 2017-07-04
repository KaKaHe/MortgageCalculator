$(document).ready(function(){
	//Add your js code here
	$("input[type='radio']").css("margin","5px");
	setPurchaseType();
	setDownpaymentType();
	setPaymentType();
	
	$("#calculate").click(function(){
		if (!calculation())
			return;
		
		//Show the result in last step
		$("#detail").slideDown("fast");
		
	});
	
	$("#reset").click(function(){
		//$(document).reset();
		$("#purchasetype").html("");
		$("#downpaymenttype").html("");
		$("*").removeClass("has-error");
		$("input[type='radio']").attr("checked", false);
		$("#detail").slideUp("fast");
	});
	
	$("input[name='purchasetype']").click(function(){
		$(this).parent().click();
		setPurchaseType();
	});
	
	$("input[name='downpaymenttype']").click(function(){
		$(this).parent().click();
		setDownpaymentType();
	});

	$("input[name='paymentType']").click(function(){
		$(this).parent().click();
		setPaymentType();
		calculation();
	});
	
	function setPurchaseType(){
		$("#purchasetype").html($("input[name='purchasetype']:checked").parent().text());
	}
	
	function setDownpaymentType(){
		$("#downpaymenttype").html($("input[name='downpaymenttype']:checked").parent().text());
	}
	
	function setPaymentType(){
		$("#paymentType").html($("input[name='paymentType']:checked").parent().text() );//+ " Pay");
		$("#paymentTypeRate").html($("input[name='paymentType']:checked").parent().text());
	}
	
	function calculation(){
		//Get all input values
		var QuoteRate = $("#fixedrate").val()/100;
		var Amortization = $("#amortization").val();
		var Totalprice = $("#totalprice").val();
		var HouseType = $("input[name='purchasetype']:checked").val();
		var DownpaymentAmt = $("#downpayment").val();
		var DownpaymentType = $("input[name='downpaymenttype']:checked").val();
		var PaymentType = $("input[name='paymentType']:checked").val();
		
		//Validation Start
		var ErrorMsg = "";
		
		if(QuoteRate == 0) {
			ErrorMsg += "Please input a valid Rate!";
			$("#fixedrate").parent().addClass("has-error");
			//return false;
		}
		
		if(Totalprice == '') {
			ErrorMsg += "\nPlease input the price!";
			$("#totalprice").parent().addClass("has-error");
			//return false;
		}
		
		if (ErrorMsg != "") {
			alert(ErrorMsg);
			return false;
		}
		//End
		
		$("*").removeClass("has-error");
		
		if(Amortization == '') {
			Amortization = 25;
			$("#amortization").val("25");
		}
		
		if(DownpaymentAmt == '') {
			DownpaymentAmt = 20;
			$("#downpayment").val(20);
		}

		if(DownpaymentType == undefined) {
			DownpaymentType = 'P';
			$("input[name='downpaymenttype']").last().attr("checked", true);
			setDownpaymentType();
		}

		if(HouseType == undefined) {
			HouseType = 1;
			$("input[name='purchasetype']").first().attr("checked", true);
			setPurchaseType();
		}
		
		if(DownpaymentType == undefined) {
			DownpaymentType == 'D';
		}
		
		if(PaymentType == undefined) {
			PaymentType = 12;
			$("input[name='paymentType']").first().attr("checked", true);
			setPaymentType();
		}
		
		var Principal = 0.00;
		var ear = 0.0000;
		var monthlyrate = 0.00000000;
		var monthlypayAmt = 0.00;

		Totalprice = Totalprice * HouseType;
		
		if (DownpaymentType == 'P') {
			DownpaymentAmt = Totalprice * (DownpaymentAmt/100);
		}
		
		//Calculate the principle
		Principal = Totalprice - DownpaymentAmt;
		$("#principal").text("C$"+Principal.toFixed(2));
		
		//Calculate Effective Annual Rate (EAR)
		ear = (Math.pow((1+QuoteRate/2), 2) - 1) * 100;
		$("#ear").text(ear.toFixed(8) + "%");
		
		//Calculate Monthly rate
		//monthlyrate = (Math.pow((1 + ear/100), 1/12) - 1) * 100;
		/*switch(PaymentType) {
		case "26": PaymentType = 365/14; break;
		case "52": PaymentType = 365/7; break;
		default: PaymentType = 12;
		}
		//alert(PaymentType);*/
		monthlyrate = (Math.pow((1 + ear/100), 1/PaymentType) - 1) * 100;
		$("#monthlyrate").text(monthlyrate.toFixed(8) + "%");
		
		//Calculate Monthly Payment
		//var NumOfPay = Amortization * 12;
		var NumOfPay = Amortization * PaymentType;
		var PowerRate = Math.pow((1 + monthlyrate/100),NumOfPay);
		monthlypayAmt = (Principal * monthlyrate/100 * PowerRate) / (PowerRate - 1);
		$("#monthlypay").text("C$" + monthlypayAmt.toFixed(2));
		
		return true;
	}
	
	$("[data-toggle='tooltip']").tooltip();
});