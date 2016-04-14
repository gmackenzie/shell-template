document.addEventListener('deviceready', onDeviceReady, false);

	function startApp() {
		plugins.provisioning.switchToApp(function(data) {
			// OK
		}, function() {
			// Fail
		});
	}

    function onDeviceReady() {
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
    	}, function() {
    	    // Fail
    	}, "start");

		plugins.provisioning.start(function(data) {
			// Success
		}, function() {
			// Fail
		});
    }

    function setProgress(percentage)
    {
      var progressBar = document.getElementById("progress");
      progressBar.style.visibility = "visible";

      if (progress != null)
      {
        progressBar.value = percentage;
      }
    }

  function setUpdateReady()
  {
    window.location = "ctapp://switch";
  }

  function setNoUpdate()
  {
    // Should never be called.
  }

  function updateStatus( state, status ) {
	var element = document.getElementById("status");
	element.innerHTML = status;

	var element = document.getElementById("retrydiv");
	if( state == 2 ) {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}
  }

  function restart() {
	window.location = "ctapp://restart";
  }