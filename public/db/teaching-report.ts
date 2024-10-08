export type TEACHING_REPORT_EXAMPLES_TYPE = {
  stage: string;
  topic: string;
  detail: string;
};

export const TEACHING_REPORT_EXAMPLES: TEACHING_REPORT_EXAMPLES_TYPE[] = [
  {
    stage: '#1-1',
    topic: '動画の視聴方法・マイクラの操作方法',
    detail:
      '今回はロボットが進む向きを変えて、目標地点まで動かすプログラミングを作ってもらいました。',
  },
  {
    stage: '#1-2',
    topic: 'プログラミング編集画面の使い方',
    detail:
      '今回からプログラミングに触れながら問題を進めてもらいます。基本的なことを学習する段階なので、しっかり着実に進めてもらっています！',
  },
  {
    stage: '#1-3',
    topic: 'ステージを進める仕組み、ロボットを上下左右に進める',
    detail:
      'ロボットを前以外の方向に進めるプログラミングを作ってもらいました。プログラミングでロボットの動きを制御する感覚を身に着けることができたかと思います。',
  },
  {
    stage: '#1-4',
    topic: '特殊な動きのプログラミング',
    detail:
      'left, rightコマンドを用いてロボットの向きを変えるプログラミングをあたらに学習してもらいました。また、体験会で学習した内容の復習で、ロボットにブロックを置かせる問題を進めてもらいました。',
  },
  {
    stage: '#2-1',
    topic: '順次処理の導入',
    detail:
      '今回から一回の命令で最後までロボットが動くようにプログラミングを書く方法「順次処理」について学習してもらいました。問題によっては少し難しいものもあるかもしれないので、様子を見ながらサポートさせていただきます。',
  },
  {
    stage: '#2-2',
    topic: '順次処理の練習',
    detail:
      '前回に引き続き、一回の命令で最後までロボットが動くようにプログラミングを書く問題を勧めてもらいました。',
  },
  {
    stage: '#2-3',
    topic: '順次処理の練習、最短距離',
    detail:
      '・順次処理の続きです。単に最後まで1つのプログラムだけでクリアできるだけでなく、最短のプログラムでクリアすることを目指してもらいました。',
  },
  {
    stage: '#2-4',
    topic: '順次処理のまとめ',
    detail:
      '順次処理の内容のまとめの回でした。単元として順次処理の問題に集中的に取り組むのは最後ですが、今後の問題では基本的に順次処理で習ったことを応用してステージを進めてもらうことになります。',
  },
  {
    stage: '#3-1',
    topic: '繰り返しの導入',
    detail:
      '今日から繰り返しという内容に入りました。繰り返しでは、同じ動作をたくさんプログラミングをコピーして作るのではなく、繰り返しを使うことで簡単にプログラミングを書く方法です。繰り返しもプログラミングにとって非常に重要な内容になってくるので、しっかり学習していきましょう！',
  },
  {
    stage: '#3-2',
    topic: '繰り返しの練習',
    detail:
      '前回に引き続き、繰り返しの問題を解いてもらいました。繰り返しは重要な考え方なので、しっかり練習するカリキュラムとなっています。理解できたらその分進みも早いので、頑張ってできるようになりましょう！',
  },
  {
    stage: '#3-3',
    topic: '繰り返しの練習',
    detail:
      '今日は繰り返ししながら向きを変えて、四角形のコースをスムーズに進める問題を解いてもらいました。',
  },
  {
    stage: '#3-4',
    topic: '繰り返しのまとめ',
    detail:
      '繰り返しのまとめステージでした。ぐるぐる回りながら上方向に進んでいくような複雑なステージだったので、少し難しかったかもしれませんが、繰り返しの使い方がかなり理解できたかと思います！',
  },
  {
    stage: '初級ドリル',
    topic: '初級の特訓',
    detail:
      '初級の内容学習が終わったので、ドリルステージで前回までの内容の復習をしてもらいました。',
  },
  { stage: '初級検定', topic: '初級の確認テスト', detail: '今回は初めてのテストでした。' },
  {
    stage: '初級ＢＳ',
    topic: '初級検定のボーナスステージ',
    detail:
      '前回ボーナスステージを頑張ったので、今回はボーナスステージを進めてもらいました。ダンジョン形式で学びながら楽しめたと思います。',
  },
  {
    stage: '#4-1',
    topic: '多重ループ 導入',
    detail:
      '今回はステージ3の内容の発展である、「多重ループ」を学習してもらいました。少し複雑な問題もありますが、わからないところはしっかり解説していくので、一緒に頑張りましょう！',
  },
  {
    stage: '#4-2',
    topic: '多重ループの練習',
    detail:
      '多重ループの問題を進めてもらいました。前回は導入的な問題のみでしたが、今回は本質的な理解を問う問題に取り組んでもらいました。',
  },
  {
    stage: '#4-3',
    topic: '多重ループの練習',
    detail:
      '多重ループを使って、塔をぐるぐる回りながらブロックを置いていく問題を進めてもらいました。',
  },
  {
    stage: '#4-4',
    topic: '多重ループまとめ',
    detail: '今回は多重ループを使ってばくだんを設置していき、塔をばくはするステージでした。',
  },
  {
    stage: '家をつくろう',
    topic: '多重ループの応用',
    detail: '多重ループの応用として、コマンドで家を作る問題にチャレンジしてもらいました。',
  },
  {
    stage: '#5-1',
    topic: '条件分岐の導入',
    detail:
      '今回から条件分岐の内容に入ります。条件分岐では、下のブロックに応じて様々な動作ができるようになります。プログラミングでは重要な考え方になってくるので、しっかり学習しましょう。',
  },
  {
    stage: '#5-2',
    topic: '条件分岐の練習',
    detail: '前回よりも少し複雑な条件分岐の問題を解いてもらいました。',
  },
  {
    stage: '#5-3',
    topic: '条件分岐の練習',
    detail:
      '前回までは条件に当てはまる動作を指定していましたが、今回からは条件に「当てはまらない」動作を指定する方法を学習しました。',
  },
  {
    stage: '#5-4',
    topic: '条件付き繰り返し',
    detail: '今回は前回までの条件分岐に加えて、条件付き繰り返しの問題を解いてもらいました。',
  },
  {
    stage: '#6-1',
    topic: '複数条件分岐',
    detail: '前回までの条件分岐の内容に加えて、条件を複数設定する方法を学習しました。',
  },
  {
    stage: '#6-2',
    topic: '条件の応用',
    detail: '条件つき繰り返しの中で条件を使うような問題に取り組んでもらいました。',
  },
  {
    stage: '#6-3',
    topic: '条件分岐の応用',
    detail:
      '前回に引き続き、条件つき繰り返しや条件分岐をたくさん使う問題に取り組んでもらいました。条件分岐は重要な概念なので繰り返し学習してもらいます。',
  },
  {
    stage: '#6-4',
    topic: '条件分岐のまとめ',
    detail:
      '条件分岐のまとめの回でした。これまで様々な種類の条件分岐の問題を解いてもらったので、しっかり理解できたかと思います！',
  },
  {
    stage: '中級ドリル',
    topic: 'ステージ4~6の特訓',
    detail: '中級で学習した内容を復習するためのステージに取り組んでもらいました。',
  },
  {
    stage: '中級検定',
    topic: 'ステージ4~6の確認テスト',
    detail:
      '中級で学習した内容がしっかり理解できているかを確認するステージを取り組んでもらいました。',
  },
  {
    stage: '中級ＢＳ',
    topic: '中級検定のボーナスステージ',
    detail: '中級の内容を使ったボーナスステージを進めてもらいました。',
  },
  {
    stage: '#7-1',
    topic: '変数の導入',
    detail:
      '一度決めた数字をたくさん使いまわすときや、数値を管理する際に便利な「変数」の使い方を学習してもらいました。',
  },
  {
    stage: '#7-2',
    topic: '変数の練習',
    detail:
      '変数の問題を練習してもらいました。前回と今回で変数の基礎的な使い方を学んでもらい、次回から本格的な問題に取り組んでもらいます。',
  },
  {
    stage: '#7-3',
    topic: '変数の練習',
    detail:
      '前回に引き続き変数の練習をしてもらいました。前回までは変数の単純な使い方の練習でしたが、今回からは変数を使って数をかぞえるテクニックを学習してもらいました。',
  },
  {
    stage: '#7-4',
    topic: '変数のまとめ',
    detail:
      '今回は変数のまとめでした。変数の考え方は中学の数学で必要になってくるほか、プログラミングでも必須の考え方なのでしっかり覚えておいてもらえればと思います！',
  },
  {
    stage: 'ミニゲーム-1',
    topic: '条件と変数の応用',
    detail:
      '条件と変数を使ってマイクラ上でミニゲームを制作してもらいました。ステージ6と7の内容への理解がより深まったと思います。',
  },
  {
    stage: 'ミニゲーム-2',
    topic: '条件と変数の応用',
    detail:
      '前回に引き続き、変数と条件分岐を使ったミニゲームを制作してもらいました。息抜き的な内容ではありましたが、しっかり学習できていると思います。',
  },
  {
    stage: 'ミニゲーム-3',
    topic: '条件と変数の応用',
    detail:
      '今回も条件分岐と変数を使ってミニゲームを制作してもらいました。次回からは変数を応用した「配列」という難しい考え方を学習しますが、今回のステージで変数の理解はばっちりかと思います。配列が終われば、また今回のようなミニゲーム制作コースがあるので、お楽しみにしていてください^^',
  },
  {
    stage: '#8-1',
    topic: '変数の応用',
    detail:
      '今回は前回までの変数の内容をより複雑にした問題を解いてもらいました。次回からは変数をまとめて扱いやすくする「配列」という考え方を学習してもらいます。',
  },
  {
    stage: '#8-2',
    topic: '配列の導入',
    detail:
      '変数の発展的な内容である「配列」の学習に入りました。配列は複数の変数をまとめて扱いやすくする考え方です。今後の問題に必須の考え方になってくるので、しっかり学習しましょう。',
  },
  {
    stage: '#8-3',
    topic: '配列の練習',
    detail:
      'このステージでは配列を使って、ブロックの位置をデータとして記憶し、そのデータをもとにブロックを設置する（データをコピーする）考え方について学習しました。',
  },
  {
    stage: '#8-4',
    topic: '配列の確認・まとめ',
    detail:
      '配列の問題を引き続き進めてもらいました。問題が難しく、復習問題にもに時間がかかってしまった配列は「そんなものがあるんだ」程度に理解しておけば大丈夫です。また本格的にコーディングを学習する際に思い出せるようにしておきましょう！',
  },
  {
    stage: '討伐ゲーム-1',
    topic: '配列を応用してゲームを作ろう！',
    detail: '配列を使って3種類のモブを倒した数をカウントするゲームを作成しました。',
  },
  {
    stage: '討伐ゲーム-2',
    topic: '配列を応用してゲームを作ろう！',
    detail: '配列を使って敵を倒した数をカウントするゲームを作成しました。',
  },
  {
    stage: '討伐ゲーム-3',
    topic: '配列を応用してゲームを作ろう！',
    detail: '配列を使って、敵を順番に出現させるゲームを作成しました。',
  },
  {
    stage: '#9-1',
    topic: '関数の導入',
    detail:
      '今回はたくさんのコードを一つのコートどしてまとめて使用できるようにする関数の考え方を学習しました',
  },
  {
    stage: '#9-2',
    topic: '関数の練習',
    detail:
      '前回初めて学習した関数の考え方を使って、同じ形がたくさん含まれるステージを簡単にクリアする方法を学習しました。',
  },
  {
    stage: '#9-3',
    topic: '引数を使った関数',
    detail:
      '今回は、関数を使用する（実行する）際に任意の値を指定して呼び出す仕組みを学習しました。',
  },
  {
    stage: '#9-4',
    topic: '関数のまとめ',
    detail:
      '関数の問題を進めてもらいました。数値を複数使う問題で、少し複雑な問題に取り組んでもらいました。',
  },
  {
    stage: '上級ドリル',
    topic: 'ステージ7~9の特訓',
    detail: '中級で学習した内容を復習するためのステージに取り組んでもらいました。',
  },
  {
    stage: '上級検定',
    topic: 'ステージ7~9の確認',
    detail: '今日は3回目の検定である上級検定にチャレンジしてもらいました。',
  },
  {
    stage: '上級エクストラステージ',
    topic: '',
    detail: '上級の内容を使ったボーナスステージを進めてもらいました。',
  },
  {
    stage: '#10-1',
    topic: '座標',
    detail:
      '今回から座標の単元に入りました。座標では、ゲーム制作に必要な空間のとらえ方を学習します。また3D空間認識が得意になると、作業効率が上昇することが知られています。他の内容と比較すると問題の難易度は低めになってしまいますが、大切な単元なのでしっかり学習しましょう。',
  },
  {
    stage: '#10-2',
    topic: '座標（3次元）',
    detail:
      '前回学習したx, y座標に加え、新たにz座標を加えた3次元系の問題に取り組んでもらいました。',
  },
  {
    stage: '#10-3',
    topic: '座標(絶対座標・相対座標)',
    detail:
      '今回は、ワールド全体で決められた「絶対座標」と、ある特定からの相対的な位置を座標としてあらわした「相対座標」について学習してもらいました。',
  },
  {
    stage: '#10-4',
    topic: '座標　まとめ',
    detail:
      '今まで学習した座標に関する内容を応用して、家を作るプログラミングを学習してもらいました。',
  },
  {
    stage: '#11-1',
    topic: '乱数の導入',
    detail:
      '乱数の単元が始まりました。この単元では乱数（ランダムな数字）を生成し、その数字を使って様々な処理を実行する内容です。',
  },
  {
    stage: '#11-2',
    topic: '乱数続き',
    detail:
      '今回も乱数の学習を進めてもらいました。今回のステージでは、乱数を使っておみくじの機能を作ってもらいました。',
  },
  {
    stage: '#11-3',
    topic: '乱数続き',
    detail:
      '2次元の外壁で囲われたエリアで、短い壁を2方向どちらかランダムに生成しては1列移動し、端まできたら1行ずれて反対側の端まで移動し、また壁を生成する動作を繰り返し、必ず出口と入口が生成される条件で迷路をプログラムで作成しました。',
  },
  {
    stage: '#11-4',
    topic: '乱数のまとめ',
    detail: '前回の内容を応用して、平面方向に広い迷路を作成してもらいました。',
  },
  {
    stage: '#12-1',
    topic: '確率の導入',
    detail: '確率の単元では、乱数の考え方を応用して、確率の考え方を学習します。',
  },
  {
    stage: '#12-2',
    topic: '確率続き',
    detail: '確率を使って「おみくじ」を作る問題に取り組んでもらいました。',
  },
  {
    stage: '#12-3',
    topic: '確率続き',
    detail:
      '確率の概念をさらに深くまで学習してもらいました。次回は今まで学習した内容をもとに、人生ゲームを制作してもらいます。',
  },
  {
    stage: '#12-4',
    topic: '確率のまとめ',
    detail: '確率を使って人生ゲームを作成してもらいました。',
  },
  { stage: '#13-1', topic: '', detail: '' },
  { stage: '#13-2', topic: '', detail: '' },
  { stage: '#13-3', topic: '', detail: '' },
  { stage: '#13-4', topic: '', detail: '' },
  { stage: '#14-1', topic: '', detail: '' },
  { stage: '#14-2', topic: '', detail: '' },
  { stage: '#14-3', topic: '', detail: '' },
  { stage: '#14-4', topic: '', detail: '' },
  { stage: '#15-1', topic: '', detail: '' },
  { stage: '#15-2', topic: '', detail: '' },
  { stage: '#15-3', topic: '', detail: '' },
  { stage: '#15-4', topic: '', detail: '' },
  { stage: '#16-1', topic: '', detail: '' },
  { stage: '#16-2', topic: '', detail: '' },
  { stage: '#16-3', topic: '', detail: '' },
  { stage: '#16-4', topic: '', detail: '' },
  { stage: '#17-1', topic: '', detail: '' },
  { stage: '#17-2', topic: '', detail: '' },
  { stage: '#17-3', topic: '', detail: '' },
  {
    stage: '#17-4',
    topic: 'アクションゲーム　ボスを追加しよう',
    detail:
      '今回はアクションゲームの要素として、ボスステージに到達したらボスが出現するプログラムを実装してもらいました。',
  },
  { stage: '#18-1', topic: '', detail: '' },
  { stage: '#18-2', topic: '', detail: '' },
  { stage: '#18-3', topic: '', detail: '' },
  { stage: '#18-4', topic: '', detail: '' },
  { stage: '#19-1', topic: '', detail: '' },
  { stage: '#19-2', topic: '', detail: '' },
  { stage: '#19-3', topic: '', detail: '' },
  { stage: '#19-4', topic: '', detail: '' },
  { stage: '#20-1', topic: '', detail: '' },
  { stage: '#20-2', topic: '', detail: '' },
  { stage: '#20-3', topic: '', detail: '' },
  { stage: '#20-4', topic: '', detail: '' },
  { stage: '#21-1', topic: '', detail: '' },
  { stage: '#21-2', topic: '', detail: '' },
  { stage: '#21-3', topic: '', detail: '' },
  { stage: '#21-4', topic: '', detail: '' },
  { stage: '#22-1', topic: '', detail: '' },
  { stage: '#22-2', topic: '', detail: '' },
  { stage: '#22-3', topic: '', detail: '' },
  { stage: '#22-4', topic: '', detail: '' },
  { stage: '#23-1', topic: '', detail: '' },
  { stage: '#23-2', topic: '', detail: '' },
  { stage: '#23-3', topic: '', detail: '' },
  { stage: '#23-4', topic: '', detail: '' },
  { stage: '#24-1', topic: '', detail: '' },
  { stage: '#24-2', topic: '', detail: '' },
  { stage: '#24-3', topic: '', detail: '' },
  { stage: '#24-4', topic: '', detail: '' },
];
