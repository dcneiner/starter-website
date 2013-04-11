(function($){
	String.prototype.strip = function(){
		return this.replace(/^\s+|\s+$/gi,'');
	};
	
	String.prototype.to_value = function(){
		if(this == "")
			return '""';
		else if (/^(true|false|[0-9.-]+|"(.*?)"|'(.*?)')$/.test(this))
			return this;
		else
			return '"' + this + '"';
	};
	
	Array.prototype.compact = function(){
		var new_array = new Array();
		for(var i = 0; i < this.length; i++){
			if(this[i]) new_array.push(this[i]);
		}
		return new_array;
	};
	
	Starter = window.Starter = function(){
		var base = this;
		
		var init = function(){
			base.$namespace    = $("input[name=namespace]");
			base.$class_name   = $("input[name=class_name]");
			
			base.$variables    = $("textarea[name=variables]");
			base.$options      = $("textarea[name=options]");
			
			base.$inc_options  = $("input[name=include_options]");
			base.$inc_getter   = $("input[name=include_getter]");
			base.$inc_comments = $("input[name=include_comments]");
		};
		
		base.process = function( get_code ){
			var t = {
				namespace         : base.$namespace.val(),
				class_name        : base.$class_name.val(),               
				variables         : base.$variables.val(),                
				options           : base.$options.val(),                  
				include_options   : base.$inc_options.is(':checked'),     
				include_namespace : (base.$namespace.val() != ""),                    
				include_getter    : base.$inc_getter.is(':checked'),      
				include_comments  : base.$inc_comments.is(':checked')
			};
			
			if( t.class_name == "" ) return "";
			
			// Clean variables block and break into an array of lines
			t.variables = t.variables.strip().split(/\n/).compact();
			
			t.default_values_for_variables = new Array();
			t.function_params              = new Array();
			
			for(var i = 0; i < t.variables.length; i++){
				var vars = t.variables[i].split('|'),
					name = vars.shift().strip();
				
				if(vars.length != 0){
					var value = vars.shift().strip().to_value();
					t.default_values_for_variables.push( [name, value ]);
				};
				
				t.function_params.push( name );
			};
			
			if( t.include_options ){
				
				t.function_params.push( 'options' );
			
				t.options = t.options.strip().split(/\n/).compact();
			
				t.default_options = new Array();
			
				for(var i = 0; i < t.options.length; i++){
					var opts  = t.options[i].split('|'),
						name  = opts.shift().strip(),
						value = opts.shift() || "";
					
					value = value.strip().to_value();
					t.default_options.push( [name, value ]);
				};

			};
			
			if( t.include_namespace ){
				t.camel_class_name = t.namespace.toLowerCase() + "_" + t.class_name;
				t.class_name = t.namespace + "." + t.class_name;
			} else {
				t.camel_class_name = t.class_name[0].toLowerCase() + t.class_name.substr(1);
			};

			if( get_code === false){
				return 'jquery.' + t.class_name.toLowerCase() + '.js';
			} else {
				return base.render(t);
			};
			
		};
		
		var output = "";
		base.render = function(t){
			output = "";
			
			line('(function($){', 1);
			
			if(t.include_namespace){
				line('if(!$.' + t.namespace +'){', 1);
				line('$.' + t.namespace + ' = new Object();', -1);
			    line('};');
				line( '' );
			};
			
			var declaration = '$.' + t.class_name + ' = function(el';
			if(t.function_params.length > 0)
				declaration += ', ' + t.function_params.join(', ');
			declaration += '){';
			
			line( declaration, 1);
			
			if( t.include_comments ){
				line( "// To avoid scope issues, use 'base' instead of 'this'" );
		        line( "// to reference this class from internal events and functions." );	
			};
	        line( 'var base = this;');
			line( '' );
	
			if( t.include_comments ) line( "// Access to jQuery and DOM versions of element" );
	        line( 'base.$el = $(el);');
	        line( 'base.el = el;');
			line( '' );
	
			if( t.include_comments ) line( "// Add a reverse reference to the DOM object" );
	        line( 'base.$el.data("' + t.class_name + '", base);');
	    	line( '' );
        
			line( 'base.init = function(){', 1);
			if(t.default_values_for_variables.length){
				for(var i = 0; i < t.default_values_for_variables.length; i++){
					var pair = t.default_values_for_variables[i];
					line( 'if( typeof( ' + pair[0] + ' ) === "undefined" || ' + pair[0] + ' === null ) ' + pair[0] + ' = ' + pair[1] + ';');
				};
				line( '' );
			}
			
			if(t.function_params.length > 1){
				for(var i = 0; i < t.function_params.length; i++){
					var item = t.function_params[i];
					if( item == "options") continue;
					line( 'base.' + item + ' = ' + item + ';' );
				};
				line( '' );
			};

			
			if( t.include_options ){
				line('base.options = $.extend({},$.' + t.class_name + '.defaultOptions, options);');
				line( '' );
			};

			if( t.include_comments )
			line( '// Put your initialization code here' );
			
			unindent();
			line( '};' );
			
			if( t.include_comments ){
				line( '' );
				line( '// Sample Function, Uncomment to use' );
		        line( '// base.functionName = function(paramaters){' );
		        line( '// ' );
		        line( '// };' );
				line( '' );
				line( '// Run initializer')
			};
			
			
			line( 'base.init();');
			
			unindent();
			line( '};' );
			line( '' );
			
			if ( t.include_options ){
				line( '$.' + t.class_name + '.defaultOptions = {', 1);
				for(var i = 0; i < t.default_options.length; i++){
					var pair = t.default_options[i];
					line( pair[0] + ': ' + pair[1] + (i == t.default_options.length - 1 ? '' : ','));
				}
				unindent();
				line( '};' );
				line( '' );
			};
			
			line( '$.fn.' + t.camel_class_name + ' = function(' + t.function_params.join(', ') + '){', 1);
			line( 'return this.each(function(){', 1);

			var constructor = '(new $.' + t.class_name + '(this';
			if(t.function_params.length > 0) constructor += ', ' + t.function_params.join(', ');
			constructor += '));';
			
			line( constructor, -1 );
			line( '});', -1 );
			line( '};' );
			line( '' );
			
			if( t.include_getter ){
				if( t.include_comments ){
					line('// This function breaks the chain, but returns');
				    line('// the ' + t.class_name + ' if it has been attached to the object.');
				}
				line('$.fn.get' + t.class_name.replace(/\./g, "_") + ' = function(){', 1);
				line('this.data("' + t.class_name + '");', -1);
				line('};');
				line('');
			};
			
			unindent();
			line('})(jQuery);');
			
			return output.replace("\n", "\r\n");
		};
		
		base.tab_indent = 0;
		
		var line = function(text, indent_direction){
			output += tab() + text + "\n";
			if(indent_direction == 1)
				indent();
			else if (indent_direction == -1)
				unindent();
		};
		
		var indent = function(){
			base.tab_indent = base.tab_indent + 1;
		};
		
		var unindent = function(){
			base.tab_indent = base.tab_indent - 1;
			if( base.tab_indent < 0 ) base.tab_indent = 0;
		};
		
		var tab = function(){
			var tb = "";
			for(var i = 0; i < base.tab_indent; i++){
				tb = tb + "    ";
			};
			return tb;
		};
		
		
		init();
	};
})(jQuery);