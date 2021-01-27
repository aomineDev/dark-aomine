// MEDIA QUERIES

document.addEventListener('DOMContentLoaded', function(){
	const breakpoint = window.matchMedia('only screen and (max-width: 767px)');
	const mql = e => {
		var instances;
		if (e.matches) {
			$nav.style.transform = 'translateX(-105%)';
			instances = M.Sidenav.init($nav);
			for(let i of $navItems){
				i.classList.add('waves', 'waves-light');
			}
		}else{
			$body.style.overflow = '';
			$nav.style.transform = 'translateX(0px)';
			instances = M.Sidenav.init(null);
			for(let i of $navItems){
				i.classList.remove('waves', 'waves-light');
			}
		}
	}

	breakpoint.addListener(mql);
	mql(breakpoint);
})

