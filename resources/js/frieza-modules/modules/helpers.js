let jqSparklineResize = false;
let jqSparklineTimeout;

export default class Helpers {

  static run(helpers, options = {}) {
    let helperList = {
      'bs-tooltip': () => this.bsTooltip(),
      'bs-popover': () => this.bsPopover(),

      'dm-toggle-class': () => this.dmToggleClass(),
      'dm-year-copy': () => this.dmYearCopy(),
      'dm-ripple': () => this.dmRipple(),
      'dm-print': () => this.dmPrint(),
      'dm-table-tools-sections': () => this.dmTableToolsSections(),
      'dm-table-tools-checkable': () => this.dmTableToolsCheckable(),

      'js-ckeditor': () => this.jsCkeditor(),
      'js-ckeditor5': () => this.jsCkeditor5(),
      'js-simplemde': () => this.jsSimpleMDE(),
      'js-highlightjs': () => this.jsHighlightjs(),
      'js-flatpickr': () => this.jsFlatpickr(),

      'jq-appear': () => this.jqAppear(),
      'jq-magnific-popup': () => this.jqMagnific(),
      'jq-slick': () => this.jqSlick(),
      'jq-datepicker': () => this.jqDatepicker(),
      'jq-masked-inputs': () => this.jqMaskedInputs(),
      'jq-select2': () => this.jqSelect2(),
      'jq-notify': (options) => this.jqNotify(options),
      'jq-easy-pie-chart': () => this.jqEasyPieChart(),
      'jq-maxlength': () => this.jqMaxlength(),
      'jq-rangeslider': () => this.jqRangeslider(),
      'jq-pw-strength': () => this.jqPwStrength(),
      'jq-sparkline': () => this.jqSparkline(),
      'jq-validation': () => this.jqValidation()
    };

    if (helpers instanceof Array) {
      for (let index in helpers) {
        if (helperList[helpers[index]]) {
          helperList[helpers[index]](options);
        }
      }
    } else {
      if (helperList[helpers]) {
        helperList[helpers](options);
      }
    }
  }

  static bsTooltip() {
    let elements = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]:not(.js-bs-tooltip-enabled), .js-bs-tooltip:not(.js-bs-tooltip-enabled)'));

