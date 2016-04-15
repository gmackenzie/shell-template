document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	
	// var timeoutHandle;
	
	var retryButton = document.getElementById("retry");		
	var settingsButton = document.getElementById("settings");	
	var progressBar = document.getElementById("progress");
	
	console.log("Ready");

	plugins.provisioning.registerCacheUpdates(function(data) {
	    if( data.state == 0 ) {
	        setProgress(data.detail / 2);
	    }
	    if( data.state == 8 ) {
            setProgress(50 + (data.detail / 2));
  	    }
  	    if( data.state == 4 ) {
  	        plugins.provisioning.swapCache(function(result) {
  	            console.log("Swapped");
  	           	plugins.provisioning.unregisterCacheUpdates(function(data) {
					startApp();
  	            }, function() {
  	            	// Fail
  	            }, "start");
  	        }, function() {
  	            // Fail
  	        });
  	    }
  	    if( data.state == 2 ) {
  	    	// Have already seen update
  	    	console.log("Already up to date");
  	    	startApp();
  	    }
		if( data.state == 9 ) {
  	    	// Have already seen update
  	    	console.log("Failed");
  	    	failed();
  	    }
	}, function() {
	    // Fail
	}, "start");

	plugins.provisioning.start(function(data) {
		// Success
	}, function() {
		// Fail
	});
	
	function failed() {
		// clearTimeout(timeoutHandle);
		
		showButtons();		

		progressBar.className = progressBar.className.replace(/\bprogress__indeterminate\b/,'');
		progressBar.MaterialProgress.setProgress(0);
		
		retryButton.addEventListener("click", function() {
			hideButtons();
			
			progressBar.className = progressBar.className + " progress__indeterminate";
			
			plugins.provisioning.start(function(data) {
				// Success
			}, function() {
				// Fail
			});
		});
		
		if(plugins.settingsUi != undefined) {		
			showButtons();
			
			settingsButton.addEventListener("click", function() {
				plugins.settingsUi.open(function() {
					hideButtons();
					plugins.provisioning.start(function(data) {
						// Success
					}, function() {
						// Fail
					});
				});
			});
		}
	}

	function hideButtons() {
		if(settingsButton.className.indexOf("hidden") < 0 ) {		
			settingsButton.className = settingsButton.className + " hidden";
		}
		if(retryButton.className.indexOf("hidden") < 0 ) {		
			retryButton.className = retryButton.className + " hidden";
		}
	}

	function showButtons() {
		retryButton.className = retryButton.className.replace(/\bhidden\b/,'');		
		settingsButton.className = settingsButton.className.replace(/\bhidden\b/,'');
	}

	function setProgress(percentage) {
		progressBar.className = progressBar.className.replace(/\bprogress__indeterminate\b/,'');
		progressBar.MaterialProgress.setProgress(percentage);
		//clearTimeout(timeoutHandle);
		hideButtons();
	}

	function startApp() {
		plugins.provisioning.switchToApp(function(data) {
			// OK
		}, function() {
			// Fail
		});
	}
	
	// timeoutHandle = setTimeout(failed, 10000);
}


