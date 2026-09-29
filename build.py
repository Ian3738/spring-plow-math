#!/usr/bin/env python3
"""組頁：src/<頁>.html 只放 <section> 內容，本腳本套上頁首、導覽、頁尾與腳本。"""
import pathlib, sys

ROOT = pathlib.Path(__file__).parent
V = "7"   # 快取版本號，改樣式或腳本後要加一

PAGES = [
  ("index",      "總覽",     "圓的概念 UDL 設計",
   "康軒版三下第六單元．示範單元", "圓的概念",
   "全體通過率只有 21%，高分組也只有 34%。高分與低分的學生一起答錯同一題，表示這不是個別能力的差距，<b>是教材設計層級的共同議題</b>。"),
  ("concept",    "數學本質", "數學本質｜圓的概念",
   "學科本質把關", "圓是一圈線，不是一個面",
   "課程調整的第一道關卡是把數學講對。本頁依官方試題分析之教學建議，界定圓、圓區域與半徑的意義，並區分給學生的說法與教師該知道的形式定義。"),
  ("udl",        "UDL 設計", "UDL 九項設計｜圓的概念",
   "UDL 3.0．三大原則 × 三個層次", "九項 Guideline 設計",
   "每一格都寫到可以直接執行的程度：做什麼、準備什麼、花多久、怎麼知道有效，以及它對應哪一個認知障礙點。"),
  ("lesson",     "教學流程", "教學流程｜圓的概念",
   "逐節教學設計", "五節課的教學流程",
   "由認識圓到使用圓規，每一節列出時間分配、教師的提問用語、學生的操作與當節要收的證據。"),
  ("scaffold",   "教學鷹架", "教學鷹架｜圓的概念",
   "依官方試題分析之教學建議", "四項教學鷹架",
   "四項做法全部出自試題分析報告之教學建議。每一項都不改變學生必須學會的內容，改變的是知識傳遞的路徑。"),
  ("ai",         "AI 協作", "AI 協作指令｜圓的概念",
   "普特共築．AI 協作數學概念轉化", "把認知條件寫成 AI 的限制語法",
   "模組的核心動作是把學生的認知障礙點，轉寫成生成式 AI 能遵守的條件。本頁提供可直接照抄的指令，並寫明 AI 在這個單元做得到與做不到的事。"),
  ("assessment", "評量檢核", "評量與效果檢核｜圓的概念",
   "怎麼知道調整有效", "評量與效果檢核",
   "以 Q20 為錨點設計前後測，自編檢核題逐一對應三種錯誤類型，並事先寫明什麼情況要判定為無效。"),
]

HEAD = """<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="color-scheme" content="light dark">
<script>
(function(){{var d=document.documentElement,t,f;
try{{t=localStorage.getItem('spm-theme');f=localStorage.getItem('spm-fs');}}catch(e){{}}
if(t)d.setAttribute('data-theme',t);d.setAttribute('data-fs',f||'m');}})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+TC:wght@500;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<link rel="stylesheet" href="assets/style.css?v={v}">
</head>
<body>
<a class="skip" href="#main">跳至主要內容</a>
<header class="topbar">
  <div class="wrap row1">
    <a class="brand" href="index.html">春耕未來・數造共好<small>圓的概念</small></a>
    <div class="ctrls">
      <span class="lbl" id="fsl">文字大小</span>
      <button class="tog" type="button" data-fs-set="m" aria-describedby="fsl">標準</button>
      <button class="tog" type="button" data-fs-set="l" aria-describedby="fsl">大</button>
      <button class="tog" type="button" data-fs-set="xl" aria-describedby="fsl">特大</button>
      <button class="tog" type="button" id="themeBtn" aria-pressed="false">深色</button>
    </div>
  </div>
  <nav class="tabs" aria-label="頁面導覽">
    <div class="wrap"><ol>
{tabs}
    </ol></div>
  </nav>
</header>
<header class="ph">
  <div class="wrap">
    <p class="kicker">{kicker}</p>
    <h1>{h1}</h1>
    <p class="lede">{lede}</p>
  </div>
</header>
<main id="main">
<div class="wrap">
"""

FOOT = """
{pager}
</div>
</main>
<footer class="foot">
  <div class="wrap">
    <p>資料來源　國立臺中教育大學測驗統計與適性學習研究中心（2023）。112 年度縣市學生學習能力檢測：數學三年級施測結果報告。</p>
    <p>設計框架　CAST (2024). Universal Design for Learning Guidelines version 3.0.</p>
    <p>春耕未來・數造共好｜在知識翻新環境下以 AI 協作之教師專業增能計畫．徐道寧教授數學教育與人文關懷實踐獎助．國立清華大學教育與學習科技學系</p>
  </div>
</footer>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous" onload="window.spmRenderMath&&spmRenderMath()"></script>
<script src="assets/site.js?v={v}"></script>
</body>
</html>
"""

def tabs(cur):
    out = []
    for i, (slug, nav, *_ ) in enumerate(PAGES):
        cur_attr = ' aria-current="page"' if slug == cur else ''
        out.append(f'      <li><a href="{slug}.html"{cur_attr}><span class="n">{i+1:02d}</span>{nav}</a></li>')
    return "\n".join(out)

def pager(i):
    prev_ = PAGES[i-1] if i > 0 else None
    next_ = PAGES[i+1] if i < len(PAGES)-1 else None
    a = (f'<a href="{prev_[0]}.html"><span class="k">上一頁</span><span class="v">{prev_[1]}</span></a>'
         if prev_ else '<span class="empty"></span>')
    b = (f'<a class="next" href="{next_[0]}.html"><span class="k">下一頁</span><span class="v">{next_[1]}</span></a>'
         if next_ else '<span class="empty"></span>')
    return f'<nav class="pager" aria-label="上下頁">{a}{b}</nav>'

def main():
    missing = []
    for i, (slug, nav, title, kicker, h1, lede) in enumerate(PAGES):
        src = ROOT / "src" / f"{slug}.html"
        if not src.exists():
            missing.append(slug); continue
        import re
        desc = re.sub(r"<[^>]+>", "", lede)[:120]
        html = (HEAD.format(title=title, desc=desc, v=V, tabs=tabs(slug), kicker=kicker, h1=h1, lede=lede)
                + src.read_text(encoding="utf-8")
                + FOOT.format(pager=pager(i), v=V))
        (ROOT / f"{slug}.html").write_text(html, encoding="utf-8")
        print(f"  ✓ {slug}.html")
    if missing:
        print("  缺少 src：", ", ".join(missing)); sys.exit(1)

if __name__ == "__main__":
    main()
