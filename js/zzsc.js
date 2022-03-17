var current_fs, next_fs, previous_fs; 
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var form_data = {
	material: '',
	ip: '',
	price: '',
	quantity: '',
	email: '',
	phone: '',
	message: '' 
}

var data_id_map = {
	material: 'form-field-field_28031fa',
	ip: 'form-field-field_22cd1a1',
	price: 'form-field-field_91a8a13',
	quantity: 'form-field-field_2e7ff13',
	email: 'form-field-field_41742fd',
	phone: 'form-field-field_2c7ef85',
	message: 'form-field-field_aa3e9d8'
}

var map = {
	material: 'form_fields[field_28031fa]',
	ip: 'form_fields[field_22cd1a1]',
	price: 'form_fields[field_91a8a13]',
	quantity: 'form_fields[field_2e7ff13]',
	email: 'form_fields[field_41742fd]',
	phone: 'form_fields[field_2c7ef85]',
	message: 'form_fields[field_aa3e9d8]'
}

var send_data = {
	post_id: 35966,
	action: 'elementor_pro_forms_send_form',
	form_id: '87e91be',
	queried_id: 35966,
}

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	next_fs.show(); 
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 1 - (1 - now) * 0.2;
			left = (now * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});

	fillTheOriginForm()
});

function fillTheOriginForm() {
	for( key in data_id_map){
		console.log(key + ':' +data_id_map[key]+ ':' +form_data[key])
		$('#'+data_id_map[key]).val(form_data[key])
	}
}


$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	previous_fs.show(); 
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 0.8 + (1 - now) * 0.2;
			left = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});
});

$(".selector").click(function (e) {
	var obj 
	// 取消选中
	if($(e.target).hasClass('selected') || $(e.target).parent().hasClass('selected')) {
		if($(e.target).hasClass('selected')) {
			obj = $(e.target)
		}
		if($(e.target).parent().hasClass('selected')){
			obj = $(e.target).parent()
		}
		obj.removeClass('selected')
		var data = obj.data()
		form_data[data['target']] = ''
	}
	// 确认选中
	else {
		if($(e.target).is('span')){
			obj = $(e.target).parent()
		}
		else {
			obj = $(e.target)
		}
		obj.siblings().removeClass('selected')
		obj.addClass('selected')
		var data = obj.data()
		form_data[data['target']] = data['value']
	}
})

$('input[data-target]').bind("input propertychange", function(e) {
	form_data[$(e.target).data('target')] = $(e.target).val()
	$('input[data-target='+$(e.target).data('target')+']').val($(e.target).val())
})
$('textarea[data-target]').bind("input propertychange", function(e) {
	form_data[$(e.target).data('target')] = $(e.target).val()
	$('textarea[data-target='+$(e.target).data('target')+']').val($(e.target).val())
})


$('#new_submit_btn').click(async function(e) {
	fillTheOriginForm()

	// TODO: 判断Email和phone必填
	for( key in map ) {
		send_data[map[key]] = form_data[key]
	}

	$('.loading').show()

	$.ajax({
		url: 'https://unecklace.com/wp-admin/admin-ajax.php',
		method: 'post',
		data: send_data,
		success: function(result) {
			console.log('success: ' + result.data)
			// alert('Submit Successfully')
			$('input').not('[type="button"]').val('');
			$('textarea').val('');
			$('.loading').hide()
			window.location.href="https://unecklace.com/thank-you-for-your-enquiry";
		},
		error: function() {
			$('.loading').hide()
			alert('Submit Failure')
		}
	})
})