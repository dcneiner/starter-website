(function($){
	
    if(!$.Pixel){
        $.Pixel = new Object();
    };
	
    $.Pixel.CheckboxWidget = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el; 
        
        // Add a reverse reference to the DOM object
        base.$el.data("Pixel.CheckboxWidget", base);
        
        base.init = function(){
            base.options = $.extend({},$.Pixel.CheckboxWidget.defaultOptions, options);
			
			base.$input = base.$el.find("input:checkbox").hide();
			base.$input.wrap("<span class='" + base.options.wrapperClassName + "'></span>");
            
			base.updateView();
			base.$el.click(function(e){
				base.toggleValue();
				e.preventDefault();
			});
			
			base.$input.change(function(e){
				base.updateView();
			});
        };

		base.setChecked = function(on){
			if(on != false) on = true;
			if(on == true)
				base.$input.attr("checked", "checked");
			else
				base.$input.removeAttr("checked");
				
			base.updateView();
		};

		base.toggleValue = function(){
			if(base.$input.attr("checked"))
				base.$input.removeAttr("checked");
			else
				base.$input.attr("checked", "checked");
			
			base.updateView();
			base.$el.trigger("change");
		};
		
		base.updateView = function(){
			base.$el.toggleClass(base.options.onClassName, (base.$input.attr("checked")));
		};
        
        base.init();
    };

	
    $.Pixel.CheckboxWidget.defaultOptions = {
        wrapperClassName: "shadow",
		onClassName: "on"
    };
	

    $.fn.pixel_CheckboxWidget = function(options){
        return this.each(function(){
            (new $.Pixel.CheckboxWidget(this, options));
        });
    };

    $.fn.setChecked = function(){
        return this.each(function(){
            var cw = $(this).parents("label").data("Pixel.CheckboxWidget");
			if(cw) cw.setChecked();
        });
    };

})(jQuery);