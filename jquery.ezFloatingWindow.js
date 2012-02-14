/*
 * jQuery.ezFloatingWindow.js
 *
 * @author manji6 <ryosuke.sawada@gmail.com>
 * @licence MIT Licence
 */


/**
 * set "floatingWindow"
 *
 * @param {Object} opt optionObject.
 * @this {Object}  targetElement
 */
jQuery.fn.ezFloatingWindow = function(opt) {

	//パラメーターの引継ぎ
	var option = jQuery.extend(true,{},{
		'overlayId': 'floatongWindow-overlay',
		'overlayCss': {
			'opacity':    0.5,
			'position':  'fixed',
			'left':      '0px',
			'top':       '0px'
		},
		'containerId': 'floatingWindow-container',
		'containerCss': {
			'width':     '300px',
			'position':  'fixed',
			'top':       '150px',
			'border':    '1px solid #cfcfcf',
			'background':'#fafafa'
		},
		'contentsElement': '#floatingWindow-contents',
		'z-index': 1000,
		'show': function(){},
		'escClose': true,
		'overlayClose': true,
		'displayMode': 'absolute',
		'closeClass': 'floatingWindow-close'
	},opt);


	//set parameter
	var dom_body = document.getElementsByTagName("body").item(0);
	var dom_element = this;

	//Window対象要素を一旦非表示に
	$(option.contentsElement).hide();


	//[Event]
	//イベント定義 floatingWindowを表示
	jQuery(this).click(function(ev) {

		//cancel native event
		ev.preventDefault();

		//create overlayLayer
		var dom_overlay = document.createElement('div');
		option.overlayCss.height = window.innerHeight + 'px';
		option.overlayCss.width  = window.innerWidth + 'px';
		option.overlayCss['z-index'] = option['z-index'] + 1;

		dom_overlay.id = option.overlayId;
		jQuery(dom_overlay).css(option.overlayCss);
		dom_body.appendChild(dom_overlay);


		// ^^ switch "displayMode"
		var target_offset = jQuery(dom_element).offset();

		if(option.displayMode === 'absolute') {

			option.containerCss.position = 'absolute';
			option.containerCss.left = (window.innerWidth - option.containerCss.width.substr(0,option.containerCss.width.length-2)) / 2;

		}else if(option.displayMode === 'fixed') {

			option.containerCss.position = 'fixed';
			option.containerCss.left = (window.innerWidth - option.containerCss.width.substr(0,option.containerCss.width.length-2)) / 2;

		}else if(option.displayMode === 'related left') {

			option.containerCss.position = 'absolute';
			option.containerCss.left = target_offset.left;
			option.containerCss.top = target_offset.top + jQuery(dom_element).height();

		}else if(option.displayMode === 'related right') {

			option.containerCss.position = 'absolute';
			option.containerCss.top = target_offset.top + jQuery(dom_element).height();
			option.containerCss.left = (target_offset.left + jQuery(dom_element).width()) - option.containerCss.width.substr(0,option.containerCss.width.length-2);
		}

		// create floatngWindow
		option.containerCss['z-index'] = option['z-index'] + 10;
		var dom_container = document.createElement('div');
		dom_container.id = option.containerId;
		jQuery(dom_container).css(option.containerCss).html(jQuery(option.contentsElement).clone().show());
		dom_body.appendChild(dom_container);


		// if conainer position is out of window, fixed.
		if(option.containerCss.left < 0){
			jQuery('#'+option.containerId).animate({'left':target_offset.left},'fast','swing');
		}


		// ----- Event Setting ----
		jQuery('.'+option.closeClass).bind('click',function(ev){
			ev.preventDefault();
			_deleteWindow();
		});

		if(option.overlayClose === true){
			jQuery('#'+option.overlayId).bind('click',function(ev){
				ev.preventDefault();
				_deleteWindow();
			});
		}

		// "ESC" press interface
		if(option.escClose === true){
			jQuery(document).keydown(function(e) {
				// ESCAPE key pressed
				if (e.keyCode == 27) {
					jQuery('#'+option.containerId).remove();
					jQuery('#'+option.overlayId).remove();
				}
			});
		}

	});

	function _deleteWindow(){
		jQuery('#'+option.containerId).remove();
		jQuery('#'+option.overlayId).remove();
	}

};
