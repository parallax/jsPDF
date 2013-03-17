function run(args) {
  if (Module["preRun"]) {
    Module["preRun"]();
  }

  args = args || Module["arguments"];
  initRuntime();
  var ret = null;
  if (Module["_main"]) {
    ret = Module.callMain(args);
    exitRuntime();
  }

  if (Module["postRun"]) {
    Module["postRun"]();
  }

  return ret;
};

Module['run'] = run;

// Make z'pipe!
var old = context[name];

var zpipe = (function() {
	var data;
	var i;
	var output;

	// Set up iostreams
	FS.init(function() {
		// Stdin								
		if(i < data.length) {
			var val = data.charCodeAt(i) & 0xFF;

			i++;

			return val;
		} else {
			return null;
		}					
	}, function(data) {
		// Stdout			
		output += String.fromCharCode(data & 0xFF);
	});

	// Export interface
	return {
		'inflate' : function(string) {
			//
			data = string;
			i = 0;
			output = '';

			//			
			if(run(['-d']) != 0) {
				throw new Error("Could not inflate string");
			}

			return output;
		},
		'deflate' : function(string) {
			data = string;
			i = 0;
			output = '';
		
			if(run([]) != 0) {
				throw new Error("Could not deflate string");
			}

			return output;
		},
		'noConflict': function () {
			if(old === undefined) {
				delete context[name];				
			} else {
				context[name] = old;
			}

			return this;
		}
	};
})();

return zpipe;

});