    window.helperBsTooltips = elements.map(el => {

      el.classList.add('js-bs-tooltip-enabled');

      return new bootstrap.Tooltip(el, {
        container: el.dataset.bsContainer || '#page-container',
        animation: el.dataset.bsAnimation && el.dataset.bsAnimation.toLowerCase() == 'true' ? true : false,
      })
    });
  }

  static bsPopover() {
    let elements = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]:not(.js-bs-popover-enabled), .js-bs-popover:not(.js-bs-popover-enabled)'));

    window.helperBsPopovers = elements.map(el => {

      el.classList.add('js-bs-popover-enabled');

      return new bootstrap.Popover(el, {
        container: el.dataset.bsContainer || '#page-container',
        animation: el.dataset.bsAnimation && el.dataset.bsAnimation.toLowerCase() == 'true' ? true : false,
        trigger: el.dataset.bsTrigger || 'hover focus',
      })
    });
  }

  static dmToggleClass() {
    let elements = document.querySelectorAll('[data-toggle="class-toggle"]:not(.js-class-toggle-enabled), .js-class-toggle:not(.js-class-toggle-enabled)');

    elements.forEach(el => {
      el.addEventListener('click', () => {
        // Add .js-class-toggle-enabled class to tag it as activated
        el.classList.add('js-class-toggle-enabled');

        // Get all classes
        let cssClasses = el.dataset.class ? el.dataset.class.split(' ') : false;

        // Toggle class on target elements
        document.querySelectorAll(el.dataset.target).forEach(targetEl => {
          if (cssClasses) {
            cssClasses.forEach(cls => {
              targetEl.classList.toggle(cls);
            });
          }
        });
      });
    });
  }

  static dmYearCopy() {
    let elements = document.querySelectorAll('[data-toggle="year-copy"]:not(.js-year-copy-enabled)');

    elements.forEach(el => {
      let date = new Date();
      let currentYear = date.getFullYear();
      let baseYear = el.textContent || currentYear;

      el.classList.add('js-year-copy-enabled');

      el.textContent = (parseInt(baseYear) >= currentYear) ? currentYear : baseYear + '-' + currentYear.toString().substr(2, 2);
    });
  }

  static dmRipple() {
    let elements = document.querySelectorAll('[data-toggle="click-ripple"]:not(.js-click-ripple-enabled)');

    elements.forEach(el => {

      el.classList.add('js-click-ripple-enabled');

      el.style.overflow = 'hidden';
      el.style.position = 'relative';
      el.style.zIndex = 1;

      el.addEventListener('click', e => {
        let cssClass = 'click-ripple';
        let ripple = el.querySelector('.' + cssClass);
        let d, x, y;

        if (ripple) {
          ripple.classList.remove('animate');
        }
        else {
          let elChild = document.createElement('span')

          elChild.classList.add(cssClass)
          el.insertBefore(elChild, el.firstChild);
        }

        ripple = el.querySelector('.' + cssClass);

        if ((getComputedStyle(ripple).height === '0px') || (getComputedStyle(ripple).width === '0px')) {
          d = Math.max(el.offsetWidth, el.offsetHeight)

          ripple.style.height = d + 'px'
          ripple.style.width = d + 'px'
        }

        x = e.pageX - (el.getBoundingClientRect().left + window.scrollX) - parseFloat(getComputedStyle(ripple).width.replace('px', '')) / 2
        y = e.pageY - (el.getBoundingClientRect().top + window.scrollY) - parseFloat(getComputedStyle(ripple).height.replace('px', '')) / 2

        ripple.style.top = y + 'px'
        ripple.style.left = x + 'px'
        ripple.classList.add('animate')
      });
    });
  }

  static dmPrint() {
    let lPage = document.getElementById('page-container');
    let pageCls = lPage.className;

    console.log(pageCls);
    lPage.classList = '';
    window.print();

    lPage.classList = pageCls;
  }

  static dmTableToolsSections() {
    let tables = document.querySelectorAll('.js-table-sections:not(.js-table-sections-enabled)');

    tables.forEach(table => {
      table.classList.add('js-table-sections-enabled');

      table.querySelectorAll('.js-table-sections-header > tr').forEach(tr => {
        tr.addEventListener('click', e => {
          if (e.target.type !== 'checkbox'
            && e.target.type !== 'button'
            && e.target.tagName.toLowerCase() !== 'a'
            && e.target.parentNode.nodeName.toLowerCase() !== 'a'
            && e.target.parentNode.nodeName.toLowerCase() !== 'button'
            && e.target.parentNode.nodeName.toLowerCase() !== 'label'
            && !e.target.parentNode.classList.contains('custom-control')) {
            let tbody = tr.parentNode;
            let tbodyAll = table.querySelectorAll('tbody');

            if (!tbody.classList.contains('show')) {
              if (tbodyAll) {
                tbodyAll.forEach(tbodyEl => {
                  tbodyEl.classList.remove('show');
                  tbodyEl.classList.remove('table-active');
                });
              }
            }

            tbody.classList.toggle('show');
            tbody.classList.toggle('table-active');
          }
        });
      });
    });
  }

  static dmTableToolsCheckable() {
    let tables = document.querySelectorAll('.js-table-checkable:not(.js-table-checkable-enabled)');

    tables.forEach(table => {
      table.classList.add('js-table-checkable-enabled');

      table.querySelector('thead input[type=checkbox]').addEventListener('click', e => {
        table.querySelectorAll('tbody input[type=checkbox]').forEach(checkbox => {
          checkbox.checked = e.currentTarget.checked;

          this.tableToolscheckRow(checkbox, e.currentTarget.checked);
        });
      });

      table.querySelectorAll('tbody input[type=checkbox], tbody input + label').forEach(checkbox => {
        checkbox.addEventListener('click', e => {
          let checkboxHead = table.querySelector('thead input[type=checkbox]');

          if (!checkbox.checked) {
            checkboxHead.checked = false
          } else {
            if (table.querySelectorAll('tbody input[type=checkbox]:checked').length === table.querySelectorAll('tbody input[type=checkbox]').length) {
              checkboxHead.checked = true;
            }
          }

          this.tableToolscheckRow(checkbox, checkbox.checked);
        });
      });

      table.querySelectorAll('tbody > tr').forEach(tr => {
        tr.addEventListener('click', e => {
          if (e.target.type !== 'checkbox'
            && e.target.type !== 'button'
            && e.target.tagName.toLowerCase() !== 'a'
            && e.target.parentNode.nodeName.toLowerCase() !== 'a'
            && e.target.parentNode.nodeName.toLowerCase() !== 'button'
            && e.target.parentNode.nodeName.toLowerCase() !== 'label'
            && !e.target.parentNode.classList.contains('custom-control')) {
            let checkboxHead = table.querySelector('thead input[type=checkbox]');
            let checkbox = e.currentTarget.querySelector('input[type=checkbox]');

            checkbox.checked = !checkbox.checked;

            this.tableToolscheckRow(checkbox, checkbox.checked);

            if (!checkbox.checked) {
              checkboxHead.checked = false
            } else {
              if (table.querySelectorAll('tbody input[type=checkbox]:checked').length === table.querySelectorAll('tbody input[type=checkbox]').length) {
                checkboxHead.checked = true;
              }
            }
          }
        });
      });
    });
  }

  static tableToolscheckRow(checkbox, checkedStatus) {
    if (checkedStatus) {
      checkbox.closest('tr').classList.add('table-active');
    } else {
      checkbox.closest('tr').classList.remove('table-active');
    }
  }

  static jsCkeditor() {
    let ckeditorInline = document.querySelector('#js-ckeditor-inline:not(.js-ckeditor-inline-enabled)');
    let ckeditorFull = document.querySelector('#js-ckeditor:not(.js-ckeditor-enabled)');

    if (ckeditorInline) {
      ckeditorInline.setAttribute('contenteditable', 'true');
      CKEDITOR.inline('js-ckeditor-inline');

      ckeditorInline.classList.add('js-ckeditor-inline-enabled');
    }

    if (ckeditorFull) {
      CKEDITOR.replace('js-ckeditor');

      ckeditorFull.classList.add('js-ckeditor-enabled');
    }
  }

  static jsCkeditor5() {
    let ckeditor5Inline = document.querySelector('#js-ckeditor5-inline');
    let ckeditor5Full = document.querySelector('#js-ckeditor5-classic');

    if (ckeditor5Inline) {
      InlineEditor
        .create(document.querySelector('#js-ckeditor5-inline'))
        .then(editor => {
          window.editor = editor;
        })
        .catch(error => {
          console.error('There was a problem initializing the inline editor.', error);
        });
    }

    if (ckeditor5Full) {
      ClassicEditor
        .create(document.querySelector('#js-ckeditor5-classic'))
        .then(editor => {
          window.editor = editor;
        })
        .catch(error => {
          console.error('There was a problem initializing the classic editor.', error);
        });
    }
  }

  static jsSimpleMDE() {
    let elements = document.querySelectorAll('.js-simplemde');

    elements.forEach(el => {
      new SimpleMDE({ element: el, autoDownloadFontAwesome: false });
    });

    if (elements) {
      document.querySelector('.editor-toolbar > a.fa-header').classList.replace('fa-header', 'fa-heading');
      document.querySelector('.editor-toolbar > a.fa-picture-o').classList.replace('fa-picture-o', 'fa-image');
    }
  }

  static jsHighlightjs() {
    if (!hljs.isHighlighted) {
      hljs.initHighlighting();
    }
  }

  static jsFlatpickr() {
    let elements = document.querySelectorAll('.js-flatpickr:not(.js-flatpickr-enabled)');

    elements.forEach(el => {
      el.classList.add('js-flatpickr-enabled');

      flatpickr(el);
    });
  }

  static jqAppear() {
    jQuery('[data-toggle="appear"]:not(.js-appear-enabled)').each((index, element) => {
      let windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      let el = jQuery(element);
      let elCssClass = el.data('class') || 'animated fadeIn';
      let elOffset = el.data('offset') || 0;
      let elTimeout = (windowW < 992) ? 0 : (el.data('timeout') ? el.data('timeout') : 0);

      el.addClass('js-appear-enabled').appear(() => {
        setTimeout(() => {
          el.removeClass('invisible').addClass(elCssClass);
        }, elTimeout);
      }, { accY: elOffset });
    });
  }

  static jqMagnific() {
    jQuery('.js-gallery:not(.js-gallery-enabled)').each((index, element) => {
      jQuery(element).addClass('js-gallery-enabled').magnificPopup({
        delegate: 'a.img-lightbox',
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    });
  }

  static jqSlick() {
    jQuery('.js-slider:not(.js-slider-enabled)').each((index, element) => {
      let el = jQuery(element);

      el.addClass('js-slider-enabled').slick({
        arrows: el.data('arrows') || false,
        dots: el.data('dots') || false,
        slidesToShow: el.data('slides-to-show') || 1,
        centerMode: el.data('center-mode') || false,
        autoplay: el.data('autoplay') || false,
        autoplaySpeed: el.data('autoplay-speed') || 3000,
        infinite: typeof el.data('infinite') === 'undefined' ? true : el.data('infinite')
      });
    });
  }

  static jqDatepicker() {
    jQuery('.js-datepicker:not(.js-datepicker-enabled)').add('.input-daterange:not(.js-datepicker-enabled)').each((index, element) => {
      let el = jQuery(element);

      el.addClass('js-datepicker-enabled').datepicker({
        weekStart: el.data('week-start') || 0,
        autoclose: el.data('autoclose') || false,
        todayHighlight: el.data('today-highlight') || false,
        startDate: el.data('start-date') || false,
        container: el.data('container') || '#page-container',
        orientation: 'bottom'
      });
    });
  }

  static jqMaskedInputs() {
    jQuery('.js-masked-date:not(.js-masked-enabled)').mask('99/99/9999');
    jQuery('.js-masked-date-dash:not(.js-masked-enabled)').mask('99-99-9999');
    jQuery('.js-masked-phone:not(.js-masked-enabled)').mask('(999) 999-9999');
    jQuery('.js-masked-phone-ext:not(.js-masked-enabled)').mask('(999) 999-9999? x99999');
    jQuery('.js-masked-taxid:not(.js-masked-enabled)').mask('99-9999999');
    jQuery('.js-masked-ssn:not(.js-masked-enabled)').mask('999-99-9999');
    jQuery('.js-masked-pkey:not(.js-masked-enabled)').mask('a*-999-a999');
    jQuery('.js-masked-time:not(.js-masked-enabled)').mask('99:99');

    jQuery('.js-masked-date')
      .add('.js-masked-date-dash')
      .add('.js-masked-phone')
      .add('.js-masked-phone-ext')
      .add('.js-masked-taxid')
      .add('.js-masked-ssn')
      .add('.js-masked-pkey')
      .add('.js-masked-time')
      .addClass('js-masked-enabled');
  }

  static jqSelect2() {

    jQuery('.js-select2:not(.js-select2-enabled)').each((index, element) => {
      let el = jQuery(element);

      el.addClass('js-select2-enabled').select2({
        placeholder: el.data('placeholder') || false,
        dropdownParent: document.querySelector(el.data('container') || '#page-container'),
      });
    });
  }

  static jqNotify(options = {}) {
    if (jQuery.isEmptyObject(options)) {
      jQuery('.js-notify:not(.js-notify-enabled)').each((index, element) => {
        jQuery(element).addClass('js-notify-enabled').on('click.friezaarmy.helpers', e => {
          let el = jQuery(e.currentTarget);

          // Create notification
          jQuery.notify({
            icon: el.data('icon') || '',
            message: el.data('message'),
            url: el.data('url') || ''
          },
            {
              element: 'body',
              type: el.data('type') || 'info',
              placement: {
                from: el.data('from') || 'top',
                align: el.data('align') || 'right'
              },
              allow_dismiss: true,
              newest_on_top: true,
              showProgressbar: false,
              offset: 20,
              spacing: 10,
              z_index: 1033,
              delay: 5000,
              timer: 1000,
              animate: {
                enter: 'animated fadeIn',
                exit: 'animated fadeOutDown'
              },
              template: `<div data-notify="container" class="col-11 col-sm-4 alert alert-{0} alert-dismissible" role="alert">
  <p class="mb-0">
    <span data-notify="icon"></span>
    <span data-notify="title">{1}</span>
    <span data-notify="message">{2}</span>
  </p>
  <div class="progress" data-notify="progressbar">
    <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
  </div>
  <a href="{3}" target="{4}" data-notify="url"></a>
  <a class="p-2 m-1 text-dark" href="javascript:void(0)" aria-label="Close" data-notify="dismiss">
    <i class="fa fa-times"></i>
  </a>
</div>`
            });
        });
      });
    } else {
      jQuery.notify({
        icon: options.icon || '',
        message: options.message,
        url: options.url || ''
      },
        {
          element: options.element || 'body',
          type: options.type || 'info',
          placement: {
            from: options.from || 'top',
            align: options.align || 'right'
          },
          allow_dismiss: (options.allow_dismiss === false) ? false : true,
          newest_on_top: (options.newest_on_top === false) ? false : true,
          showProgressbar: options.show_progress_bar ? true : false,
          offset: options.offset || 20,
          spacing: options.spacing || 10,
          z_index: options.z_index || 1033,
          delay: options.delay || 5000,
          timer: options.timer || 1000,
          animate: {
            enter: options.animate_enter || 'animated fadeIn',
            exit: options.animate_exit || 'animated fadeOutDown'
          },
          template: `<div data-notify="container" class="col-11 col-sm-4 alert alert-{0} alert-dismissible" role="alert">
  <p class="mb-0">
    <span data-notify="icon"></span>
    <span data-notify="title">{1}</span>
    <span data-notify="message">{2}</span>
  </p>
  <div class="progress" data-notify="progressbar">
    <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
  </div>
  <a href="{3}" target="{4}" data-notify="url"></a>
  <a class="p-2 m-1 text-dark" href="javascript:void(0)" aria-label="Close" data-notify="dismiss">
    <i class="fa fa-times"></i>
  </a>
</div>`
        });
    }
  }

  static jqEasyPieChart() {
    jQuery('.js-pie-chart:not(.js-pie-chart-enabled)').each((index, element) => {
      let el = jQuery(element);

      el.addClass('js-pie-chart-enabled').easyPieChart({
        barColor: el.data('bar-color') || '#777777',
        trackColor: el.data('track-color') || '#eeeeee',
        lineWidth: el.data('line-width') || 3,
        size: el.data('size') || '80',
        animate: el.data('animate') || 750,
        scaleColor: el.data('scale-color') || false
      });
    });
  }

  static jqMaxlength() {
    jQuery('.js-maxlength:not(.js-maxlength-enabled)').each((index, element) => {
      let el = jQuery(element);

      el.addClass('js-maxlength-enabled').maxlength({
        alwaysShow: el.data('always-show') ? true : false,
        threshold: el.data('threshold') || 10,
        warningClass: el.data('warning-class') || 'badge bg-warning',
        limitReachedClass: el.data('limit-reached-class') || 'badge bg-danger',
        placement: el.data('placement') || 'bottom',
        preText: el.data('pre-text') || '',
        separator: el.data('separator') || '/',
        postText: el.data('post-text') || ''
      });
    });
  }

  static jqRangeslider() {
    // Init Ion Range Slider (with .js-rangeslider class)
    jQuery('.js-rangeslider:not(.js-rangeslider-enabled)').each((index, element) => {
      let el = jQuery(element);

      // Add .js-rangeslider-enabled class to tag it as activated and init it
      jQuery(element).addClass('js-rangeslider-enabled').ionRangeSlider({
        input_values_separator: ';',
        skin: el.data('skin') || 'round'
      });
    });
  }

  static jqPwStrength() {
    jQuery('.js-pw-strength:not(.js-pw-strength-enabled)').each((index, element) => {
      let el = jQuery(element);
      let container = el.parents('.js-pw-strength-container');
      let progress = jQuery('.js-pw-strength-progress', container);
      let verdict = jQuery('.js-pw-strength-feedback', container);

      el.addClass('js-pw-strength-enabled').pwstrength({
        ui: {
          container: container,
          viewports: {
            progress: progress,
            verdict: verdict
          }
        }
      });
    });
  }

  static jqSparkline() {
    let self = this;

    jQuery('.js-sparkline:not(.js-sparkline-enabled)').each((index, element) => {
      let el = jQuery(element);
      let type = el.data('type');
      let options = {};

      let types = {
        line: () => {
          options['type'] = type;
          options['lineWidth'] = el.data('line-width') || 2;
          options['lineColor'] = el.data('line-color') || '#0665d0';
          options['fillColor'] = el.data('fill-color') || '#0665d0';
          options['spotColor'] = el.data('spot-color') || '#495057';
          options['minSpotColor'] = el.data('min-spot-color') || '#495057';
          options['maxSpotColor'] = el.data('max-spot-color') || '#495057';
          options['highlightSpotColor'] = el.data('highlight-spot-color') || '#495057';
          options['highlightLineColor'] = el.data('highlight-line-color') || '#495057';
          options['spotRadius'] = el.data('spot-radius') || 2;
          options['tooltipFormat'] = '{{prefix}}{{y}}{{suffix}}';
        },
        bar: () => {
          options['type'] = type;
          options['barWidth'] = el.data('bar-width') || 8;
          options['barSpacing'] = el.data('bar-spacing') || 6;
          options['barColor'] = el.data('bar-color') || '#0665d0';
          options['tooltipFormat'] = '{{prefix}}{{value}}{{suffix}}';
        },
        pie: () => {
          options['type'] = type;
          options['sliceColors'] = ['#fadb7d', '#faad7d', '#75b0eb', '#abe37d'];
          options['highlightLighten'] = el.data('highlight-lighten') || 1.1;
          options['tooltipFormat'] = '{{prefix}}{{value}}{{suffix}}';
        },
        tristate: () => {
          options['type'] = type;
          options['barWidth'] = el.data('bar-width') || 8;
          options['barSpacing'] = el.data('bar-spacing') || 6;
          options['posBarColor'] = el.data('pos-bar-color') || '#82b54b';
          options['negBarColor'] = el.data('neg-bar-color') || '#e04f1a';
        }
      };

      if (types[type]) {
        types[type]();

        if (type === 'line') {
          if (el.data('chart-range-min') >= 0 || el.data('chart-range-min')) {
            options['chartRangeMin'] = el.data('chart-range-min');
          }

          if (el.data('chart-range-max') >= 0 || el.data('chart-range-max')) {
            options['chartRangeMax'] = el.data('chart-range-max');
          }
        }

        options['width'] = el.data('width') || '120px';
        options['height'] = el.data('height') || '80px';
        options['tooltipPrefix'] = el.data('tooltip-prefix') ? el.data('tooltip-prefix') + ' ' : '';
        options['tooltipSuffix'] = el.data('tooltip-suffix') ? ' ' + el.data('tooltip-suffix') : '';

        if (options['width'] === '100%') {
          if (!jqSparklineResize) {
            jqSparklineResize = true;

            jQuery(window).on('resize.friezaarmy.helpers.sparkline', function (e) {
              clearTimeout(jqSparklineTimeout);

              jqSparklineTimeout = setTimeout(() => {
                self.sparkline();
              }, 500);
            });
          }
        } else {
          jQuery(element).addClass('js-sparkline-enabled');
        }

        jQuery(element).sparkline(el.data('points') || [0], options);
      } else {
        console.log('[jQuery Sparkline JS Helper] Please add a correct type (line, bar, pie or tristate) in all your elements with \'js-sparkline\' class.')
      }
    });
  }

  static jqValidation() {
    jQuery.validator.setDefaults({
      errorClass: 'invalid-feedback animated fadeIn',
      errorElement: 'div',
      errorPlacement: (error, el) => {
        jQuery(el).addClass('is-invalid');
        jQuery(el).parents('div:not(.input-group)').first().append(error);
      },
      highlight: el => {
        jQuery(el).parents('div:not(.input-group)').first().find('.is-invalid').removeClass('is-invalid').addClass('is-invalid');
      },
      success: el => {
        jQuery(el).parents('div:not(.input-group)').first().find('.is-invalid').removeClass('is-invalid');
        jQuery(el).remove();
      }
    });

    jQuery.validator.addMethod('emailWithDot', function(value, element) {
      let reg = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      return this.optional(element) || reg.test(value);
    }, 'Please enter a valid email address');
  }
}
