function ScreenWizard( options ){

	var self = this,
		steps = [],
		currentStep = 0,
		fog = null,
		hint = null,
		buttonStringNum = 0,
		defaults = {
			buttonStrings: [
				'Понятно',
				'Дальше',
				'Ок',
				'Ясно'
			],
			fogPadding: 4,
			autostart: true,
			stopOnOverlayClick: true,
			showOnce: true,
			hintHtml: '<div class="wizard-hint-str"></div><a href="#" class="wizard-hint-button">Ok</span></a>'
		},
		playedBefore = false,
		playedPaths = [];

	this.init = function(){
		self.getOptions();
		if( options.autostart && ( !playedBefore || !options.showOnce) ){
			self.start();
		}
	};

	this.getOptions = function(){
		options = options || {};
		for( var key in defaults ){
			if( !(key in options) ){
				options[key] = defaults[key];
			}
		}

		if( 'wizardPlayed' in localStorage ){
			playedPaths = JSON.parse( localStorage.wizardPlayed );
			if( playedPaths.indexOf( location.pathname ) !== false ){
				playedBefore = true;
			}
		}

	};

	this.start = function(){
		currentStep = 0;
		buttonStringNum = 0;
		window.scrollTo(0,0);
		self.getSteps();

		if( steps.length ){
			document.body.style.overflow = "hidden";
			self.showHint( steps[0] );
		}
	};

	this.getSteps = function(){
		var nodes = document.querySelectorAll('[data-wizard]');
		steps = [];
		nodes.forEach(function( e ){
			steps.push( e );
		});
		steps.sort(function( a, b ){
			return (a.dataset.index || 0) > (b.dataset.index || 0) ? 1 : -1;
		});

	};

	this.showHint = function( e ){
		e.classList.add("wizard-active");
		var rect = e.getBoundingClientRect();
		self.setFogBounds( rect );
		self.setHint( e.dataset.wizard, rect );

	};

	this.setHint = function( str, rect ){
		if( !hint ){
			self.createHint();
		}
		hint.text.innerHTML = str;
		hint.container.style.left = (rect.left + rect.width/2) + "px";
		hint.container.style.top = rect.bottom + "px";
	};

	this.createHint = function(){
		var container = document.createElement("div");
		container.className = "wizard-hint";
		container.innerHTML = options.hintHtml;
		document.body.appendChild( container );

		hint = {
			text: container.querySelector(".wizard-hint-str"),
			button: container.querySelector(".wizard-hint-button"),
			container: container
		};
		hint.button.innerHTML = options.buttonStrings[buttonStringNum];
		hint.button.addEventListener("click", self.nextHint );

		setTimeout(function(){
			hint.container.classList.add('active');
		}, 1000 );
	};

	this.nextHint = function(){
		steps[currentStep].classList.remove("wizard-active");
		currentStep++;
		if( steps.length > currentStep ){
			self.showHint( steps[currentStep] );
			self.nextHintButton();
		}
		else{
			self.exitWizard();
		}
	};

	this.nextHintButton = function(){
		buttonStringNum++;
		if( options.buttonStrings.length <= buttonStringNum ){
			buttonStringNum = 0;
		}
		hint.button.innerHTML = options.buttonStrings[buttonStringNum];
	};

	this.exitWizard = function(){
		playedPaths.push( location.pathname );
		localStorage.wizardPlayed = JSON.stringify( playedPaths );

		fog.container.remove();
		hint.container.remove();
		fog = null;
		hint = null;
		document.body.style.overflow = "auto";
	};

	this.setFogBounds = function( rect ){
		if( !fog ){
			self.createFog();
		}
		fog.top.style.height = (rect.top - options.fogPadding) + "px";
		fog.bottom.style.top = (rect.bottom + options.fogPadding) + "px";

		fog.left.style.width = (rect.left - options.fogPadding) + "px";
		fog.left.style.height = (rect.height + 2*options.fogPadding) + "px";
		fog.left.style.top = (rect.top - options.fogPadding) + "px";

		fog.right.style.left = (rect.right + options.fogPadding) + "px";
		fog.right.style.height = fog.left.style.height;
		fog.right.style.top = fog.left.style.top;

	};

	this.createFog = function(){
		var container = document.createElement("div");
		container.className = "wizard-fog";
		container.innerHTML = '<div class="wizard-fog-top"></div><div class="wizard-fog-right"></div><div class="wizard-fog-bottom"></div><div class="wizard-fog-left"></div>';
		document.body.appendChild( container );

		fog = {
			top: container.querySelector(".wizard-fog-top"),
			right: container.querySelector(".wizard-fog-right"),
			bottom: container.querySelector(".wizard-fog-bottom"),
			left: container.querySelector(".wizard-fog-left"),
			container: container
		};

		setTimeout(function(){
			fog.container.classList.add('active');
		}, 1000 );

		if( options.stopOnOverlayClick ){
			fog.left.addEventListener("click", self.exitWizard );
			fog.right.addEventListener("click", self.exitWizard );
			fog.top.addEventListener("click", self.exitWizard );
			fog.bottom.addEventListener("click", self.exitWizard );
		}
	};

	self.init();

	return this;
}