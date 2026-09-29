/* 春耕未來・數造共好｜共用腳本
   主題與字級、KaTeX、GeoGebra 延遲載入、指令複製 */
(function () {
  var root = document.documentElement;

  /* ── 字級與主題 ── */
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function syncButtons() {
    var fs = root.getAttribute('data-fs') || 'm';
    document.querySelectorAll('[data-fs-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-fs-set') === fs));
    });
    var dark = root.getAttribute('data-theme') === 'dark';
    var t = document.getElementById('themeBtn');
    if (t) { t.setAttribute('aria-pressed', String(dark)); t.textContent = dark ? '淺色' : '深色'; }
  }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-fs-set]');
    if (f) { var v = f.getAttribute('data-fs-set'); root.setAttribute('data-fs', v); store('spm-fs', v); syncButtons(); return; }
    if (e.target.closest('#themeBtn')) {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store('spm-theme', next); syncButtons();
    }
  });

  /* ── KaTeX ── */
  function renderMath() {
    if (!window.renderMathInElement) return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false,
      output: 'htmlAndMathml',
      ignoredClasses: ['prompt']
    });
  }
  window.spmRenderMath = renderMath;

  /* ── 指令複製 ── */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.copy');
    if (!b) return;
    var pre = b.closest('.prompt').querySelector('pre');
    var txt = pre.innerText;
    var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = '複製指令'; }, 2200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done('已複製'); }, function () { selectPre(pre); done('已選取，請按複製鍵'); });
    } else { selectPre(pre); done('已選取，請按複製鍵'); }
  });
  function selectPre(pre) {
    var r = document.createRange(); r.selectNodeContents(pre);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  /* ── GeoGebra 作圖 ── */
  var INK = '#16222D', BRASS = '#8E6210', BLUE = '#245774', RED = '#A5311F', GREY = '#7E8C98';

  function base(api, box) {
    api.setRounding('1');
    ['ShowAxes(false)', 'ShowGrid(false)', 'ZoomIn(' + box.join(',') + ')'].forEach(function (c) { api.evalCommand(c); });
  }
  function style(api, name, color, thick) {
    api.evalCommand('SetColor(' + name + ',"' + color + '")');
    if (thick) api.evalCommand('SetLineThickness(' + name + ',' + thick + ')');
  }
  function label(api, name, cap) {
    api.evalCommand('SetCaption(' + name + ',"' + cap + '")');
    api.evalCommand('ShowLabel(' + name + ',true)');
    api.evalCommand('SetLabelMode(' + name + ',9)');
  }
  function run(api, cmds) { cmds.forEach(function (c) { api.evalCommand(c); }); }

  var BUILDS = {
    /* 半徑是集合：拖動圓上任一點，圓心到它的距離都相同 */
    'radius-set': function (api) {
      base(api, [-5.2, -3.6, 5.2, 3.6]);
      run(api, ['O=(0,0)', 'A=(3,0)', 'c=Circle(O,A)',
        'P=Point(c,0.14)', 'Q=Point(c,0.41)', 'R=Point(c,0.66)',
        'sA=Segment(O,A)', 'sP=Segment(O,P)', 'sQ=Segment(O,Q)', 'sR=Segment(O,R)',
        'SetFixed(O,true)']);
      style(api, 'c', INK, 5);
      ['sA', 'sP', 'sQ', 'sR'].forEach(function (s) { style(api, s, BRASS, 6); label(api, s, '半徑'); });
      style(api, 'A', RED); style(api, 'O', INK);
      ['P', 'Q', 'R'].forEach(function (p) { style(api, p, BLUE); api.evalCommand('SetPointSize(' + p + ',5)'); });
      api.evalCommand('SetPointSize(A,6)');
      label(api, 'O', '圓心 O'); api.evalCommand('SetLabelMode(O,3)');
      label(api, 'A', '拖我改變半徑'); api.evalCommand('SetLabelMode(A,3)');
    },

    /* 46% 迷思：兩圓半徑相同，位置不同也不疊合，仍然一樣大 */
    'two-circles': function (api) {
      base(api, [-8, -4.6, 8, 4.6]);
      run(api, ['O1=(-3.8,0)', 'A=(-0.8,0)', 'c1=Circle(O1,A)', 'k=Radius(c1)',
        'O2=(3.8,0.4)', 'c2=Circle(O2,k)', 'B=Point(c2,0.02)',
        's1=Segment(O1,A)', 's2=Segment(O2,B)']);
      style(api, 'c1', INK, 5); style(api, 'c2', INK, 5);
      style(api, 's1', BRASS, 6); style(api, 's2', BRASS, 6);
      label(api, 's1', '甲的半徑'); label(api, 's2', '乙的半徑');
      style(api, 'A', RED); api.evalCommand('SetPointSize(A,6)');
      label(api, 'O1', '甲'); api.evalCommand('SetLabelMode(O1,3)');
      label(api, 'O2', '乙'); api.evalCommand('SetLabelMode(O2,3)');
      api.evalCommand('SetFixed(B,true)');
    },

    /* 弦與直徑：只有通過圓心的那一條弦才是直徑 */
    'chord': function (api) {
      base(api, [-5.2, -3.8, 5.2, 3.8]);
      run(api, ['O=(0,0)', 'c=Circle(O,3)', 'H=Point(Segment((0,-2.8),(0,2.8)))', 'SetCoords(H,0,1.7)',
        'l=Line(H,H+(1,0))', 'E=Intersect(c,l,1)', 'F=Intersect(c,l,2)', 'ch=Segment(E,F)',
        'SetVisibleInView(l,1,false)', 'SetFixed(O,true)']);
      run(api, ['dm=Segment((-3,0),(3,0))']);
      style(api, 'dm', GREY, 3); api.evalCommand('SetLineStyle(dm,1)'); label(api, 'dm', '直徑');
      style(api, 'c', INK, 5); style(api, 'ch', RED, 7);
      label(api, 'ch', '這條弦');
      style(api, 'H', RED); api.evalCommand('SetPointSize(H,6)');
      label(api, 'H', '上下拖動'); api.evalCommand('SetLabelMode(H,3)');
      label(api, 'O', '圓心'); api.evalCommand('SetLabelMode(O,3)');
      ['E', 'F'].forEach(function (p) { api.evalCommand('ShowLabel(' + p + ',false)'); style(api, p, RED); });
    },

    /* 直徑由兩條半徑接成：以加法取代倍數除法 */
    'diameter-sum': function (api) {
      base(api, [-5.2, -3.8, 5.2, 3.8]);
      run(api, ['O=(0,0)', 'c=Circle(O,3)', 'A=Point(c,0.06)', 'B=Rotate(A,pi,O)',
        'rA=Segment(O,A)', 'rB=Segment(O,B)', 'SetFixed(O,true)']);
      style(api, 'c', INK, 5);
      style(api, 'rA', BRASS, 8); style(api, 'rB', BLUE, 8);
      label(api, 'rA', '半徑'); label(api, 'rB', '半徑');
      style(api, 'A', RED); api.evalCommand('SetPointSize(A,6)');
      label(api, 'A', '拖我轉動'); api.evalCommand('SetLabelMode(A,3)');
      api.evalCommand('ShowLabel(B,false)'); style(api, 'B', BLUE);
    }
  };

  var ggbPromise = null;
  function loadGGB() {
    if (window.GGBApplet) return Promise.resolve();
    if (ggbPromise) return ggbPromise;
    ggbPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://www.geogebra.org/apps/deployggb.js';
      s.onload = res; s.onerror = function () { ggbPromise = null; rej(); };
      document.head.appendChild(s);
    });
    return ggbPromise;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-ggb-open]');
    if (!btn) return;
    var block = btn.closest('.ggb-block');
    var key = block.getAttribute('data-ggb');
    var stage = block.querySelector('.ggb-stage');
    var still = block.querySelector('.ggb-still');
    if (stage.getAttribute('data-ready')) {
      var showing = !stage.hidden;
      stage.hidden = showing; if (still) still.hidden = !showing;
      btn.textContent = showing ? '開啟互動作圖' : '改看靜態圖';
      return;
    }
    btn.disabled = true; btn.textContent = '載入 GeoGebra 中';
    loadGGB().then(function () {
      var id = 'ggb-' + key + '-' + Math.random().toString(36).slice(2, 7);
      stage.id = id;
      var w = Math.max(280, Math.min(stage.clientWidth || block.clientWidth - 40, 860));
      var h = Math.round(w * 0.64);
      var app = new window.GGBApplet({
        appName: 'classic', width: w, height: h, perspective: 'G',
        showToolBar: false, showAlgebraInput: false, showMenuBar: false,
        showResetIcon: true, showFullscreenButton: true, showZoomButtons: false,
        enableRightClick: false, enableShiftDragZoom: false, enableLabelDrags: false,
        language: 'zh_TW', borderColor: '#C6D0D7', scaleContainerClass: 'ggb-stage',
        appletOnLoad: function (api) { try { BUILDS[key](api); } catch (err) { console.error(err); } }
      }, true);
      if (still) still.hidden = true;
      stage.hidden = false; stage.setAttribute('data-ready', '1');
      app.inject(id);
      btn.disabled = false; btn.textContent = '改看靜態圖';
    }, function () {
      btn.disabled = false; btn.textContent = '重新嘗試';
      if (!block.querySelector('.ggb-err')) {
        var p = document.createElement('p'); p.className = 'ggb-err';
        p.textContent = '無法連線到 GeoGebra。靜態圖仍可使用，連上網路後可再試一次。';
        block.querySelector('.ggb-body').appendChild(p);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    syncButtons();
    document.querySelectorAll('.ggb-stage').forEach(function (s) { s.hidden = true; });
  });
})();
