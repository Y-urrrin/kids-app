

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
  ['け', 'images/hiragana/keeki.png', 'けーき'],
  ['こ', 'images/hiragana/koala.png', 'こあら'],

  ['さ', 'images/hiragana/sakana.png', 'さかな'],
  ['し', 'images/hiragana/shika.png', 'しか'],
  ['す', 'images/hiragana/suika.png', 'すいか'],
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
  ['の', 'images/hiragana/noto.png', 'のーと'],

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
  ['ゆ', 'images/hiragana/unicorn.png', 'ゆにこーん'],
  ['よ', 'images/hiragana/yotto.png', 'よっと'],

  ['ら', 'images/hiragana/rappa.png', 'らっぱ'],
  ['り', 'images/hiragana/risu.png', 'りす'],
  ['る', 'images/hiragana/ruby.png', 'るびー'],
  ['れ', 'images/hiragana/remon.png', 'れもん'],
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
     書き順の設定
  ===================================== */

  const NS = 'http://www.w3.org/2000/svg';
  const reset = document.getElementById('reset');

  let strokes = [];
  let strokeShapes = [];
  let index = 0;
  let active = false;
  let pointerId = null;
  let drawn = [];
  let targets = [];
  let progress = 0;


  /* =====================================
     SVGの線を作成
  ===================================== */

  function svgPath(d, parent, color, width) {
    const p = document.createElementNS(NS, 'path');

    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-width', width);
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');

    parent.appendChild(p);

    return p;
  }


  /* =====================================
     座標をSVGの線に変換
  ===================================== */

  
