// TODO: check on mobile
(function($) {
	function triggerEvent(target, originalEvent) {
		var e = $.Event('beforeClick', {button: originalEvent.button, originalEvent: originalEvent });
		$(target).trigger(e);
	}

	// use addEventListener on 'capturing phase' to catch an event before jQuery
	if (document.addEventListener) {
		document.addEventListener('click', function(e) {
			var jqEvent = $.event.fix(e);
			triggerEvent(e.target, e);
		}, true);
		
		return;
	}

	// fallback for old IEs (mostly): emulation using mouseup/mousdown
	var buttonStates = [];

	function getCommonAncestor(node1, node2) {
		// TODO: can I do better?
		var node1AndParents = [];
		while(node1) {
			node1AndParents.push(node1);
			node1 = node1.parentNode;
		}
		while(node2) {
			var commonAncestorIndex = node1AndParents.indexOf(node2);
			if (commonAncestorIndex !== -1) {
				return node1AndParents[commonAncestorIndex];
			}
			node2 = node2.parentNode;
		}
		return null;
	}

	$(document).on({
		mousedown: function(e) {
			buttonStates[e.button] = e.target;
		},
		mouseup: function(e) {
			var button = e.button;
			var mousedownTarget = buttonStates[button];
			var mouseupTarget = e.target;
			var target;

			if (mousedownTarget === mouseupTarget) {
				// same target, click!
				target = mousedownTarget;
			} else if (button === 0) {
				// if targets are not equal then target is their common ancestor
				target = getCommonAncestor(mousedownTarget, mouseupTarget);
			}

			if (target) {
				triggerEvent(target, e);
			}

			buttonStates[e.button] = null;
		}
	});
})(jQuery);