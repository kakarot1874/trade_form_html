//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
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

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
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
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
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

// $(".submit").click(function(){
// 	console.log(form_data)
// 	return false;
// })

$('#new_submit_btn').click(function() {
	console.log(form_data)
	fillTheOriginForm()
	$("#origin_submit_btn").click()
})