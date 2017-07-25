
var application = require('application')
var fs = require("file-system")

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

  	var imageFromFile = args.imageFromFile
  	var imageFromUrl = args.imageFromUrl
  	var imageLocation

  	var placeHolder = args.imagePlaceHolder
  	var errorHolder = args.imageErrorHolder

  	var nsImageView = args.imageView

  	var callback = args.callback
  	var progressCallback = args.callback

  	if(placeHolder){
  		placeHolder = nsPathResolver(placeHolder)
  	}

  	if(errorHolder){
  		errorHolder = nsPathResolver(errorHolder)
  	}

  	if(imageFromFile){
  		if(fs.File.exists(imageFromFile)){
  			imageLocation = imageFromFile
  		}
  	}

  	if(!imageLocation){
  		imageLocation = imageFromUrl
  	}

  	if(!imageLocation){
  		imageLocation = placeHolder
  	}

    if(placeHolder){
    	nsImageView.src = placeHolder
    }		    

  	var loader = com.nostra13.universalimageloader.core.ImageLoader.getInstance()

  	console.log("load image from " + imageLocation)

  	var imageView

  	if(!nsImageView){
  		imageView = new com.nostra13.universalimageloader.core.assist.ImageSize(100, 100)
  	}else{
  		imageView = nsImageView.android
  	}

		loader.loadImage(imageLocation, new com.nostra13.universalimageloader.core.listener.ImageLoadingListener({
		    
		    onLoadingStarted: function(imageUri, view) {
		    	console.log("# ImageLoader.onLoadingStarted")
		    	if(callback){
			    	callback({
			    		event: 'started',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }
		    },
		    
		    onLoadingFailed: function(imageUri, view, failReason) {
		    	console.log("# ImageLoader.onLoadingFailed")
		    	if(callback){
			    	callback({
			    		event: 'failed',
			    		imageUri: imageUri,
			    		view: view,
			    		failReason: failReason
			    	})
			    }

			    if(errorHolder){
			    	nsImageView.src = errorHolder
			    }		    
		    },
		    
		    onLoadingComplete: function(imageUri, view, loadedImage) {
		    	console.log("# ImageLoader.onLoadingComplete")
		    	if(callback){
			    	callback({
			    		event: 'complete',
			    		imageUri: imageUri,
			    		view: view,
			    		loadedImage: loadedImage
			    	})
			    }		    
		    },
		    
		    onLoadingCancelled: function(imageUri, view) {
		    	console.log("# ImageLoader.onLoadingCancelled")
		    	if(callback){
			    	callback({
			    		event: 'cancelled',
			    		imageUri: imageUri,
			    		view: view
			    	})
			    }		    
		    },

		}));

  }

  function nsPathResolver(path) {
  	
  	var currentApp = fs.knownFolders.currentApp()  
  	var newPath = path
  	if(path.indexOf("~/") > -1){
  		newPath = newPath.replace("~/", "")
  		newPath = fs.path.join(currentApp.path, newPath)
  	}

  	return newPath

  }

  return ImageChache

}())



module.exports = ImageChache