(function($){
	$(document).ready(function(){
		var cw = $("#code_wrapper").hide(),
			fresh = false,
			$helper = $("#example a"),
			$preview = $(".preview"),
			$class_name = $("input[name=class_name]"),
			starter = new Starter();

		$("#download").downloadify({
			filename: function(){
				return starter.process( false );
			},
			data: function(){
				return starter.process( true );
			},
			onComplete: function(){
				if(!fresh) $("#create").click();
			},
			onError: function(){
				showNoClassError();
			},
			swf: 'media/downloadify.swf',
			transparent: true,
			downloadImage: 'images/download.png'
		});

		$("#create").click(function(e){

			var process = function(){
				cw.slideUp("fast", function(){
					var data = starter.process();
					if(data == ""){
						showNoClassError();
					} else {
						fresh = true;
						$("pre").remove();
						$preview.after("<pre class='sh_javascript'>" + data + "</pre>");
						sh_highlightDocument();
						cw.slideDown("slow");
					};
				});
			};

			hide_helper_if_needed( process );

			e.preventDefault();
		});

		var showNoClassError = function(){
			hide_helper_if_needed(function(){
				$("pre").remove();
				$preview.after("<pre><span class='sh_regexp'>You must specify a Class Name</span></pre>");
				cw.slideDown("slow");
				$class_name.focus();	
			});
		};

		var hide_helper_if_needed = function(callback){
			if(!$helper) callback();
			else {
				$helper.slideUp("fast", function(){
					$helper.remove();
					$helper = null;
					callback();
				});	
			};
		};


		// Setup interactions and enhancements
		$("form").submit(function(e){$("#create").trigger("click"); e.preventDefault()});
		$("#include_choices label").pixel_CheckboxWidget();
		$("input, textarea, #include_choices label").change(function(e){ fresh = false; });
		$("#class_name, #namespace, #function_parameters, #default_options").pixel_InputFocus();

		// Set examples
		$helper.click(function(e){
			$("#class_name input").val("ProgressBar");
			$("#namespace input").val("Pixel");
			$("#function_parameters textarea").val("width|20\nheight|20\nshow|false");
			$("#default_options textarea").val("color|#fff\nbackgroundColor|#000\ntoggleClass|on");
			$("#include_options, #include_getter, #include_comments").setChecked();

			$(this).text("Now, Click Create!").unbind("click").click(function(e){
				$("#create").trigger("click");
				e.preventDefault();
			});

			e.preventDefault();
		});

		$class_name.focus();
	});
})(jQuery);