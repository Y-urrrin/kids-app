
/* =====================================
   ひらがな一覧
===================================== */

const letters = [
  ['あ', 'images/hiragana/ahiru.png', 'あひる'],
  ['い', 'images/hiragana/ichigo.png', 'いちご'],
  ['う', 'images/hiragana/usagi.png', 'うさぎ'],
  ['え', 'images/hiragana/ehon.png', 'えほん'],
  ['お', 'images/hiragana/onigiri.png', 'おにぎり'],

  ['か', 'images/hiragana/kaeru.png', 'かえる'],
  ['き', 'images/hiragana/kirin.png', 'きりん'],
  ['く', 'images/hiragana/kuruma.png', 'くるま'],
  ['け', 'images/hiragana/keisatu.png', 'けいさつ'],
  ['こ', 'images/hiragana/konnbu.png', 'こんぶ'],

  ['さ', 'images/hiragana/sakana.png', 'さかな'],
  ['し', 'images/hiragana/shika.png', 'しか'],
  ['す', 'images/hiragana/sushi.png', 'すし'],
  ['せ', 'images/hiragana/semi.png', 'せみ'],
  ['そ', 'images/hiragana/soba.png', 'そば'],

  ['た', 'images/hiragana/tako.png', 'たこ'],
  ['ち', 'images/hiragana/cho.png', 'ちょうちょ'],
  ['つ', 'images/hiragana/tsumiki.png', 'つみき'],
  ['て', 'images/hiragana/tegami.png', 'てがみ'],
  ['と', 'images/hiragana/tora.png', 'とら'],

  ['な', 'images/hiragana/nasu.png', 'なす'],
  ['に', 'images/hiragana/ninjin.png', 'にんじん'],
  ['ぬ', 'images/hiragana/nuigurumi.png', 'ぬいぐるみ'],
  ['ね', 'images/hiragana/neko.png', 'ねこ'],
  ['の', 'images/hiragana/nori.png', 'のり'],

  ['は', 'images/hiragana/hana.png', 'はな'],
  ['ひ', 'images/hiragana/hikouki.png', 'ひこうき'],
  ['ふ', 'images/hiragana/huusen.png', 'ふうせん'],
  ['へ', 'images/hiragana/hebi.png', 'へび'],
  ['ほ', 'images/hiragana/hoshi.png', 'ほし'],

  ['ま', 'images/hiragana/maiku.png', 'まいく'],
  ['み', 'images/hiragana/mikan.png', 'みかん'],
  ['む', 'images/hiragana/mushi.png', 'むし'],
  ['め', 'images/hiragana/megane.png', 'めがね'],
  ['も', 'images/hiragana/momo.png', 'もも'],

  ['や', 'images/hiragana/yama.png', 'やま'],
  ['ゆ', 'images/hiragana/yuki.png', 'ゆき'],
  ['よ', 'images/hiragana/yotto.png', 'よっと'],

  ['ら', 'images/hiragana/rappa.png', 'らっぱ'],
  ['り', 'images/hiragana/ringo.png', 'りんご'],
  ['る', 'images/hiragana/ruby.png', 'るびー'],
  ['れ', 'images/hiragana/lemon.png', 'れもん'],
  ['ろ', 'images/hiragana/rousoku.png', 'ろうそく'],

  ['わ', 'images/hiragana/wani.png', 'わに'],
  ['を', 'images/hiragana/tewohuru.png', 'を'],
  ['ん', 'images/hiragana/panda.png', 'ぱんだ']
];


/* =====================================
   ひらがな選択画面
===================================== */

const tiles = document.getElementById('tiles');

if (tiles) {
  letters.forEach(([kana, image, word]) => {
    const a = document.createElement('a');

    a.className = 'tile';

    a.href =
      `writing.html?kana=${encodeURIComponent(kana)}`;

    a.innerHTML = `
      <span class="kana">${kana}</span>
      <span class="item">
        <img src="${image}" alt="${word}" class="tile-image">
        <span class="word">${word}</span>
      </span>
    `;

    tiles.append(a);
  });
}


/* =====================================
   ひらがなを書く画面
===================================== */

const board = document.getElementById('board');

