/* =====================================================
   CONSULTANT LANDING PAGE - JAVASCRIPT (jQuery)
   Each block below does one job and is commented,
   so you can remove or edit any feature easily.
   ===================================================== */

$(document).ready(function () {

  /* ---------------------------------------------------
     SETTINGS - change values here
     --------------------------------------------------- */
  var SETTINGS = {
    sliderSpeed: 5000,      // testimonial auto-change time (milliseconds)
    scrollOffset: 70,       // gap left above a section when you click a menu link
    counterSpeed: 2000,     // stats count-up duration (milliseconds)
    headerScrollAt: 60      // after how many px header turns white
  };


  /* ---------------------------------------------------
     1. STICKY HEADER - adds "scrolled" class on scroll
        (the look is controlled in style.css)
     --------------------------------------------------- */
  function handleHeader() {
    if ($(window).scrollTop() > SETTINGS.headerScrollAt) {
      $('#header').addClass('scrolled');
    } else {
      $('#header').removeClass('scrolled');
    }
  }


  /* ---------------------------------------------------
     2. MOBILE MENU - open / close
     --------------------------------------------------- */
  $('#menu-toggle').on('click', function () {
    $('#nav').slideToggle(250);
    // swap icon between bars and X
    $(this).find('i').toggleClass('fa-bars fa-xmark');
  });

  // close the menu after clicking a link (mobile only)
  $('#nav a').on('click', function () {
    if ($(window).width() <= 768) {
      $('#nav').slideUp(250);
      $('#menu-toggle i').removeClass('fa-xmark').addClass('fa-bars');
    }
  });

  // reset menu when screen is resized back to desktop
  $(window).on('resize', function () {
    if ($(window).width() > 768) { $('#nav').removeAttr('style'); }
  });


  /* ---------------------------------------------------
     3. SMOOTH SCROLL for all links starting with #
     --------------------------------------------------- */
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate(
        { scrollTop: target.offset().top - SETTINGS.scrollOffset + 1 },
        600
      );
    }
  });


  /* ---------------------------------------------------
     4. ACTIVE MENU LINK - highlights the current section
     --------------------------------------------------- */
  function highlightMenu() {
    var scrollPos = $(window).scrollTop() + SETTINGS.scrollOffset + 40;

    $('.nav-link').each(function () {
      var section = $($(this).attr('href'));
      if (section.length &&
          section.offset().top <= scrollPos &&
          section.offset().top + section.outerHeight() > scrollPos) {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
      }
    });
  }


  /* ---------------------------------------------------
     5. BACK TO TOP BUTTON
     --------------------------------------------------- */
  function handleToTop() {
    if ($(window).scrollTop() > 400) { $('#to-top').fadeIn(); }
    else { $('#to-top').fadeOut(); }
  }
  $('#to-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* ---------------------------------------------------
     6. SCROLL REVEAL - elements with class "reveal"
        fade in when they come into view.
        (To disable: remove class="reveal" from the HTML)
     --------------------------------------------------- */
  function revealOnScroll() {
    var windowBottom = $(window).scrollTop() + $(window).height();
    $('.reveal').each(function () {
      if ($(this).offset().top < windowBottom - 70) {
        $(this).addClass('show');
      }
    });
  }


  /* ---------------------------------------------------
     7. COUNTER ANIMATION - numbers in the stats bar
        Target number is set in HTML: data-target="250"
     --------------------------------------------------- */
  var counted = false; // makes sure it runs only once

  function startCounters() {
    var statsTop = $('.stats').offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();

    if (!counted && windowBottom > statsTop + 80) {
      counted = true;
      $('.counter').each(function () {
        var $this = $(this);
        $({ n: 0 }).animate({ n: $this.data('target') }, {
          duration: SETTINGS.counterSpeed,
          easing: 'swing',
          step: function () { $this.text(Math.floor(this.n)); },
          complete: function () { $this.text($this.data('target')); }
        });
      });
    }
  }


  /* ---------------------------------------------------
     8. TESTIMONIAL SLIDER
        Add / remove ".slide" blocks in HTML - dots are
        created automatically.
     --------------------------------------------------- */
  var $slides = $('.slide');
  var current = 0;
  var timer;

  // create one dot per slide
  $slides.each(function (i) {
    $('.dots').append('<span class="dot' + (i === 0 ? ' active' : '') + '"></span>');
  });
  var $dots = $('.dot');

  function showSlide(index) {
    current = index;
    $slides.removeClass('active').eq(index).addClass('active');
    $dots.removeClass('active').eq(index).addClass('active');
  }

  function nextSlide() {
    showSlide((current + 1) % $slides.length);
  }

  function startSlider() { timer = setInterval(nextSlide, SETTINGS.sliderSpeed); }

  // click on a dot to jump to that slide
  $dots.on('click', function () {
    clearInterval(timer);
    showSlide($(this).index());
    startSlider();
  });

  if ($slides.length > 1) { startSlider(); }


  /* ---------------------------------------------------
     9. CONTACT FORM - validation + submit
     --------------------------------------------------- */
  // helper: show error under a field
  function setError($field, message) {
    $field.addClass('invalid');
    $field.siblings('.error').text(message);
  }
  // helper: clear error
  function clearError($field) {
    $field.removeClass('invalid');
    $field.siblings('.error').text('');
  }

  // remove the error as soon as the user starts typing
  $('#contact-form input, #contact-form select, #contact-form textarea').on('input change', function () {
    clearError($(this));
  });

  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var $name = $('#name'), $email = $('#email'), $phone = $('#phone'),
        $service = $('#service'), $message = $('#message');

    // --- Validation rules (edit messages / rules here) ---
    if ($.trim($name.val()).length < 2) {
      setError($name, 'Please enter your name.'); valid = false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test($.trim($email.val()))) {
      setError($email, 'Please enter a valid email address.'); valid = false;
    }

    // phone is checked as 10-15 digits (spaces, +, - allowed)
    var phoneDigits = $phone.val().replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError($phone, 'Please enter a valid phone number.'); valid = false;
    }

    if ($service.val() === '') {
      setError($service, 'Please select a service.'); valid = false;
    }

    if ($.trim($message.val()).length < 10) {
      setError($message, 'Message should be at least 10 characters.'); valid = false;
    }

    if (!valid) { return; }

    /* --------------------------------------------------
       SEND THE DATA
       Right now this only shows a success message (demo).
       To receive real emails, use one of these options:

       Option A (easiest, free): create a form at formspree.io,
       then replace the URL below with your Formspree URL:

         $.ajax({
           url: 'https://formspree.io/f/YOUR_ID',
           method: 'POST',
           data: $('#contact-form').serialize(),
           dataType: 'json'
         }).done(function () { ...success code... })
           .fail(function () { ...error code... });

       Option B: send the data to your own backend (PHP, Node, etc.)
       using the same $.ajax() call with your own URL.
       -------------------------------------------------- */
    var $btn = $(this).find('button[type="submit"]');
    $btn.text('Sending...').prop('disabled', true);

    setTimeout(function () {                       // fake delay (remove with real code)
      $('#form-status').addClass('success')
        .text('Thank you! Your message has been sent. We will contact you soon.');
      $('#contact-form')[0].reset();
      $btn.text('Send Message').prop('disabled', false);

      // hide the message after 6 seconds
      setTimeout(function () { $('#form-status').text(''); }, 6000);
    }, 1200);
  });


  /* ---------------------------------------------------
     10. FOOTER YEAR - updates automatically every year
     --------------------------------------------------- */
  $('#year').text(new Date().getFullYear());


  /* ---------------------------------------------------
     RUN ON SCROLL + ON PAGE LOAD
     --------------------------------------------------- */
  function onScroll() {
    handleHeader();
    highlightMenu();
    handleToTop();
    revealOnScroll();
    startCounters();
  }

  $(window).on('scroll', onScroll);
  onScroll(); // run once when the page loads

});
