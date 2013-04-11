(function($){
	
    // Declare namespace if not already defined
    if(!$.Pixel){
        $.Pixel = new Object();
    };
	
    $.Pixel.InputFocus = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el; 
        
        // Add a reverse reference to the DOM object
        base.$el.data("Pixel.InputFocus", base);
        
        base.init = function(){
            base.options = $.extend({},$.Pixel.InputFocus.defaultOptions, options);

			base.$input = base.$el.find("input:text, textarea");
			base.$input.focus(function(e){
				base.$el.addClass(base.options.toggleClass);
			}).blur(function(e){
				base.$el.removeClass(base.options.toggleClass);
			});
			
        };
        
        base.init();
    };

	
    $.Pixel.InputFocus.defaultOptions = {
        toggleClass: "focus"
    };
	

    $.fn.pixel_InputFocus = function(options){
        return this.each(function(){
            (new $.Pixel.InputFocus(this, options));
        });
    };

	
    // This function breaks the chain, but returns
    // the Pixel.InputFocus if it has been attached to the object.
    $.fn.getPixel_InputFocus = function(){
        return this.data("Pixel.InputFocus");
    };
	
})(jQuery);