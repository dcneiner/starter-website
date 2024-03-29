(function(){
	Downloadify = window.Downloadify = {
		queue: {},
		uid: new Date().getTime(), 
		getTextForSave: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) return obj.getData();
			return "";
		},
		getFileNameForSave: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) return obj.getFilename();
			return "";
		},
		saveComplete: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.complete();
			return true;
		},
		saveCancel: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.cancel();
			return true;
		},
		saveError: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.error();
			return true;
		},
		addToQueue: function(container){
			Downloadify.queue[container.queue_name] = container;
		},
		// Concept adapted from: http://tinyurl.com/yzsyfto
		// SWF object runs off of ID's, so this is the good way to get a unique ID
		getUID: function(el){
			if(el.id == "") el.id = 'downloadify_' + Downloadify.uid++;
			return el.id;
		}
	};
 
	Downloadify.create = function( idOrDOM, options ){
		var el = (typeof(idOrDOM) == "string" ? document.getElementById(idOrDOM) : idOrDOM );
		return new Downloadify.Container(el, options);
	};
 
	Downloadify.Container = function(el, options){
		var base = this;
 
		base.el = el;
		base.enabled = true;
		base.dataCallback = null;
		base.filenameCallback = null;
		base.data = null;
		base.filename = null;
 
 		var init = function(){
 			base.options = options;

			if( !base.options.append ) base.el.innerHTML = "";
			
			base.flashContainer = document.createElement('span');
			base.el.appendChild(base.flashContainer);
				
			base.queue_name = Downloadify.getUID( base.flashContainer );
 
 			if( typeof(base.options.filename) === "function" )
 				base.filenameCallback = base.options.filename;
 			else if (base.options.filename)
				base.filename = base.options.filename;

			if( typeof(base.options.data) === "function" )
				base.dataCallback = base.options.data;
			else if (base.options.data)
				base.data = base.options.data;
				
				
			var flashVars = {
				queue_name: base.queue_name,
				width: base.options.width,
				height: base.options.height
			};
			
			var params = {
				allowScriptAccess: 'always'
			};
			
			var attributes = {
				id: base.flashContainer.id,
				name: base.flashContainer.id
			};
			
			if(base.options.enabled === false) base.enabled = false;
			
			if(base.options.transparent === true) params.wmode = "transparent";
			
			if(base.options.downloadImage) flashVars.downloadImage = base.options.downloadImage;
			
			swfobject.embedSWF(base.options.swf, base.flashContainer.id, base.options.width, base.options.height, "10", null, flashVars, params, attributes );

			Downloadify.addToQueue( base );
 		};

		base.enable = function(){
			var swf = document.getElementById(base.flashContainer.id);
			swf.setEnabled(true);
			base.enabled = true;
		};
		
		base.disable = function(){
			var swf = document.getElementById(base.flashContainer.id);
			swf.setEnabled(false);
			base.enabled = false;
		};
 
		base.getData = function(){
			if( !base.enabled ) return "";
			if( base.dataCallback ) return base.dataCallback();
			else if (base.data) return base.data;
			else return "";
		};
 
		base.getFilename = function(){
			if( base.filenameCallback ) return base.filenameCallback();
			else if (base.filename) return base.filename;
			else return "";
		};
		
		base.complete = function(){
			if( typeof(base.options.onComplete) === "function" ) base.options.onComplete();
		};
		
		base.cancel = function(){
			if( typeof(base.options.onCancel) === "function" ) base.options.onCancel();
		};
		
		base.error = function(){
			if( typeof(base.options.onError) === "function" ) base.options.onError();
		};
	
		init();
	};
	
	Downloadify.defaultOptions = {
		swf: 'media/downloadify.swf',
		downloadImage: 'images/download.png',
		width: 175,
		height: 55,
		transparent: true,
		downloadImage: null,
		append: false // When false, flash replaces all interior content;
	};
})();
// Support for jQuery
if(typeof(jQuery) != "undefined"){
	(function($){
		$.fn.downloadify = function(options){
			return this.each(function(){
				options = $.extend({}, Downloadify.defaultOptions, options);
				var dl = Downloadify.create( this, options);
				$(this).data('Downloadify', dl);	
			});
		};
	})(jQuery);
};