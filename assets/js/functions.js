//FUNCIONES

// ScrollSpy

function spySections(){
	$section.forEach((e) => {
		sections[e.id] = e.offsetTop;
	});
}

function spyScroll(){
	scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
	for (let i in sections) {
		if (sections[i] <= scrollPosition + headerH) {
			document.querySelector('.nav-link-active').classList.remove('nav-link-active');
			document.querySelector('a[data-spy*=' + i + ']').classList.add('nav-link-active');
		}
	}
}