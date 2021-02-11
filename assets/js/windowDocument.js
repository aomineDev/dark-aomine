// WINDOW / DOCUMENT EVENTS

// Completely Loaded
window.addEventListener('load', function() {
	// Header Height
	headerH = $header.offsetHeight;

	// Loading
	$loading.style.opacity = '0';
	setTimeout(()=>{
		$loading.style.display = 'none';
	}, 500);
	NProgress.done();

	// ScrollSpy
	spySections();
});

//DOM Loaded
window.addEventListener('DOMContentLoaded', function() {

		//AOS
		AOS.init();
		
		// Window resize
		window.addEventListener('resize', function(){
		// ScrollSpy
		spySections();
		spyScroll();
	});

	//Document Scroll
	document.addEventListener('scroll', function(){
		// ScrollSpy
		spyScroll();

		// Cambiar color
		if(scrollPosition > 0){
			$header.classList.add('header-active');
		}else{
			$header.classList.remove('header-active');
		}
	})
});