function toD(points) {
  if (!points || points.length === 0) return '';

  if (points.length === 1) {
    return `M ${points[0][0]} ${points[0][1]}`;
  }

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x} ${cp1y},
             ${cp2x} ${cp2y},
             ${p2[0]} ${p2[1]}`;
  }

  return d;
}


  /* =====================================
     2点間の距離
  ===================================== */

  function distance(a, b) {
    return Math.hypot(
      a[0] - b[0],
      a[1] - b[1]
    );
  }


  /* =====================================
     指の位置を取得
  ===================================== */

  function position(e) {
    const matrix = board.getScreenCTM();

    if (!matrix) return null;

    const p = board.createSVGPoint();

    p.x = e.clientX;
    p.y = e.clientY;

    const result =
      p.matrixTransform(matrix.inverse());

    return [result.x, result.y];
  }


  /* =====================================
     書き順データを画数ごとに整理
  ===================================== */

  function groupMedians(data) {
    const groups = new Map();

    for (const entry of data.medians || []) {
      const match =
        String(entry.id).match(/^\d+/);

      if (!match || !Array.isArray(entry.value)) {
        continue;
      }

      const number = Number(match[0]);

      if (!groups.has(number)) {
        groups.set(number, []);
      }

      groups.get(number).push(entry);
    }

    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, parts]) => {

        // 同じ画番号の最初の中心線を使用
        const primary = parts[0];

        return primary.value
          .filter(p =>
            Array.isArray(p) && p.length >= 2
          )
          .map(p => [
            Number(p[0]),
            Number(p[1])
          ]);

      })
      .filter(points => points.length >= 2);
  }

function groupStrokeShapes(data) {
  const groups = new Map();

  for (const entry of data.strokes || []) {
    const match = String(entry.id).match(/^\d+/);
    if (!match) continue;

    const number = Number(match[0]);

    if (!groups.has(number)) {
      groups.set(number, []);
    }

    groups.get(number).push(entry.value);
  }

  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, paths]) => paths);
}

/* =====================================
   「あ」専用のなめらかな書き順
===================================== */

const customKanaPaths = {
  'あ': [
    // 1画目：左から右へ、なめらかな横線
    'M 260 305 C 390 315, 560 285, 720 255',

    // 2画目：上から下へ、少し曲がる縦線
    'M 405 160 ' +
    'C 415 215, 400 285, 385 365 ' +
    'C 365 480, 365 620, 425 735',

    // 3画目：左下から丸く回り、右下へ
    'M 595 445 ' +
    'C 620 470, 600 525, 555 595 ' +
    'C 490 695, 390 785, 280 795 ' +
    'C 215 800, 190 755, 210 690 ' +
    'C 235 605, 335 545, 445 510 ' +
    'C 565 470, 690 470, 765 515 ' +
    'C 855 570, 870 665, 815 755 ' +
    'C 765 835, 660 865, 555 880'
  ],

'い': [
  // 1画目：下に進み、最後は小さく内側へ曲がる
  'M 340 275 ' +
  'C 340 360, 345 490, 380 565 ' +
  'C 410 625, 455 650, 480 625 ' +
  'C 495 610, 505 585, 510 565',

  // 2画目：右上から下へ、ゆるやかな曲線
  'M 620 290 ' +
  'C 675 335, 715 410, 740 490 ' +
  'C 760 545, 765 580, 765 615'
]

};


/* SVGの曲線をなぞり判定用の点に変換 */
function pointsFromSvgPath(d) {
  const path = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  path.setAttribute('d', d);

  const length = path.getTotalLength();
  const count = Math.max(2, Math.ceil(length / 8));

  const points = [];

  for (let i = 0; i <= count; i++) {
    const p = path.getPointAtLength(
      length * i / count
    );

    points.push([p.x, p.y]);
  }

  return points;
}



  /* =====================================
     なぞり判定用の点を作成
  ===================================== */

  function sample(points, spacing = 23) {
    const result = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];

      const count = Math.max(
        1,
        Math.ceil(distance(a, b) / spacing)
      );

      for (let j = 1; j <= count; j++) {
        const t = j / count;

        result.push([
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t
        ]);
      }
    }

    return result;
  }


  /* =====================================
     書き順ガイドを表示
  ===================================== */

  function render() {
    guide.replaceChildren();

    current.setAttribute('d', '');

    drawn = [];
    active = false;
    pointerId = null;
    progress = 0;

    next.hidden = index !== strokes.length;

    if (index === strokes.length) {
      stepEl.textContent = 'できたね！';
      status.textContent =
        '🌟 よくできました！ 🌟';

      return;
    }

    stepEl.textContent =
      `${index + 1}かくめを なぞろう！`;

    status.textContent =
      'グレーの せんを なぞってね';

    

strokes.forEach((stroke, i) => {
  if (i < index) return;

  svgPath(
    toD(stroke),
    guide,
    i === index ? '#b8b8b8' : '#ededed',
    42
  );
});



    targets = sample(strokes[index]);

    // 書き始めのピンクの丸
    const start = strokes[index][0];

    const dot = document.createElementNS(NS, 'circle');

    dot.setAttribute('cx', start[0]);
    dot.setAttribute('cy', start[1]);
    dot.setAttribute('r', '24');
    dot.setAttribute('fill', '#ff83b1');

    guide.append(dot);
  }


  /* =====================================
     なぞった進行度を更新
  ===================================== */

  function advance(p) {
    while (
      progress < targets.length &&
      distance(p, targets[progress]) < 75
    ) {
      progress++;
    }
  }


  /* =====================================
     指で書き始めたとき
  ===================================== */

  board.addEventListener('pointerdown', e => {
    if (
      !strokes.length ||
      index >= strokes.length ||
      active
    ) {
      return;
    }

    const p = position(e);

    if (!p || distance(p, targets[0]) > 90) {
      status.textContent =
        'ピンクの まるから はじめてね';

      return;
    }

    e.preventDefault();

    board.setPointerCapture(e.pointerId);

    pointerId = e.pointerId;
    active = true;
    drawn = [p];
    progress = 0;

    advance(p);

    current.setAttribute('d', toD(drawn));

    status.textContent = '';
  });


  /* =====================================
     指を動かしているとき
  ===================================== */

  board.addEventListener('pointermove', e => {
    if (!active || e.pointerId !== pointerId) {
      return;
    }

    e.preventDefault();

    const p = position(e);
    if (!p) return;

    const prev = drawn[drawn.length - 1];

    const n = Math.max(
      1,
      Math.ceil(distance(prev, p) / 18)
    );

    for (let j = 1; j <= n; j++) {
      const t = j / n;

      const intermediate = [
        prev[0] + (p[0] - prev[0]) * t,
        prev[1] + (p[1] - prev[1]) * t
      ];

      advance(intermediate);
    }

    drawn.push(p);

    current.setAttribute('d', toD(drawn));
  });


  /* =====================================
     指を離したとき
  ===================================== */

  board.addEventListener('pointerup', e => {
    if (!active || e.pointerId !== pointerId) {
      return;
    }

    active = false;
    pointerId = null;

    const end = drawn[drawn.length - 1];
    const last = targets[targets.length - 1];

    if (
      progress >= targets.length - 2 &&
      distance(end, last) < 100
    ) {

      // 完成した画をピンクで表示
      
      svgPath(
      toD(strokes[index]),
      ink,
      '#fa689c',
      42
      );


      index++;
      render();

    } else {

      current.setAttribute('d', '');

      status.textContent =
        'もういちど なぞってみよう！';
    }
  });


  /* =====================================
     指の操作がキャンセルされたとき
  ===================================== */

  board.addEventListener('pointercancel', () => {
    active = false;
    pointerId = null;

    current.setAttribute('d', '');
  });


  /* =====================================
     やりなおすボタン
  ===================================== */

  reset.addEventListener('click', () => {
    index = 0;

    ink.replaceChildren();

    if (strokes.length) {
      render();
    }
  });


  /* =====================================
     次へボタン
  ===================================== */

  next.addEventListener('click', () => {
    location.href = 'writing-select.html';
  });


  /* =====================================
     JSONファイルを読み込む
  ===================================== */

  reset.disabled = true;
  board.style.pointerEvents = 'none';

  status.textContent =
    'おてほんを よみこんでいるよ…';

  fetch(
    `kana-data/${encodeURIComponent(data[0])}.json`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })

    .then(json => {
      if (
        !json ||
        json.charCode !== data[0].codePointAt(0)
      ) {
        throw new Error(
          '文字のデータが一致しません'
        );
      }

      
      
      if (customKanaPaths[data[0]]) {
    // 専用の滑らかな線がある文字
      strokes = customKanaPaths[data[0]].map(
      d => pointsFromSvgPath(d)
      );
    } else {
    // その他の文字はJSONの中心線を使う
      strokes = groupMedians(json);
    }

strokeShapes = groupStrokeShapes(json);



      if (!strokes.length) {
        throw new Error('中心線がありません');
      }

      board.style.pointerEvents = 'auto';
      reset.disabled = false;

      render();
    })

    .catch(error => {
      console.error(
        '書き順データを読み込めません:',
        error
      );

      status.textContent =
        'データを よみこめなかったよ';

      stepEl.textContent =
        'もういちど ひらいてね';
    });
}

