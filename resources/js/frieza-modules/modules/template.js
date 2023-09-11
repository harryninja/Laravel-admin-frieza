import * as bootstrap from 'bootstrap';
import SimpleBar from 'simplebar';
import Helpers from './helpers';

window.bootstrap = bootstrap;
window.SimpleBar = SimpleBar;

export default class Template {

  constructor() {
    this.onLoad(() => this._uiInit());
  }

  _uiInit() {

    this._lHtml = document.documentElement;
    this._lBody = document.body;
    this._lpageLoader = document.getElementById('page-loader');
    this._lPage = document.getElementById('page-container');
    this._lSidebar = document.getElementById('sidebar');
    this._lSidebarScrollCon = this._lSidebar && this._lSidebar.querySelector('.js-sidebar-scroll');
    this._lSideOverlay = document.getElementById('side-overlay');
    this._lResize = false;
    this._lHeader = document.getElementById('page-header');
    this._lHeaderSearch = document.getElementById('page-header-search');
    this._lHeaderSearchInput = document.getElementById('page-header-search-input');
    this._lHeaderLoader = document.getElementById('page-header-loader');
    this._lMain = document.getElementById('main-container');
    this._lFooter = document.getElementById('page-footer');

    this._lSidebarScroll = false;
    this._lSideOverlayScroll = false;

    this._uiHandleTheme();
    this._uiHandleDarkMode();
    this._uiHandleSidebars();
    this._uiHandleHeader();
    this._uiHandleNav();

    this._uiApiLayout();
    this._uiApiBlocks();

    this.helpers([
      'bs-tooltip',
      'bs-popover',
      'dm-toggle-class',
      'dm-year-copy',
      'dm-ripple',
    ]);

    this._uiHandlePageLoader();
  }

  _uiHandleSidebars(mode = 'init') {
    let self = this;

    if (self._lSidebar || self._lSideOverlay) {
      if (mode === 'init') {

        self._lPage.classList.add('side-trans-enabled');

        window.addEventListener('resize', () => {
          clearTimeout(self._lResize);

          self._lPage.classList.remove('side-trans-enabled');

          self._lResize = setTimeout(() => { self._lPage.classList.add('side-trans-enabled'); }, 500);
        });

        this._uiHandleSidebars('custom-scroll');
      } else if (mode = 'custom-scroll') {

        if (self._lPage.classList.contains('side-scroll')) {

          if ((self._lSidebar) && !self._lSidebarScroll) {
            self._lSidebarScroll = new SimpleBar(self._lSidebarScrollCon);
          }

          if ((self._lSideOverlay) && !self._lSideOverlayScroll) {
            self._lSideOverlayScroll = new SimpleBar(self._lSideOverlay);
          }
        }
      }
    }
  }

  _uiHandleHeader() {
    let self = this;

    if (self._lPage.classList.contains('page-header-glass') && self._lPage.classList.contains('page-header-fixed')) {
      window.addEventListener('scroll', e => {
        if (window.scrollY > 60) {
          self._lPage.classList.add('page-header-scroll');
        } else {
          self._lPage.classList.remove('page-header-scroll');
        }
      });

      window.dispatchEvent(new CustomEvent('scroll'));
    }
  }

