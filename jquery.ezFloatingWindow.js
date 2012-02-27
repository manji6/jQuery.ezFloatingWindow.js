"use strict";
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

	//extended parameter.
	var option = jQuery.extend(true,{},{
		'overlayId': 'floatingWindow-overlay',
		'overlayCss': {
			'opacity':    0.5,
			'position':  'fixed',
			'left':      '0px',
			'top':       '0px',
			'background-color':     '#666'
		},
		'containerId': 'floatingWindow-container',
		'containerCss': {
			'display':   'none',
			'width':     '300px',
			'position':  'fixed',
			'border':    '1px solid #cfcfcf',
			'background':'#fafafa'
		},
		'containerTo': 'body',
		'contentsElement': '#floatingWindow-contents',
		'z-index': 1000,
		'show': function(elements){
			jQuery(elements.overlay).fadeIn(150,function(){
				jQuery(elements.container).slideDown();
			});
		},
		'hide': function(elements,finish){
			jQuery(elements.container).slideUp(function(){
				jQuery(elements.overlay).fadeOut(150,function(){
					finish();
				});
			});
		},
		'escClose': true,
		'autoPosition': true,
		'overlayClose': true,
		'displayMode': 'absolute',
		'closeClass': 'floatingWindow-close'
	},opt);


	//set parameter
	var dom_body = document.getElementsByTagName("body").item(0);
	var dom_element = this;

	//Window対象要素を一旦非表示に
	$(option.contentsElement).hide();

	// -------

		//create overlayLayer
		var dom_overlay = document.createElement('div');
		option.overlayCss.height = window.innerHeight + 'px';
		option.overlayCss.width  = window.innerWidth + 'px';
		option.overlayCss['z-index'] = option['z-index'] + 1;
		option.overlayCss.display = 'none';

		dom_overlay.id = option.overlayId;
		jQuery(dom_overlay).css(option.overlayCss);
		dom_body.appendChild(dom_overlay);


		// create floatngWindow
		option.containerCss['z-index'] = option['z-index'] + 10;
		var dom_container = document.createElement('div');
		dom_container.id = option.containerId;
		// 非表示状態でshow()
		jQuery(dom_container).css(option.containerCss).html(jQuery(option.contentsElement).clone().attr('id','').show());
		jQuery(option.containerTo).append(jQuery(dom_container));

		// switch "displayMode"
		var target_offset = jQuery(dom_element).offset();

		if(option.displayMode === 'absolute') {

			jQuery('#'+option.containerId).css({
				'position': 'fixed',
				'left': (window.innerWidth - option.containerCss.width.substr(0,option.containerCss.width.length-2)) / 2
			});

		}else if(option.displayMode === 'fixed') {

			jQuery('#'+option.containerId).css({
				'position': 'fixed',
				'left': (window.innerWidth - option.containerCss.width.substr(0,option.containerCss.width.length-2)) / 2
			});

		}else if(option.displayMode === 'related left') {

			jQuery('#'+option.containerId).css({
				'position': 'absolute',
				'top': target_offset.top + jQuery(dom_element).outerHeight(true),
				'left': target_offset.left
			});

		}else if(option.displayMode === 'related right') {

			jQuery('#'+option.containerId).css({
				'position': 'absolute',
				'top': target_offset.top + jQuery(dom_element).outerHeight(true),
				'left': (target_offset.left + jQuery(dom_element).outerWidth(true)) - jQuery('#'+option.containerId).outerWidth(true)
			});

		}else if(option.displayMode === 'relative'){

			jQuery('#'+option.containerId).css({
				'position': 'relative'
			});
		}


	//Event - show floatingWindow
	jQuery(this).click(function(ev) {

		//cancel native event
		ev.preventDefault();

		// show event
		option.show.call(this,{'overlay': jQuery('#'+option.overlayId),'container': jQuery('#'+option.containerId)});

		// if conainer position is out of window, fixed.
		if(option.autoPosition === true && option.containerCss.left < 0){
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
					_deleteWindow();
				}
			});
		}
	});

	// display remove function
	var _deleteWindow = function(){
		option.hide.call(this,{'overlay': jQuery('#'+option.overlayId),'container': jQuery('#'+option.containerId)},function(){
			jQuery('#'+option.containerId).hide();
			jQuery('#'+option.overlayId).hide();
			jQuery('.'+option.closeClass).unbind('click');
			jQuery('#'+option.overlayId).unbind('click');
		});

	}
};