if (board) {

  const kana =
    new URLSearchParams(location.search)
      .get('kana') || 'あ';

  const data =
    letters.find(x => x[0] === kana) || letters[0];

  document.getElementById('titleKana').textContent =
    data[0];

  document.getElementById('sampleKana').textContent =
    data[0];

  document.getElementById('picture').src = data[1];
  document.getElementById('picture').alt = data[2];

  document.getElementById('word').textContent =
    data[2];

  const stepEl = document.getElementById('step');
  const status = document.getElementById('status');
  const guide = document.getElementById('guide');
  const ink = document.getElementById('ink');
  const current = document.getElementById('current');
  const next = document.getElementById('next');


  /* =====================================
     書き順データ
     現在は「あ」のみ
  ===================================== */

  const paths = {
  'あ': [
    // 1画目：横線
    'M105 155 Q250 140 395 125',

    // 2画目：縦線
    'M245 65 Q230 220 225 385',

    // 3画目：左下から丸く回り、右下へ払う
    'M330 215 C300 285 250 350 195 370 C145 390 125 350 145 305 C175 245 270 215 335 240 C415 270 425 365 350 415'
  ]
  };

  const strokes = paths[kana];

  if (!strokes) {

    stepEl.textContent =
      'この もじは じゅんびちゅうだよ';

    status.textContent =
      'まずは「あ」で れんしゅうしてね';

    board.style.pointerEvents = 'none';

    document.getElementById('reset').disabled = true;

  } else {

    let index = 0;
    let active = false;
    let points = [];
    let targetPoints = [];
    let progress = 0;

    const NS = 'http://www.w3.org/2000/svg';


    /* SVGの線を作成 */

    function addPath(parent, d) {
      const p = document.createElementNS(NS, 'path');

      p.setAttribute('d', d);
      parent.append(p);

      return p;
    }


    /* お手本の線を準備 */

    const reference = strokes.map(d => {
      return addPath(guide, d);
    });


    /* =====================================
       書き順ガイド表示
    ===================================== */

    function render() {

      reference.forEach((p, i) => {

  if (i < index) {
    // 書き終わった線は非表示
    p.style.opacity = '0';

  } else if (i === index) {
    // 今から書く線
    p.style.opacity = '1';
    p.style.stroke = '#bdbdbd';

  } else {
    // まだ書かない線
    p.style.opacity = '0.15';
    p.style.stroke = '#d3d3d3';
  }

});

      stepEl.textContent =
        index < strokes.length
          ? `${index + 1}かくめを なぞろう！`
          : 'できたね！';

      if (index === strokes.length) {

        status.textContent =
          '🌟 よくできました！ 🌟';

        next.hidden = false;
        return;
      }

      const path = reference[index];
      const len = path.getTotalLength();

      targetPoints = Array.from(
        { length: 17 },
        (_, i) => {
          const pt =
            path.getPointAtLength(len * i / 16);

          return {
            x: pt.x,
            y: pt.y
          };
        }
      );

      progress = 0;
      status.textContent = '';

      current.setAttribute('d', '');
    }


    /* =====================================
       タッチ位置を取得
    ===================================== */

    function point(evt) {

      const pt = board.createSVGPoint();

      pt.x = evt.clientX;
      pt.y = evt.clientY;

      return pt.matrixTransform(
        board.getScreenCTM().inverse()
      );
    }


    /* 線との距離を判定 */

    function near(a, b, dist = 58) {

      return Math.hypot(
        a.x - b.x,
        a.y - b.y
      ) < dist;
    }


    /* =====================================
       書き始め
    ===================================== */

    board.addEventListener('pointerdown', e => {

      if (index >= strokes.length) return;

      const p = point(e);

      if (!near(p, targetPoints[0])) {

        status.textContent =
          'ピンクの せんの はじまりから かいてね';

        return;
      }

      board.setPointerCapture(e.pointerId);

      active = true;
      points = [p];
      progress = 0;

      current.setAttribute(
        'd',
        `M${p.x} ${p.y}`
      );
    });


    /* =====================================
       指を動かして書く
    ===================================== */

    board.addEventListener('pointermove', e => {

      if (!active) return;

      const p = point(e);

      points.push(p);

      current.setAttribute(
        'd',
        points.map((v, i) =>
          `${i ? 'L' : 'M'}${v.x.toFixed(1)} ${v.y.toFixed(1)}`
        ).join(' ')
      );

      while (
        progress < targetPoints.length &&
        near(p, targetPoints[progress], 80)
      ) {
        progress++;
      }
    });


    /* =====================================
       書き終わりの判定
    ===================================== */

    function finish() {

      if (!active) return;

      active = false;

      const p = points.at(-1);

      if (
        progress >= targetPoints.length - 2 &&
        near(p, targetPoints.at(-1), 75)
      ) {

        addPath(ink, strokes[index]);

        index++;
        render();

      } else {

        status.textContent =
          'もういちど なぞってみよう！';

        current.setAttribute('d', '');
      }
    }


    board.addEventListener('pointerup', finish);

    board.addEventListener('pointercancel', () => {
      active = false;
      current.setAttribute('d', '');
    });


    /* =====================================
       やりなおすボタン
    ===================================== */

    document.getElementById('reset')
      .addEventListener('click', () => {

        index = 0;

        ink.replaceChildren();

        next.hidden = true;

        render();
      });


    /* =====================================
       次の文字へ
    ===================================== */

    next.addEventListener('click', () => {
      location.href = 'writing-select.html';
    });


    /* 初期表示 */

    render();
  }
}
