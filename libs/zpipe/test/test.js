var 
	chai = require('chai'),
	assert = chai.assert,
	zpipe = require("../"),
	zlib = require("zlib");

var data = "Experiments With Alternating Currents of Very High Frequency, and Their Application to Methods of Artificial Illumination";

describe("zpipe", function() {
	describe("deflate", function() {
		it("should compress strings", function() {
			var zpipe_deflated = zpipe.deflate(data);

			assert.ok(
				zpipe_deflated !== undefined && zpipe_deflated.length > 0 && zpipe_deflated.length < data.length, 
				"Did not compress data"
			);		
		});

		it("should generate valid zlib input", function(done) {
			var zpipe_deflated = zpipe.deflate(data);

			zlib.inflate(new Buffer(zpipe_deflated, 'binary'), function(err, buffer) {
				var zlib_inflated = buffer.toString('binary');

				assert.ok(zlib_inflated == data, "Inflated data did not match input data");

				done();
			});
		});
	});

	describe("inflate", function() {
		it("should decompress strings", function() {
			var zpipe_deflated = zpipe.deflate(data);

			var zpipe_inflated = zpipe.inflate(zpipe_deflated);
					
			assert.ok(zpipe_inflated == data, "Inflated data did not match input data");			
		});

		it("should handle zlib output", function(done) {
			zlib.deflate(new Buffer(data, 'binary'), function(err, buffer) {
				var zlib_deflated = buffer.toString('binary');

				var zpipe_inflated_zlib_deflated = zpipe.inflate(zlib_deflated);

				assert.ok(zpipe_inflated_zlib_deflated == data, "zpipe did not inflate zlib output correctly");

				done();
			});
		});	
	});	
});