  _uiHandleNav() {
    let links = document.querySelectorAll('[data-toggle="submenu"]');

    if (links) {
      links.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();

          let mainNav = link.closest('.nav-main');

          if (
            !(
              (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) > 991
              && mainNav.classList.contains('nav-main-horizontal')
              && mainNav.classList.contains('nav-main-hover')
            )
          ) {

            let parentLi = link.closest('li');

            if (parentLi.classList.contains('open')) {

              parentLi.classList.remove('open');

              link.setAttribute('aria-expanded', 'false');
            } else {

              Array.from(link.closest('ul').children).forEach(el => {
                el.classList.remove('open');
              });

              parentLi.classList.add('open');

              link.setAttribute('aria-expanded', 'true');
            }
          }

          return false;
        });
      });
    }
  }

  _uiHandlePageLoader(mode = 'hide', colorClass) {
    if (mode === 'show') {
      if (this._lpageLoader) {
        if (colorClass) {
          this._lpageLoader.className = '';
          this._lpageLoader.classList.add(colorClass);
        }

        this._lpageLoader.classList.add('show');
      } else {
        let pageLoader = document.createElement('div');

        pageLoader.id = 'page-loader';

        if (colorClass) {
          pageLoader.classList.add(colorClass);
        }

        pageLoader.classList.add('show');

        this._lPage.insertBefore(pageLoader, this._lPage.firstChild);

        this._lpageLoader = document.getElementById('page-loader');
      }
    } else if (mode === 'hide') {
      if (this._lpageLoader) {
        this._lpageLoader.classList.remove('show');
      }
    }
  }

  _uiHandleDarkMode(mode = 'init') {
    let self = this;

    if (mode === 'init' && !self._lPage.classList.contains('dark-mode')) {
      if (self._lPage.classList.contains('sidebar-dark')) {
        localStorage.setItem('DefaultsSidebarDark', true);
      } else {
        localStorage.removeItem('DefaultsSidebarDark');
      }

      if (self._lPage.classList.contains('page-header-dark')) {
        localStorage.setItem('DefaultsPageHeaderDark', true);
      } else {
        localStorage.removeItem('DefaultsPageHeaderDark');
      }
    }

    if (self._lPage.classList.contains('remember-theme')) {
      let darkMode = localStorage.getItem('DarkMode') || false;

      if (mode === 'init') {
        if (darkMode) {
          self._lPage.classList.add('sidebar-dark');
          self._lPage.classList.add('page-header-dark');
          self._lPage.classList.add('dark-mode');
        } else if (mode === 'init') {
          self._lPage.classList.remove('dark-mode');
        }
      } else if (mode === 'on') {
        localStorage.setItem('DarkMode', true);
      } else if (mode === 'off') {
        localStorage.removeItem('DarkMode');
      }
    } else if (mode === 'init') {
      localStorage.removeItem('DarkMode');
    }
  }

  _uiHandleTheme() {
    let self = this;
    let themeEl = document.getElementById('css-theme');
    let rememberTheme = this._lPage.classList.contains('remember-theme') ? true : false;

    if (rememberTheme) {
      let themeName = localStorage.getItem('ThemeName') || false;

      if (themeName) {
        self._uiUpdateTheme(themeEl, themeName);
      }

      themeEl = document.getElementById('css-theme');
    } else {
      localStorage.removeItem('ThemeName');
    }

    document.querySelectorAll('[data-toggle="theme"][data-theme="' + (themeEl ? themeEl.getAttribute('href') : 'default') + '"]').forEach(link => {
      link.classList.add('active');
    });

    document.querySelectorAll('[data-toggle="theme"]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();

        let themeName = el.dataset.theme;

        document.querySelectorAll('[data-toggle="theme"]').forEach(link => {
          link.classList.remove('active');
        });

        document.querySelector('[data-toggle="theme"][data-theme="' + themeName + '"]').classList.add('active');

        self._uiUpdateTheme(themeEl, themeName);

        themeEl = document.getElementById('css-theme');

        if (rememberTheme) {
          localStorage.setItem('ThemeName', themeName);
        }
      });
    });
  }

  _uiUpdateTheme(themeEl, themeName) {
    if (themeName === 'default') {
      if (themeEl) {
        themeEl.parentNode.removeChild(themeEl);
      }
    } else {
      if (themeEl) {
        themeEl.setAttribute('href', themeName);
      } else {
        let themeLink = document.createElement('link');

        themeLink.id = 'css-theme';
        themeLink.setAttribute('rel', 'stylesheet');
        themeLink.setAttribute('href', themeName);

        document.getElementById('css-main').insertAdjacentElement('afterend', themeLink);
      }
    }
  }

  _uiApiLayout(mode = 'init') {
    let self = this;

    let layoutAPI = {
      init: () => {
        let buttons = document.querySelectorAll('[data-toggle="layout"]');

        // Call layout API on button click
        if (buttons) {
          buttons.forEach(btn => {
            btn.addEventListener('click', e => {
              self._uiApiLayout(btn.dataset.action);
            });
          })
        }

        if (self._lPage.classList.contains('enable-page-overlay')) {
          let pageOverlay = document.createElement('div');
          pageOverlay.id = 'page-overlay';

          self._lPage.insertBefore(pageOverlay, self._lPage.firstChild);

          document.getElementById('page-overlay').addEventListener('click', e => {
            self._uiApiLayout('side_overlay_close');
          });
        }
      },
      sidebar_pos_toggle: () => {
        self._lPage.classList.toggle('sidebar-r');
      },
      sidebar_pos_left: () => {
        self._lPage.classList.remove('sidebar-r');
      },
      sidebar_pos_right: () => {
        self._lPage.classList.add('sidebar-r');
      },
      sidebar_toggle: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.toggle('sidebar-o');
        } else {
          self._lPage.classList.toggle('sidebar-o-xs');
        }
      },
      sidebar_open: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.add('sidebar-o');
        } else {
          self._lPage.classList.add('sidebar-o-xs');
        }
      },
      sidebar_close: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.remove('sidebar-o');
        } else {
          self._lPage.classList.remove('sidebar-o-xs');
        }
      },
      sidebar_mini_toggle: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.toggle('sidebar-mini');
        }
      },
      sidebar_mini_on: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.add('sidebar-mini');
        }
      },
      sidebar_mini_off: () => {
        if (window.innerWidth > 991) {
          self._lPage.classList.remove('sidebar-mini');
        }
      },
      sidebar_style_toggle: () => {
        if (self._lPage.classList.contains('sidebar-dark')) {
          self._uiApiLayout('sidebar_style_light');
        } else {
          self._uiApiLayout('sidebar_style_dark');
        }
      },
      sidebar_style_dark: () => {
        self._lPage.classList.add('sidebar-dark');
        localStorage.setItem('DefaultsSidebarDark', true);
      },
      sidebar_style_light: () => {
        self._lPage.classList.remove('sidebar-dark');
        self._lPage.classList.remove('dark-mode');
        localStorage.removeItem('DefaultsSidebarDark');
      },
      side_overlay_toggle: () => {
        if (self._lPage.classList.contains('side-overlay-o')) {
          self._uiApiLayout('side_overlay_close');
        } else {
          self._uiApiLayout('side_overlay_open');
        }
      },
      side_overlay_open: () => {

        document.addEventListener('keydown', e => {
          if (e.key === 'Esc' || e.key === 'Escape') {
            self._uiApiLayout('side_overlay_close');
          }
        });

        self._lPage.classList.add('side-overlay-o');
      },
      side_overlay_close: () => {
        self._lPage.classList.remove('side-overlay-o');
      },
      side_overlay_mode_hover_toggle: () => {
        self._lPage.classList.toggle('side-overlay-hover');
      },
      side_overlay_mode_hover_on: () => {
        self._lPage.classList.add('side-overlay-hover');
      },
      side_overlay_mode_hover_off: () => {
        self._lPage.classList.remove('side-overlay-hover');
      },
      header_glass_toggle: () => {
        self._lPage.classList.toggle('page-header-glass');
        self._uiHandleHeader();
      },
      header_glass_on: () => {
        self._lPage.classList.add('page-header-glass');
        self._uiHandleHeader();
      },
      header_glass_off: () => {
        self._lPage.classList.remove('page-header-glass');
        self._uiHandleHeader();
      },
      header_mode_toggle: () => {
        self._lPage.classList.toggle('page-header-fixed');
      },
      header_mode_static: () => {
        self._lPage.classList.remove('page-header-fixed');
      },
      header_mode_fixed: () => {
        self._lPage.classList.add('page-header-fixed');
      },
      header_style_toggle: () => {
        if (self._lPage.classList.contains('page-header-dark')) {
          self._uiApiLayout('header_style_light');
        } else {
          self._uiApiLayout('header_style_dark');
        }
      },
      header_style_dark: () => {
        self._lPage.classList.add('page-header-dark');
        localStorage.setItem('DefaultsPageHeaderDark', true);
      },
      header_style_light: () => {
        self._lPage.classList.remove('page-header-dark');
        self._lPage.classList.remove('dark-mode');
        localStorage.removeItem('DefaultsPageHeaderDark');
      },
      header_search_on: () => {
        self._lHeaderSearch.classList.add('show');
        self._lHeaderSearchInput.focus();

        document.addEventListener('keydown', e => {
          if (e.key === 'Esc' || e.key === 'Escape') {
            self._uiApiLayout('header_search_off');
          }
        });
      },
      header_search_off: () => {
        self._lHeaderSearch.classList.remove('show');
        self._lHeaderSearchInput.blur();
      },
      header_loader_on: () => {
        self._lHeaderLoader.classList.add('show');
      },
      header_loader_off: () => {
        self._lHeaderLoader.classList.remove('show');
      },
      dark_mode_toggle: () => {
        if (self._lPage.classList.contains('dark-mode')) {
          self._uiApiLayout('dark_mode_off');
        } else {
          self._uiApiLayout('dark_mode_on');
        }
      },
      dark_mode_on: () => {
        self._lPage.classList.add('sidebar-dark');
        self._lPage.classList.add('page-header-dark');
        self._lPage.classList.add('dark-mode');
        this._uiHandleDarkMode('on');
      },
      dark_mode_off: () => {
        if (!localStorage.getItem('DefaultsSidebarDark')) {
          self._lPage.classList.remove('sidebar-dark');
        }

        if (!localStorage.getItem('DefaultsPageHeaderDark')) {
          self._lPage.classList.remove('page-header-dark');
        }

        self._lPage.classList.remove('dark-mode');
        this._uiHandleDarkMode('off');
      },
      content_layout_toggle: () => {
        if (self._lPage.classList.contains('main-content-boxed')) {
          self._uiApiLayout('content_layout_narrow');
        } else if (self._lPage.classList.contains('main-content-narrow')) {
          self._uiApiLayout('content_layout_full_width');
        } else {
          self._uiApiLayout('content_layout_boxed');
        }
      },
      content_layout_boxed: () => {
        self._lPage.classList.remove('main-content-narrow');
        self._lPage.classList.add('main-content-boxed');
      },
      content_layout_narrow: () => {
        self._lPage.classList.remove('main-content-boxed');
        self._lPage.classList.add('main-content-narrow');
      },
      content_layout_full_width: () => {
        self._lPage.classList.remove('main-content-boxed');
        self._lPage.classList.remove('main-content-narrow');
      }
    };

    if (layoutAPI[mode]) {
      layoutAPI[mode]();
    }
  }

  _uiApiBlocks(mode = 'init', block = false) {
    let self = this;

    let elBlock, btnFullscreen, btnContentToggle;

    let iconBase = 'si';
    let iconFullscreen = 'si-size-fullscreen';
    let iconFullscreenActive = 'si-size-actual';
    let iconContent = 'si-arrow-up';
    let iconContentActive = 'si-arrow-down';

    let blockAPI = {
      init: () => {
        // Auto add the default toggle icons to fullscreen and content toggle buttons
        document.querySelectorAll('[data-toggle="block-option"][data-action="fullscreen_toggle"]').forEach(btn => {
          btn.innerHTML = '<i class="' + iconBase + ' ' + (btn.closest('.block').classList.contains('block-mode-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>';
        });

        document.querySelectorAll('[data-toggle="block-option"][data-action="content_toggle"]').forEach(btn => {
          btn.innerHTML = '<i class="' + iconBase + ' ' + (btn.closest('.block').classList.contains('block-mode-hidden') ? iconContentActive : iconContent) + '"></i>';
        });

        document.querySelectorAll('[data-toggle="block-option"]').forEach(btn => {
          btn.addEventListener('click', e => {
            this._uiApiBlocks(btn.dataset.action, btn.closest('.block'));
          });
        });
      },
      fullscreen_toggle: () => {
        elBlock.classList.remove('block-mode-pinned');
        elBlock.classList.toggle('block-mode-fullscreen');

        if (btnFullscreen) {
          if (elBlock.classList.contains('block-mode-fullscreen')) {
            btnFullscreen && btnFullscreen.querySelector('i').classList.replace(iconFullscreen, iconFullscreenActive);
          } else {
            btnFullscreen && btnFullscreen.querySelector('i').classList.replace(iconFullscreenActive, iconFullscreen);
          }
        }
      },
      fullscreen_on: () => {
        elBlock.classList.remove('block-mode-pinned')
        elBlock.classList.add('block-mode-fullscreen');

        btnFullscreen && btnFullscreen.querySelector('i').classList.replace(iconFullscreen, iconFullscreenActive);
      },
      fullscreen_off: () => {
        elBlock.classList.remove('block-mode-fullscreen');

        btnFullscreen && btnFullscreen.querySelector('i').classList.replace(iconFullscreenActive, iconFullscreen);
      },
      content_toggle: () => {
        elBlock.classList.toggle('block-mode-hidden');

        if (btnContentToggle) {
          if (elBlock.classList.contains('block-mode-hidden')) {
            btnContentToggle.querySelector('i').classList.replace(iconContent, iconContentActive);
          } else {
            btnContentToggle.querySelector('i').classList.replace(iconContentActive, iconContent);
          }
        }
      },
      content_hide: () => {
        elBlock.classList.add('block-mode-hidden');

        btnContentToggle && btnContentToggle.querySelector('i').classList.replace(iconContent, iconContentActive);
      },
      content_show: () => {
        elBlock.classList.remove('block-mode-hidden');

        btnContentToggle && btnContentToggle.querySelector('i').classList.replace(iconContentActive, iconContent);
      },
      state_toggle: () => {
        elBlock.classList.toggle('block-mode-loading');
        if (elBlock.querySelector('[data-toggle="block-option"][data-action="state_toggle"][data-action-mode="demo"]')) {
          setTimeout(() => {
            elBlock.classList.remove('block-mode-loading');
          }, 2000);
        }
      },
      state_loading: () => {
        elBlock.classList.add('block-mode-loading');
      },
      state_normal: () => {
        elBlock.classList.remove('block-mode-loading');
      },
      pinned_toggle: () => {
        elBlock.classList.remove('block-mode-fullscreen');
        elBlock.classList.toggle('block-mode-pinned');
      },
      pinned_on: () => {
        elBlock.classList.remove('block-mode-fullscreen');
        elBlock.classList.add('block-mode-pinned');
      },
      pinned_off: () => {
        elBlock.classList.remove('block-mode-pinned');
      },
      close: () => {
        elBlock.classList.add('d-none');
      },
      open: () => {
        elBlock.classList.remove('d-none');
      }
    };

    if (mode === 'init') {
      blockAPI[mode]();
    } else {

      elBlock = (block instanceof Element) ? block : document.querySelector(`${block}`);

      if (elBlock) {

        btnFullscreen = elBlock.querySelector('[data-toggle="block-option"][data-action="fullscreen_toggle"]');
        btnContentToggle = elBlock.querySelector('[data-toggle="block-option"][data-action="content_toggle"]');

        if (blockAPI[mode]) {
          blockAPI[mode]();
        }
      }
    }
  }

  onLoad(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  init() {
    this._uiInit();
  }

  layout(mode) {
    this._uiApiLayout(mode);
  }

  block(mode, block) {
    this._uiApiBlocks(mode, block);
  }

  loader(mode, colorClass) {
    this._uiHandlePageLoader(mode, colorClass);
  }

  helpers(helpers, options = {}) {
    Helpers.run(helpers, options);
  }

  helpersOnLoad(helpers, options = {}) {
    this.onLoad(() => Helpers.run(helpers, options));
  }
}
