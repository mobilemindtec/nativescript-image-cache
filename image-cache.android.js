
var application = require('application')

var ImageChache = (function(){

	function ImageChache(){
		this.init()
	}

	ImageChache.prototype.init = function(){

	  var context = application.android.context

		var config = new com.nostra13.universalimageloader.core.ImageLoaderConfiguration.Builder(context)
		  .threadPriority(java.lang.Thread.NORM_PRIORITY - 2)
		  .threadPoolSize(1)
		  .denyCacheImageMultipleSizesInMemory()
		  .discCacheFileNameGenerator(new com.nostra13.universalimageloader.cache.disc.naming.Md5FileNameGenerator())
		  .diskCacheSize(50 * 1024 * 1024)
		  .diskCacheFileCount(100)
		  .tasksProcessingOrder(com.nostra13.universalimageloader.core.assist.QueueProcessingType.LIFO)
		  .writeDebugLogs() // Not necessary in common
		  .build();

		// Initialize ImageLoader with configuration.
		com.nostra13.universalimageloader.core.ImageLoader.getInstance().init(config)

	}

  ImageChache.prototype.loadImage = function(args){

  	var imageUri = args.imageUri
  	var imageView = args.imageView.android
  	var callback = args.callback
  	var progressCallback = args.callback

  	var loader = com.nostra13.universalimageloader.core.ImageLoader.getInstance()

		loader.displayImage(imageUri, imageView, new com.nostra13.universalimageloader.core.listener.ImageLoadingListener({
		    
		    onLoadingStarted: function(imageUri, view) {
		    	if(callback){
			    	callback({
			    		event: 'started',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }
		    },
		    
		    onLoadingFailed: function(imageUri, view, failReason) {
		    	if(callback){
			    	callback({
			    		event: 'failed',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }		    
		    },
		    
		    onLoadingComplete: function(imageUri, view, loadedImage) {
		    	if(callback){
			    	callback({
			    		event: 'complete',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }		    
		    },
		    
		    onLoadingCancelled: function(imageUri, view) {
		    	if(callback){
			    	callback({
			    		event: 'cancelled',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }		    
		    },

		}), new com.nostra13.universalimageloader.core.listener.ImageLoadingProgressListener({
		    
		    onProgressUpdate: function(imageUri, view, current, total) {
		        if(progressCallback){
		        	progressCallback({
		        		imageUri: imageUri,
		        		view: view,
		        		current: current,
		        		total: total
		        	})
		        }
		    },
		}));

  }


})()



module.exports = ImageChache