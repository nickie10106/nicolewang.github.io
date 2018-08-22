;(function($) {

	"use strict";

	var this_clicked_id,
		this_clicked_href,
		nav_whatpage,
		nav_where_to_go,
		nav_this_page_id,
		nav_current,
		current_position_in_nav,
		page_nav_btn,
		header_h,
		header_margin_top,
		header_all,
		transition_active,
		whatpage_in_nav,
		page_count,
		page_move,
		page_count_click,
		page_count_click_all,
		this_href,
		this_article,
		show_mouse_icon,
		each_page,
		runing_move,
		wheelCount,
		wheelonTop,
		newDatewheel,
		oldDatewheel,
		swipe_down_count,
		swipe_already_has,
		scrollbar_result,
		scroll_count,
		preventIpadgesture,
		animEndEventName,
		ignoreScrollEvents,
		top_on_start,
		bottom_on_start,
		moveX,
		moveY,
		elapsedTime;

	/* touch vars start */

	var touch_delta,
		touch_distX,
		touch_distY,
		touch_startX,
		touch_global_startX,
		touch_global_startY,
		touch_startY,
		touch_global_startendY,
		touch_global_startendX,
		touch_startTime,
		touch_global_resultX,
		touch_global_resultY,
		touch_elapsedTime,
		touch_moveX,
		touch_moveY,
		touch_swipedirection,
		touch_directionX,
		touch_directionY,
		startX,
		startY;

	/* touch vars end */

	var carousel_idx,
		count_i,
		count_f,
		count_m,
		count_s,
		count_z;

	preloader_progress = 10;

	$(document).on('ready', function() {

		var body = $('body');

		body.on("click touchstart", function() {

			var opacity_temp = 0.25;

			if ($('footer').hasClass('social-open')) {

				$('.social-open .click').trigger('click');

			}

		});


		$(window).on('resize', function() {
			if (IE8 !== true) {
				breakpoint.refreshValue();
			}
		}).resize();

		if (breakpoint.value !== 'mobile' && isiPad !== true && isAndroid !== true) {

			$("article.scroller").wrap("<div class='scroller'></div>");
			$("article.scroller").removeClass("scroller");
			$(".scroller").append("<div class='scroller__bar'></div>");

			baron($('.content, .menu'), {
				scroller: '.scroller',
				container: 'article',
				bar: '.scroller__bar',
				barOnCls: 'scroller__bar_state_on'
			});

		}

		$.fn.hasScrollBar = function() {
			var scroll = this.get(0).scrollHeight;
			var h = this.height();
			scrollbar_result = scroll - h;
			var this_scroll_fix = header_margin_top + 5;

			if (isiPad === true) {
				scrollbar_result = scrollbar_result - 54; /* Ipad fix */
			}

			if (scrollbar_result < this_scroll_fix) {
				return false;
			} else {
				return true;
			}
		}

		var header = document.getElementsByTagName("header")[0];
		var footer = document.getElementsByTagName("footer")[0];

		function header_init() {

			header_h = header.offsetHeight;
			header_margin_top = header.currentStyle || window.getComputedStyle(header);
			header_margin_top = $('header').css('top');
			header_margin_top = Number(header_margin_top.replace(/[^\/\d]/g, ''));

			header_all = header_h + header_margin_top + 2;

			if (breakpoint.value !== 'mobile') {
				$("section .wrapper-scroll").css('padding-top', '' + header_all + 'px');
				$("section .scroller__bar").css('margin-top', '' + header_all + 'px');
				$(".content > article").css('top', '' + header_all + 'px');
			} else {
				$(".index .wrapper-scroll").css('padding-top', '' + (header_all + header_margin_top) + 'px');
				$(".index .wrapper-scroll article").css('padding-bottom', '' + (header_all) + 'px');
			}

			$('header .logo').attr('style', 'opacity: 1; pointer-events: none');

		}

		header_init();

		function footer_init() {

			if ($('.pt-page-current .scroller').hasScrollBar() === true) {
				$(this).addClass('scroll-top');
				footer.classList.add('hide');
				footer.classList.add('z-index--1');
			} else {
				$(this).removeClass('scroll-top');
				footer.classList.remove('hide');
				footer.classList.remove('z-index--1');
			}
			if (breakpoint.value == 'mobile') {
				footer.classList.remove('hide');
				footer.classList.remove('z-index--1');
			}
		}

		$('.page-nav-btn').on("click", function(event) {

			if (breakpoint.value == 'mobile') {
				var offset = $('' + $.attr(this, 'href') + '').offset();
				if (offset !== undefined) {
					var duration = offset.top / 1.15;
				}
				$('html, body').animate({
					scrollTop: $($.attr(this, 'href')).position().top
				}, duration);

			}
			return false;
		});

		function Prepare_Page_For_Scroll() {

			var select_content = document.querySelectorAll(".scroller");
			for (var count_m = 0; count_m < select_content.length; count_m++) {
				if ($(select_content[count_m]).hasScrollBar() == true) {
					select_content[count_m].classList.add('scroll-top');
				}
			}
		}

		Prepare_Page_For_Scroll();

		$('footer').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
			if ($(this).css('opacity') == 0) {
				this.classList.add('z-index--1');
				this.classList.remove('z-index-2');
			}
		});

		$('footer').on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() {
			this.classList.remove('hide');
		});

		$('.social-btn ul').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
			if (!$(this).hasClass('vis-1')) {
				$(this).children('li').children('a').hide();
			}
		});

		transition_active = '0';

		page_count_click = 0;
		page_count_click_all = 0;

		var owl_item_drag = 0;
		var owl_item_translate = 0;

		var owl = $(".carousel");

		$('.carousel, .demo-carousel').on('initialized.owl.carousel', function(e) {
			carousel_idx = e.item.index;
			$(this).find('.owl-item').eq(carousel_idx + 1).addClass('big');
			$(this).find('.owl-item').eq(carousel_idx).addClass('prev');
			$(this).find('.owl-item').eq(carousel_idx + 2).addClass('next');

		});

		$('.carousel, .demo-carousel').on('translate.owl.carousel', function(e) {

			owl_item_translate = 1;

			if (owl_item_drag !== 1) {
				carousel_idx = e.item.index;
				$(this).find('.owl-item.big').removeClass('big');
				$(this).find('.owl-item.next').removeClass('next');
				$(this).find('.owl-item.prev').removeClass('prev');
				$(this).find('.owl-item').eq(carousel_idx + 1).addClass('big');
				$(this).find('.owl-item').eq(carousel_idx).addClass('prev');
				$(this).find('.owl-item').eq(carousel_idx + 2).addClass('next');
			}
		});

		$('.carousel, .demo-carousel').on('translated.owl.carousel', function(e) {
			owl_item_translate = 0;
		});

		$('.demo-carousel').owlCarousel({

			autoplay: false,
			autoplaySpeed: 2000,
			dotsSpeed: 1000,
			smartSpeed: 1000,
			loop: true,
			nav: true,
			dots: true,
			dotsEach: 1,
			callbacks: false,
			margin: 30,
			navText: [
				"<a class=\"arrow prev\"></a>",
				"<a class=\"arrow next\"></a>"
			],
			items: 1,
			responsive: {
				768: {
					items: 1
				},
				992: {
					items: 3
				}
			}
		});

		$('.carousel').owlCarousel({

			autoplay: false,
			autoplaySpeed: 2000,
			dotsSpeed: 1000,
			loop: true,
			nav: true,
			dots: true,
			dotsEach: 1,
			callbacks: false,
			margin: 30,
			navText: [
				"<a class=\"arrow prev\"></a>",
				"<a class=\"arrow next\"></a>"
			],
			items: 1,
			responsive: {
				768: {
					items: 1
				},
				1008: {
					items: 3
				}
			}
		});

		if (breakpoint.value !== 'tablet' && breakpoint.value !== 'mobile') {
			$(document).on('click', '.prev', function() {
				$(this).parent().parent().trigger('prev.owl.carousel');
			});

			$(document).on('click', '.next', function() {
				$(this).parent().parent().trigger('next.owl.carousel');
			});
		}

		$('.close').on("click", function() {
			if (breakpoint.value == 'mobile') {
				setTimeout(function() {
					ignoreScrollEvents = 'false';
				}, 1600);

			}
		});

		var nav_arr = [],
			pages_arr = [];

		each_page = document.getElementsByClassName("pt-page");
		page_nav_btn = document.getElementsByClassName("page_nav_btn");

		$("nav .page-nav-btn").each(function(index) {
			$(this).attr('data-id', index);
			this_href = $(this).attr("href");
			this_href = this_href.substring(1);
			nav_arr.push(this_href);

			for (var count_i = 0; count_i < each_page.length; count_i++) {
				if (this_href == each_page[count_i].id) {
					pages_arr[count_i] = this_href;
				}
			}
		});

		function currentPosition() {
			var nav_this_page_id = '';
			nav_this_page_id = document.getElementsByClassName('pt-page-current')[0].id;

			for (var count_m = 0; count_m < nav_arr.length; count_m++) {
				if (nav_this_page_id == nav_arr[count_m]) {
					current_position_in_nav = count_m;
				}
			}
		}

		$('.menu a').on('click', function() {
			$('.menu a').removeClass("active");
			$(this).addClass("active");
		});


		function menu() {

			if ($(".menu").css('opacity') == 0) {

				if (isiPad === true) {
					$('section article').addClass('translate-hide');
				}

				document.body.classList.add('menu-hack');

				$(".menu, .menu .close").toggleClass("z-index-3");

				$(".menu").one(transitionEvent, function(event) {
					if (breakpoint.value == 'mobile') {
						$('html').css('overflow', 'hidden');
						ignoreScrollEvents = 'true';
					}
				});

			} else {

				if (isiPad === true) {
					$('section article').removeClass('translate-hide');
				}

				$(".menu").one(transitionEvent, function(event) {
					$(".menu, .menu .close").toggleClass("z-index-3");
					if (breakpoint.value == 'mobile') {
						document.body.classList.remove('menu-hack');
						$('html').css('overflow', 'auto');
					}
				});

				if (document.all && !window.atob || document.all && !document.addEventListener) {
					// IE9 and lower
					$(".menu, .menu .close").toggleClass("z-index-3");
				}
			}
			$(".menu, .menu .close").toggleClass("visible");
		}

		$('.close').on("click", function() {
			if (breakpoint.value == 'mobile') {
				ignoreScrollEvents == false;
			}
		});

		$('.open-menu, .menu .close').on("click", function(event, elem) {
			event.preventDefault();
			menu();
		});

		function Check_If_Wheel_Bottom() {

			var scroll_fix = 0;
			if (typeof(window.chrome) === 'object') {
				scroll_fix = 5;
			}

			var this_article = document.querySelectorAll(".pt-page-infocus .scroller")[0];

			if (this_article !== undefined) {
				if ($('.pt-page-infocus .scroller').scrollTop() + $('.pt-page-infocus .scroller').innerHeight() + scroll_fix >= this_article.scrollHeight) {
					$('.pt-page-infocus .scroller').addClass('scroll-bottom');
					footer.classList.remove('z-index--1');
					footer.classList.remove('hide');
				}
			}
		}


		var PageTransitions = (function() {

			var wheelonTop = 'false';
			show_mouse_icon = 1;

			var $main = $('main'),
				$pages = $main.children('section.pt-page'),
				$iterate = $('.page-nav-btn'),
				animcursor = 1,
				pagesCount = $pages.length,
				isAnimating = false,
				endCurrPage = false,
				endNextPage = false,
				animEndEventNames = {
					'WebkitAnimation': 'webkitAnimationEnd',
					'OAnimation': 'oAnimationEnd',
					'msAnimation': 'MSAnimationEnd',
					'animation': 'animationend'
				};
			animEndEventName = animationEvent;

			function init() {
				page_count = -1;
				$pages.each(function() {
					var $page = $(this);
					$page.data('originalClassList', $page.attr('class'));

					if (this.id == nav_arr[0]) {
						nav_current = (page_count + 1);
					}
					page_count++;
				});

				runing_move = 0;
				$pages.eq(nav_current).addClass('pt-page-current pt-page-infocus');

				$iterate.on('click', function(event) {

					if (runing_move == 0) {

						event.preventDefault();
						$pages.eq(nav_current).removeClass('pt-page-infocus');
						show_mouse_icon = 0;

						runing_move = 1;
						transition_active = '1';

						if (this.getAttribute('data-id') == -1) { // if scroll

							if (typeof(page_move) == 'undefined' && !$(this).hasClass("logo")) { // if click mouse button at the first screen
								whatpage_in_nav = 1;
								page_move = 2;
							}

							for (var count_s = 0; count_s < pages_arr.length; count_s++) {
								if (nav_arr[whatpage_in_nav] == pages_arr[count_s]) {
									nav_whatpage = count_s;
									nav_where_to_go = nav_arr[whatpage_in_nav];
								}
							}

							nextPage(page_move);

						} else { // if transition from menu

							currentPosition();

							this_clicked_id = this.getAttribute('data-id');
							this_clicked_href = nav_arr[this_clicked_id];

							for (var count_f = 0; count_f < pages_arr.length; count_f++) {
								if (this_clicked_href == pages_arr[count_f]) {

									nav_whatpage = count_f;
									nav_where_to_go = this_clicked_href;

									if (!$(this).hasClass('no-menu')) {
										menu();
									}

									if (nav_this_page_id !== nav_where_to_go) {

										if (current_position_in_nav > this_clicked_id) {
											nextPage(1);
										}

										if (current_position_in_nav < this_clicked_id) {
											nextPage(2);
										}

									} else {

										runing_move = 0;
										transition_active = 0;

									}

								}
							}

						}

					}

				});

			}

			function hide_social() {
				if ($('footer').hasClass("social-open")) {
					$('footer').removeClass("social-open");
					$('footer .social-btn ul').removeClass("vis-1");
					$('footer a.show').removeClass("click");
				}
			}

			function nextPage(options) {

				if (show_mouse_icon == 0) {
					$('footer .page-nav-btn').addClass('smooth-hide');
					setTimeout(function() {
						$('footer .page-nav-btn').hide();
					}, 200);
				}

				$('header .logo').removeAttr('style');

				for (var count_z = 0; count_z < nav_arr.length; count_z++) {
					if (nav_where_to_go == nav_arr[count_z] && count_z == 0) {
						$('header .logo').attr('style', 'opacity: 1; pointer-events: none');
					}
				}

				$('#' + nav_where_to_go + ' .owl-carousel').removeClass('translate-hide');

				if (document.getElementsByClassName('pt-page-current')[0].id != nav_where_to_go) {

					header.classList.add('animate');
				}

				if ($('#' + nav_where_to_go + ' .scroller').hasScrollBar() === true) {


					footer.classList.add('hide');
					hide_social();

				} else {

					if ($('footer').css('opacity') == 0) {
						//if (getComputedStyle(footer)['opacity'] == 0) {  / use this line instead, when you dont need IE8 (for better perfomance)

						footer.className = "";
						footer.classList.add('animate-transparent-began');
						hide_social();

					} else {
						footer.classList.add('animate');
						hide_social();
					}
				}

				var animation = (options.animation) ? options.animation : options;

				if (isAnimating) {
					return false;
				}

				isAnimating = true;

				var $currPage = $pages.eq(nav_current);

				if (options.showPage) {
					if (options.showPage < pagesCount - 1) {
						nav_current = options.showPage;
					} else {
						nav_current = nav_whatpage;
					}
				} else {
					if (nav_current < pagesCount - 1) {
						nav_current = nav_whatpage;
					} else {
						nav_current = nav_whatpage;
					}
				}

				var $nextPage = $pages.eq(nav_current).addClass('pt-page-current'),
					outClass = '',
					inClass = '';

				switch (animation) {

					case 1:
						outClass = 'pt-page-moveToBottom';
						inClass = 'pt-page-moveFromTop';
						break;
					case 2:
						outClass = 'pt-page-moveToTop';
						inClass = 'pt-page-moveFromBottom';
						break;
				}

				$currPage.addClass(outClass).on(animEndEventName, function() {
					$currPage.off(animEndEventName);
					endCurrPage = true;
					if (endNextPage) {
						onEndAnimation($currPage, $nextPage);
					}
				});

				$nextPage.addClass(inClass).on(animEndEventName, function() {
					$nextPage.off(animEndEventName);
					endNextPage = true;
					if (endCurrPage) {
						onEndAnimation($currPage, $nextPage);
					}
				});

				if (document.all && !window.atob) { // IE9 and lower check
					onEndAnimation($currPage, $nextPage);
				}
			}

			function onEndAnimation($outpage, $inpage) {

				$('#' + $outpage[0].id + ' .owl-carousel').addClass('translate-hide');

				endCurrPage = false;
				endNextPage = false;
				resetPage($outpage, $inpage);
				isAnimating = false;

				if (isMac === false) {
					runing_move = 0;
				} else {
					setTimeout(function() {
						runing_move = 0;
					}, 350);
				}

				transition_active = '0';

				header.classList.remove('animate');

				setTimeout(function() {
					header.classList.remove('animate');
				}, 1000);

				footer.classList.remove('animate');
				footer.classList.remove('animate-transparent-began');

				$('#' + $outpage[0].id + ' .scroller').scrollTop('0');
				$('#' + $outpage[0].id + ' .scroller').removeClass('scroll-bottom');

				Prepare_Page_For_Scroll();
				currentPosition();
				$pages.eq(nav_current).addClass('pt-page-infocus');

				setTimeout(function() {
					Check_If_Wheel_Bottom();
				}, 200);

				swipe_down_count = 0;
				swipe_already_has = 0;

				$('.pt-page-current article').focus();
			}

			function resetPage($outpage, $inpage) {
				$outpage.attr('class', $outpage.data('originalClassList'));
				$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
			}

			init();

			return {
				init: init,
				nextPage: nextPage,
			};

		})();

		window.addEventListener("resize", function() {
			header_init();
			footer_init();
		}, true);


		function articleOnScroll() {

			if (runing_move == 0) {
				var scroll_fix = 0;
				if (typeof(window.chrome) === 'object') {
					scroll_fix = 5;
				}

				if ($('.pt-page-current .scroller').hasScrollBar() === true) {
					if ($('.pt-page-current .scroller').hasClass('scroll-bottom')) {

						setTimeout(function() {
							if (transition_active == '0') {
								footer.classList.add('z-index-2');
								footer.classList.remove('hide');
							}
						}, 30);

					} else {

						setTimeout(function() {
							if (transition_active == '0') {
								footer.classList.add('hide');
							}
						}, 30);
					}
				}
			}
		}



		$('.scroller').on('scroll', function() {

			if (runing_move == 0) {

				if ($(this).parents('section').hasClass("pt-page-current")) {

					var scroll_fix = 0;
					if (typeof(window.chrome) === 'object') {
						scroll_fix = 5;
					}

					if ($(this).scrollTop() + $(this).innerHeight() + scroll_fix >= (this.scrollHeight - 10)) {
						$(this).addClass('scroll-bottom');
						setTimeout(function() {
							if (transition_active == '0') {
								footer.classList.add('z-index-2');
								footer.classList.remove('hide');
							}
						}, 30);
					} else {
						$(this).removeClass('scroll-bottom');
						setTimeout(function() {
							if (transition_active == '0') {
								footer.classList.add('hide');
							}
						}, 30);
					}

					if ($(this).scrollTop() == 0) {
						$(this).addClass('scroll-top');
					} else {
						$(this).removeClass('scroll-top');
					}
				}
			}

		});

		current_position_in_nav = 0;

		function wheel(x) {

			if (x == 2) {
				page_move = 2;
				if (nav_arr[current_position_in_nav] !== nav_arr[nav_arr.length - 1]) { // dont move bottom from last page
					whatpage_in_nav = Number(current_position_in_nav + 1);
				} else {
					whatpage_in_nav = 'undefined';
				}
			}

			if (x == 1) {
				page_move = 1;
				if (current_position_in_nav !== 0) { // dont move to the top from first page
					whatpage_in_nav = Number(current_position_in_nav - 1);
				} else {
					whatpage_in_nav = 'undefined';
				}
			}

			if (whatpage_in_nav !== 'undefined') {
				$('span.page-nav-btn').trigger('click');
			}

			wheelCount = 0;

			return false;

		}

		function wheelPages(scroll) {
			if (!$('.menu').hasClass('visible')) {
				if (scroll == 1) {
					if (touch_delta < 0) {
						if ($('.pt-page-current .scroller').hasClass("scroll-bottom")) {
							wheelonTop = 'false';
							wheelCount++;
							if (wheelCount > 1 && typeof(window.chrome) !== 'object') {
								wheel(2);
							}
							if (wheelCount > 2 && typeof(window.chrome) === 'object') {
								wheel(2);
							}
						}
					}

					if (touch_delta > 0) {
						if ($('.pt-page-current .scroller').hasClass("scroll-top")) {
							wheelonTop = 'true';
							wheelCount++;
							if (wheelCount > 1 && typeof(window.chrome) !== 'object') {
								wheel(1);
							}
							if (wheelCount > 2 && typeof(window.chrome) === 'object') {
								wheel(1);
							}
						}
					}

				} else {

					if (touch_delta > 0) {

						wheelonTop = 'true';
						wheelCount++;
						if (wheelCount > 1) {
							wheel(1);
						}
					}

					if (touch_delta < 0) {
						wheelonTop = 'false';
						wheelCount++;
						if (wheelCount > 1) {
							wheel(2);
						}
					}
				}
			}
		}

		wheelCount = 0;
		oldDatewheel = 0;

		function MouseWheelHandler(e) {
			if (runing_move == 0) {

				if (isTouch === true) {
					newDatewheel = new Date();

					if (oldDatewheel !== 0) {
						if ((newDatewheel.getTime() - oldDatewheel.getTime()) < 20) {
							return false;
						}
					}
					oldDatewheel = new Date();
				}

				e = window.event || e;
				touch_delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				if ($('.pt-page-current .scroller').hasScrollBar() == true) {
					wheelPages(1);
				} else {
					wheelPages(0);
				}
			}
		}

		if (document.addEventListener) {
			document.addEventListener("mousewheel", MouseWheelHandler, false);
			document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		} else {
			document.attachEvent("onmousewheel", MouseWheelHandler);
		}

		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '38') {
				if ($('.pt-page-current .scroller').hasClass("scroll-top")) {
					wheel(1);
				}
			}
			if (e.keyCode == '40') {
				if ($('.pt-page-current .scroller').hasClass("scroll-bottom")) {
					wheel(2);
				}
			}
		}

		document.onkeydown = checkKey;

		footer_init();

		$('.pt-page-current article').focus();
		swipe_down_count = 0;
		swipe_already_has = 0;

		function swipe() {

			if (touch_swipedirection == 'up') {
				wheelonTop = 'true';
				wheel(1);
			}

			if (touch_swipedirection == 'down') {
				wheelonTop = 'false';

				if ($('.pt-page-current .scroller').hasClass("scroll-bottom") && swipe_already_has == 0) {

					swipe_down_count++;

					if (swipe_down_count > 2) {
						wheel(2);
					}

				} else {

					wheel(2);

				}
			}
		}

		////////////////////////////////////////////////////////////////

		function convert2positive(num) {
			if (num < 0) {
				scrollbar_result = -1 * num;
			} else {
				scrollbar_result = num;
			}
			return scrollbar_result;
		}

		///////////////// DISABLE IPAD DEFAULT GESTURE ////////////////

		var article_touch_end = false;
		var article_touch_end_ipadfix = false;
		preventIpadgesture = 'true';

		setTimeout(function() {
			preventIpadgesture = 'false';
		}, 1000);

		if (isiPad === true) {
			var touchmoveprevent = function(m) {
				m.preventDefault();
			};
		}

		top_on_start = 0;
		bottom_on_start = 0;

		$(document).on('touchstart', function(e) {

			if (preventIpadgesture == 'true') {

				e.preventDefault();

			} else {

				touch_startTime = new Date().getTime();

				var e = e.originalEvent;
				touch_global_startX = e.touches[0].clientX;
				touch_global_startY = e.touches[0].clientY;

				if (isiPad === true) {
					document.addEventListener('touchmove', touchmoveprevent, false);
				}

			}

			if ($('.pt-page-current .scroller').hasClass("scroll-bottom")) {
				top_on_start = 0;
				bottom_on_start = 1;
			}

			if ($('.pt-page-current .scroller').hasClass("scroll-top")) {
				top_on_start = 1;
				bottom_on_start = 0;
			}

			article_touch_end = false;

		});

		$(document).on('touchmove', function(e) {

			var e = e.originalEvent;
			touch_global_startendX = e.touches[0].clientX;
			touch_global_startendY = e.touches[0].clientY;

			touch_global_resultX = touch_global_startX - touch_global_startendX;
			touch_global_resultY = touch_global_startY - touch_global_startendY;

			if (convert2positive(touch_global_resultX) > 0 && convert2positive(touch_global_resultY) > 0 && isiPad === true) {
				document.addEventListener('touchmove', touchmoveprevent, false);
			}

		});

		$('article').on('touchstart', function(e) {

			var e = e.originalEvent;
			touch_startX = e.touches[0].clientX;
			touch_startY = e.touches[0].clientY;

		});

		$('article').on('touchmove', function(m) {

			if (this.scrollHeight > this.clientHeight) {

				if (preventIpadgesture == 'false' && isiPad === true) {
					document.removeEventListener('touchmove', touchmoveprevent, false); // Only for pages with Scroll
				}

				var touchmove_s = m.originalEvent;
				touch_moveX = touchmove_s.touches[0].clientX;
				touch_moveY = touchmove_s.touches[0].clientY;

				touch_directionX = touch_startX - touch_moveX;
				touch_directionY = touch_startY - touch_moveY;

				if ($(this).hasClass('scroll-top') && $(".menu").css('opacity') == 0) {

					if (touch_directionY < 0 && isiPad == true) {

						m.preventDefault();
					}
				}

				if ($(this).hasClass('scroll-bottom') && $(".menu").css('opacity') == 0) {

					if (touch_directionY > 0 && isiPad === true) {

						m.preventDefault();
					}
				}

				if (isAndroidBrowser() == true) {
					if (touch_directionY > 15) {
						m.preventDefault();
					}
					if (touch_directionY < 0) {
						touch_directionY = touch_directionY * -1;
						if (touch_directionY > 15) {
							m.preventDefault();
						}
					}
				}


			}

		});

		$('article').on('touchend', function(e) {
			if (isiPad === true) {
				document.addEventListener('touchmove', touchmoveprevent, false);
			}
			scroll_count = 0;
			article_touch_end = true;

			if (article_touch_end_ipadfix == true) {
				article_touch_end = false;
			}

		});

		window.addEventListener("orientationchange", function() {
			$('.pt-page-current article').removeClass('scroll-bottom');
		}, false);

		/////////////////////  END OF DISABLE DEFAULT IPAD GESTURE ///////////////////////////
		if (IE8 !== true) {

			$("input").focus(function() {
				article_touch_end_ipadfix = true;
			});

			$("input").focusout(function() {
				article_touch_end_ipadfix = false;
			});

			$("textarea").focus(function() {
				article_touch_end_ipadfix = true;
			});

			$("textarea").focusout(function() {
				article_touch_end_ipadfix = false;
			});

			document.addEventListener('touchend', function(e) {

				if (article_touch_end === false) {
					return false;
				}

				var touchobj = e.changedTouches[0];

				touch_distX = touchobj.pageX - touch_startX;
				touch_distY = touchobj.pageY - touch_startY;

				if ($('.pt-page-current article').hasScrollBar() === true) {

					if ($('.pt-page-current article').hasClass('scroll-top') && touch_distY > 0 || $('.pt-page-current article').hasClass('scroll-bottom') && touch_distY < 0) {

						var threshold = 50;
						restraint = 350;
						allowedTime = 400;

					} else {

						var threshold = 240,
							restraint = 400,
							allowedTime = 400;

					}

				} else {

					var threshold = 100,
						restraint = 250,
						allowedTime = 400;

				}


				touch_elapsedTime = new Date().getTime() - touch_startTime;

				if (touch_elapsedTime <= allowedTime) { // first condition for awipe met
					if (Math.abs(touch_distX) >= threshold && Math.abs(touch_distY) <= restraint) { // 2nd condition for horizontal swipe met
						touch_swipedirection = (touch_distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
					} else if (Math.abs(touch_distY) >= threshold && Math.abs(touch_distX) <= restraint) { // 2nd condition for vertical swipe met
						touch_swipedirection = (touch_distY < 0) ? 'down' : 'up' // if dist traveled is negative, it indicates up swipe

						if ($(".menu").css('opacity') == 0) {

							if ($('.pt-page-current .scroller').hasScrollBar() == true) {

								if (touch_swipedirection == 'up') {

									if (top_on_start == '0') {
										return false;

									} else {
										swipe_down_count = 2;
										article_touch_end = false;
										swipe();
									}
								}

								if (touch_swipedirection == 'down') {

									if (bottom_on_start == '0') {
										return false;

									} else {
										swipe_down_count = 2;
										article_touch_end = false;
										swipe();
									}
								}

							} else {

								swipe_down_count = 2;
								article_touch_end = false;
								swipe();
							}

							top_on_start = 0;
							bottom_on_start = 0;

						}

					}
				}

			}, false)
		}

		if (is_IE_touch() === true) {

			document.addEventListener('pointerdown', function(e) {

				touch_startX = e.pageX;
				touch_startY = e.pageY;
				touch_startTime = new Date().getTime();

			}, false)


			document.addEventListener('pointermove', function(e) {

				touch_moveX = e.pageX;
				touch_moveY = e.pageY;

				touch_directionX = startX - moveX;
				touch_directionY = startY - moveY;

			}, false)


			document.addEventListener('pointerout', function(e) {

				touch_distX = e.pageX - startX;
				touch_distY = e.pageY - startY;

				var threshold = 75,
					restraint = 250,
					allowedTime = 400;

				touch_elapsedTime = new Date().getTime() - touch_startTime;

				if (elapsedTime <= allowedTime) { // first condition for awipe met
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
						touch_swipedirection = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
					} else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
						touch_swipedirection = (distY < 0) ? 'down' : 'up' // if dist traveled is negative, it indicates up swipe
						swipe_down_count = 2;
						article_touch_end = false;
						swipe();
					}
				}

			}, false)
		}


		preloader_progress = 25;

		if (breakpoint.value == 'desktop') {
			$('.demo-carousel a').on("click", function(event) {
				if (!$(this).closest('.owl-item').hasClass('big')) {
					event.preventDefault();
				}
			});
		}


		if (breakpoint.value == 'mobile') {

			$(document).on('scroll', function() {

				if ($(document).scrollTop() < 1) {

					$('.media-content-overlay').removeClass('media-content-hidden');
					$('div.slideshow, div.youtube-bg-video').removeClass('media-content-hidden');
					$('section.index').removeClass('media-bgimage-hidden');


				} else {

					$('.media-content-overlay').addClass('media-content-hidden');
					$('div.slideshow, div.youtube-bg-video').addClass('media-content-hidden');
					$('section.index').addClass('media-bgimage-hidden');


				}

			});
		}

		/* Count down  start */

		if ($('.clock').length !== 0) {

			var judgment_day = $('.clock').data('date');

			$("#day").countdown(judgment_day, function(event) {
				$(this).text(
					event.strftime('%D')
				);
			});

			$("#hour").countdown(judgment_day, function(event) {
				$(this).text(
					event.strftime('%H')
				);
			});

			$("#minutes").countdown(judgment_day, function(event) {
				$(this).text(
					event.strftime('%M')
				);
			});

			/* Count Down End */

			if (document.all && !window.atob || document.all && !document.addEventListener) {

				// IE9 & lower

				$("#seconds").countdown(judgment_day, function(event) {
					$(this).text(
						event.strftime('%S')
					);
				});


			} else {

				$('#day, #hour, #minutes').countdown('stop');

			}

		}

		$('#slideshow-fullscreen').owlCarousel({
			autoplay: true,
			autoplaySpeed: 4000,
			dotsSpeed: 4000,
			smartSpeed: 4500,
			fluidSpeed: 5000,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			loop: true,
			dotsEach: 1,
			callbacks: false,
			margin: 0,
			items: 1
		});

		if (body.hasClass('ken-burns')) {
			$('#ken-burns').smoothSlides({
				effectDuration: 4000,
				effect: 'zoomIn',
				navigation: false
			});
		}

		if (body.hasClass('video')) {

			if (breakpoint.value !== 'mobile' && breakpoint.value !== 'tablet') {
				$('body.video .youtube-bg-video').YTPlayer({
					videoId: 'zPWR6AyuZ2U'
				});
			} else {

			}
		}

		window.scrollTo(0, 0);

	});

})(jQuery);