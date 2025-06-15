import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Award, Heart, Star, ExternalLink, ChevronLeft, Share2, Eye } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'input';
  options?: {
    text: string;
    points: number;
    nextQuestion?: number | 'end' | 'age_restriction' | 'adult_path' | 'teen_path' | 'senior_path' | 'disclaimer';
  }[];
  nextQuestion?: number | 'end' | 'disclaimer';
}

// sendAnswer関数を追加
async function sendAnswer(currentQuestionId: number, optionIndex: number) {
  try {
    await fetch('http://localhost:5000/submit_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: currentQuestionId, answer_index: optionIndex }),
    });
  } catch (error) {
    console.error('Failed to send answer:', error);
  }
}

// 10代向けの質問
const teenQuestions: Question[] = [
  {
    id: 1,
    text: "あなたの性別を教えてください",
    type: 'single',
    options: [
      { text: "男性", points: 0, nextQuestion: 2 },
      { text: "女性", points: 0, nextQuestion: 2 },
      { text: "その他", points: 0, nextQuestion: 2 }
    ]
  },
  {
    id: 2,
    text: "あなたの年齢を教えてください",
    type: 'single',
    options: [
      { text: "10代以下", points: 0, nextQuestion: 'age_restriction' },
      { text: "10代", points: 0, nextQuestion: 3 },
      { text: "20代～50代", points: 0, nextQuestion: 'adult_path' },
      { text: "60代以上", points: 0, nextQuestion: 'senior_path' }
    ]
  },
  {
    id: 3,
    text: "あなたの現在の生活環境を教えてください",
    type: 'single',
    options: [
      { text: "母親、父親と共に暮らしている", points: 0, nextQuestion: 4 },
      { text: "母親と暮らしている", points: 5, nextQuestion: 4 },
      { text: "父親と暮らしている", points: 7, nextQuestion: 4 },
      { text: "両親と暮らしていない", points: 10, nextQuestion: 4 },
      { text: "家出中である", points: 10, nextQuestion: 4 }
    ]
  },
  {
    id: 4,
    text: "現在の学校生活について教えてください",
    type: 'single',
    options: [
      { text: "学校には普通に通っている", points: 0, nextQuestion: 5 },
      { text: "学校には行っているがいじめに遭っている", points: 10, nextQuestion: 5 },
      { text: "学校はしばらく行っていない", points: 7, nextQuestion: 5 },
      { text: "学校は楽しい", points: -4, nextQuestion: 5 }
    ]
  },
  {
    id: 5,
    text: "あなたのお母さんについて教えてください",
    type: 'single',
    options: [
      { text: "とても優しく愛されていると感じる", points: 0, nextQuestion: 6 },
      { text: "時々厳しいが優しい母親だと思う", points: 0, nextQuestion: 6 },
      { text: "厳しいばかりで嫌になる", points: 7, nextQuestion: 6 },
      { text: "食事や家事をやってくれない", points: 7, nextQuestion: 6 },
      { text: "父親といつも喧嘩ばかりしている", points: 7, nextQuestion: 6 },
      { text: "否定されたり怒鳴られたりばかりである", points: 7, nextQuestion: 6 },
      { text: "暴力をふるわれることがある", points: 10, nextQuestion: 6 },
      { text: "お母さんと暮らしていないのでわからない", points: 5, nextQuestion: 6 },
      { text: "兄弟といつも比べられて否定される", points: 7, nextQuestion: 6 },
      { text: "愛されていないと感じる", points: 10, nextQuestion: 6 },
      { text: "家に居場所が無いと感じる", points: 10, nextQuestion: 6 }
    ]
  },
  {
    id: 6,
    text: "あなたのお友達・恋人環境について教えてください",
    type: 'single',
    options: [
      { text: "何でも話せる大親友・恋人がいる", points: -2, nextQuestion: 7 },
      { text: "友達と呼べる人はいるが仲良しではない", points: 7, nextQuestion: 7 },
      { text: "恋人はいるが仲良しではない", points: 7, nextQuestion: 7 },
      { text: "苦しい相談をできる人が誰もいない", points: 7, nextQuestion: 7 },
      { text: "SNS上では友達はいるがリアルではいない", points: 7, nextQuestion: 7 },
      { text: "友達なんていない", points: 7, nextQuestion: 7 }
    ]
  },
  {
    id: 7,
    text: "命に関わることについて教えてください",
    type: 'single',
    options: [
      { text: "生きていて辛いこともあるけど将来の夢もある", points: -2, nextQuestion: 8 },
      { text: "命とかについては深く考えたことはない", points: 0, nextQuestion: 8 },
      { text: "いつも心の中で消えたいと考えている", points: 7, nextQuestion: 8 },
      { text: "実際に未遂アクションを起こしたことがある", points: 10, nextQuestion: 8 }
    ]
  },
  {
    id: 8,
    text: "依存対象について教えてください",
    type: 'single',
    options: [
      { text: "何かに依存しているとは思わない", points: -2, nextQuestion: 9 },
      { text: "リストカット・ODをしている", points: 7, nextQuestion: 9 },
      { text: "Youtubeやゲーム・スマホに依存している", points: 4, nextQuestion: 9 },
      { text: "夜の街などに出掛けることに依存している", points: 5, nextQuestion: 9 },
      { text: "誰かをいじめることに依存している", points: 5, nextQuestion: 9 },
      { text: "恋愛することに依存している", points: 3, nextQuestion: 9 },
      { text: "上記以外に依存している", points: 4, nextQuestion: 9 }
    ]
  },
  {
    id: 9,
    text: "精神疾患について教えてください",
    type: 'single',
    options: [
      { text: "一度も心療内科・精神科に通院したことがない", points: -2, nextQuestion: 10 },
      { text: "親に心療内科・精神科に連れて行かれたことがある", points: 5, nextQuestion: 10 },
      { text: "心療内科・精神科で精神病名を診断されたことがある", points: 7, nextQuestion: 10 },
      { text: "一度も心療内科・精神科には通院していないが自分は病気だと思う", points: 5, nextQuestion: 10 }
    ]
  },
  {
    id: 10,
    text: "いじめ、虐待環境について教えてください",
    type: 'single',
    options: [
      { text: "現在家庭環境で虐待されている", points: 7, nextQuestion: 11 },
      { text: "たまに家庭環境で虐待がある", points: 5, nextQuestion: 11 },
      { text: "家庭環境で虐待があり学校でもいじめに遭っている", points: 10, nextQuestion: 11 },
      { text: "家庭環境で虐待はないが学校ではいじめに遭っている", points: 4, nextQuestion: 11 },
      { text: "家庭でも学校でもいじめと虐待はない", points: -2, nextQuestion: 11 }
    ]
  },
  {
    id: 11,
    text: "自分について教えてください",
    type: 'single',
    options: [
      { text: "いつも周囲に振り回されて自分の意見が無いと感じる", points: 7, nextQuestion: 12 },
      { text: "誰にも振り回されずに自分の意見はいつもあると感じる", points: -2, nextQuestion: 12 },
      { text: "どちらかわからない", points: 4, nextQuestion: 12 }
    ]
  },
  {
    id: 12,
    text: "今日の自分の自己肯定感を100点満点中で点数にしてください",
    type: 'input',
    nextQuestion: 'disclaimer'
  }
];

// 20代～50代向けの質問
const adultQuestions: Question[] = [
  {
    id: 1,
    text: "あなたの性別を教えてください",
    type: 'single',
    options: [
      { text: "男性", points: 0, nextQuestion: 2 },
      { text: "女性", points: 0, nextQuestion: 2 },
      { text: "その他", points: 0, nextQuestion: 2 }
    ]
  },
  {
    id: 2,
    text: "あなたの年齢を教えてください",
    type: 'single',
    options: [
      { text: "10代以下", points: 0, nextQuestion: 'age_restriction' },
      { text: "10代", points: 0, nextQuestion: 'teen_path' },
      { text: "20代～50代", points: 0, nextQuestion: 3 },
      { text: "60代以上", points: 0, nextQuestion: 'senior_path' }
    ]
  },
  {
    id: 3,
    text: "あなたの現在の生活環境を教えてください",
    type: 'single',
    options: [
      { text: "ご主人または奥様と子供と暮らしている", points: 0, nextQuestion: 4 },
      { text: "ご主人または奥様と暮らしているが子供はいない", points: 0, nextQuestion: 4 },
      { text: "ご主人または奥様と相手のご両親と暮らしている", points: 7, nextQuestion: 4 },
      { text: "ご主人または奥様と自分のご両親と暮らしている", points: 7, nextQuestion: 4 },
      { text: "今は離婚して別のパートナーと暮らしている", points: 0, nextQuestion: 4 },
      { text: "今は離婚して一人暮らしである", points: -2, nextQuestion: 4 },
      { text: "結婚しておらず一人暮らしである", points: -2, nextQuestion: 4 },
      { text: "結婚しておらず実家暮らしである", points: 5, nextQuestion: 4 },
      { text: "結婚していないし決まった住居もない", points: 7, nextQuestion: 4 }
    ]
  },
  {
    id: 4,
    text: "現在の仕事環境について教えてください",
    type: 'single',
    options: [
      { text: "就職していて普通に仕事している", points: 0, nextQuestion: 5 },
      { text: "仕事には行っているが職場でいじめに遭っている", points: 7, nextQuestion: 5 },
      { text: "仕事には行ってない", points: 7, nextQuestion: 5 },
      { text: "仕事が楽しい", points: -2, nextQuestion: 5 },
      { text: "精神病が原因で仕事に行けていない", points: 7, nextQuestion: 5 }
    ]
  },
  {
    id: 5,
    text: "あなたの幼少期について教えてください",
    type: 'single',
    options: [
      { text: "とても優しく愛されていたと感じる", points: 0, nextQuestion: 6 },
      { text: "時々厳しいが優しい母親だと思う", points: 0, nextQuestion: 6 },
      { text: "厳しいばかりで嫌だった", points: 7, nextQuestion: 6 },
      { text: "食事や家事をやってくれなかった", points: 7, nextQuestion: 6 },
      { text: "父親といつも喧嘩ばかりしていた", points: 7, nextQuestion: 6 },
      { text: "否定されたり怒鳴られたりばかりであった", points: 7, nextQuestion: 6 },
      { text: "暴力をふるわれることがあった", points: 10, nextQuestion: 6 },
      { text: "お母さんと暮らしていないのでわからない", points: 5, nextQuestion: 6 },
      { text: "兄弟といつも比べられて否定されていた", points: 7, nextQuestion: 6 },
      { text: "愛されていないと感じる", points: 10, nextQuestion: 6 },
      { text: "家に居場所が無かったと感じる", points: 10, nextQuestion: 6 }
    ]
  },
  {
    id: 6,
    text: "あなたのパートナー、恋人環境について教えてください",
    type: 'single',
    options: [
      { text: "パートナー及び恋人でお互いに愛し合っている", points: -2, nextQuestion: 7 },
      { text: "恋人またはパートナーは何でも話せる関係である", points: -2, nextQuestion: 7 },
      { text: "パートナー及び恋人とは同棲しており関係性は最悪である", points: 5, nextQuestion: 7 },
      { text: "パートナー及び恋人とは同棲していないが関係性は最悪である", points: 5, nextQuestion: 7 },
      { text: "パートナー及び恋人に虐待されている", points: 7, nextQuestion: 7 },
      { text: "パートナー及び恋人は空気のような存在である", points: 0, nextQuestion: 7 },
      { text: "パートナー及び恋人を自ら虐待している", points: 10, nextQuestion: 7 },
      { text: "苦しい相談をできる人は誰もいない", points: 5, nextQuestion: 7 }
    ]
  },
  {
    id: 7,
    text: "命に関わることについて教えてください",
    type: 'single',
    options: [
      { text: "生きていて辛いこともあるけど将来の夢もある", points: -2, nextQuestion: 8 },
      { text: "命とかについては深く考えたことはない", points: 0, nextQuestion: 8 },
      { text: "いつも心の中で消えたいと考えている", points: 7, nextQuestion: 8 },
      { text: "実際に未遂アクションを起こしたことがある", points: 10, nextQuestion: 8 }
    ]
  },
  {
    id: 8,
    text: "依存対象について教えてください",
    type: 'single',
    options: [
      { text: "何かに依存しているとは思わない", points: -2, nextQuestion: 9 },
      { text: "リストカット・ODをしている", points: 7, nextQuestion: 9 },
      { text: "ギャンブル依存である", points: 7, nextQuestion: 9 },
      { text: "アルコール依存である", points: 7, nextQuestion: 9 },
      { text: "Youtubeやゲーム・スマホに依存している", points: 4, nextQuestion: 9 },
      { text: "夜の街などに出掛けることに依存している", points: 5, nextQuestion: 9 },
      { text: "性に関わることに依存している", points: 5, nextQuestion: 9 },
      { text: "誰かをいじめることに依存している", points: 5, nextQuestion: 9 },
      { text: "恋愛することに依存している", points: 3, nextQuestion: 9 },
      { text: "上記以外に依存している", points: 4, nextQuestion: 9 }
    ]
  },
  {
    id: 9,
    text: "精神疾患について教えてください",
    type: 'single',
    options: [
      { text: "一度も心療内科・精神科に通院したことがない", points: -2, nextQuestion: 10 },
      { text: "心療内科・精神科に通院したことがある", points: 5, nextQuestion: 10 },
      { text: "心療内科・精神科で精神病名を診断されたことがある", points: 7, nextQuestion: 10 },
      { text: "現在も心療内科・精神科に通院し薬治療中である", points: 7, nextQuestion: 10 },
      { text: "一度も心療内科・精神科には通院していないが自分は病気だと思う", points: 5, nextQuestion: 10 },
      { text: "一度も自分が精神疾患だと思ったことがない", points: -4, nextQuestion: 10 }
    ]
  },
  {
    id: 10,
    text: "いじめ、虐待環境について教えてください",
    type: 'single',
    options: [
      { text: "現在暮らしている親から虐待されている", points: 7, nextQuestion: 11 },
      { text: "現在暮らしているパートナー及び恋人から虐待されている", points: 7, nextQuestion: 11 },
      { text: "現在働いている職場でいじめに遭っている", points: 6, nextQuestion: 11 },
      { text: "家庭環境で虐待があり職場ではいじめに遭っている", points: 7, nextQuestion: 11 },
      { text: "家庭でも職場でもいじめと虐待はない", points: -2, nextQuestion: 11 }
    ]
  },
  {
    id: 11,
    text: "自分について教えてください",
    type: 'single',
    options: [
      { text: "いつも周囲に振り回されて自分の意見が無いと感じる", points: 7, nextQuestion: 12 },
      { text: "誰にも振り回されずに自分の意見はいつもあると感じる", points: -2, nextQuestion: 12 },
      { text: "どちらかわからない", points: 4, nextQuestion: 12 }
    ]
  },
  {
    id: 12,
    text: "今日の自分の自己肯定感を100点満点中で点数にしてください",
    type: 'input',
    nextQuestion: 'disclaimer'
  }
];

// 60代以上向けの質問
const seniorQuestions: Question[] = [
  {
    id: 1,
    text: "あなたの性別を教えてください",
    type: 'single',
    options: [
      { text: "男性", points: 0, nextQuestion: 2 },
      { text: "女性", points: 0, nextQuestion: 2 },
      { text: "その他", points: 0, nextQuestion: 2 }
    ]
  },
  {
    id: 2,
    text: "あなたの年齢を教えてください",
    type: 'single',
    options: [
      { text: "10代以下", points: 0, nextQuestion: 'age_restriction' },
      { text: "10代", points: 0, nextQuestion: 'teen_path' },
      { text: "20代～50代", points: 0, nextQuestion: 'adult_path' },
      { text: "60代以上", points: 0, nextQuestion: 3 }
    ]
  },
  {
    id: 3,
    text: "あなたの現在の生活環境を教えてください",
    type: 'single',
    options: [
      { text: "ご主人または奥様と子供と暮らしている", points: 5, nextQuestion: 4 },
      { text: "ご主人または奥様と暮らしているが子供はいない", points: 0, nextQuestion: 4 },
      { text: "一人暮らしである", points: 7, nextQuestion: 4 },
      { text: "今は離婚して別のパートナーと暮らしている", points: 0, nextQuestion: 4 },
      { text: "今は離婚して一人暮らしである", points: -2, nextQuestion: 4 },
      { text: "結婚しておらず一人暮らしである", points: -2, nextQuestion: 4 },
      { text: "結婚しておらず実家暮らしである", points: 5, nextQuestion: 4 },
      { text: "結婚していないし決まった住居もない", points: 7, nextQuestion: 4 }
    ]
  },
  {
    id: 4,
    text: "現在の仕事環境について教えてください",
    type: 'single',
    options: [
      { text: "就職していて普通に仕事している", points: 0, nextQuestion: 5 },
      { text: "仕事には行っているが職場でいじめに遭っている", points: 7, nextQuestion: 5 },
      { text: "仕事には行っておらず退職し年金暮らしである", points: 0, nextQuestion: 5 },
      { text: "仕事が楽しい", points: -2, nextQuestion: 5 },
      { text: "精神病が原因で仕事に行けていない", points: 7, nextQuestion: 5 }
    ]
  },
  {
    id: 5,
    text: "あなたの幼少期について教えてください",
    type: 'single',
    options: [
      { text: "とても優しく愛されていたと感じる", points: 0, nextQuestion: 6 },
      { text: "時々厳しいが優しい母親だと思う", points: 0, nextQuestion: 6 },
      { text: "厳しいばかりで嫌だった", points: 7, nextQuestion: 6 },
      { text: "食事や家事をやってくれなかった", points: 7, nextQuestion: 6 },
      { text: "父親といつも喧嘩ばかりしていた", points: 7, nextQuestion: 6 },
      { text: "否定されたり怒鳴られたりばかりであった", points: 7, nextQuestion: 6 },
      { text: "暴力をふるわれることがあった", points: 10, nextQuestion: 6 },
      { text: "お母さんと暮らしていないのでわからない", points: 5, nextQuestion: 6 },
      { text: "兄弟といつも比べられて否定されていた", points: 7, nextQuestion: 6 },
      { text: "愛されていないと感じる", points: 10, nextQuestion: 6 },
      { text: "家に居場所が無かったと感じる", points: 10, nextQuestion: 6 }
    ]
  },
  {
    id: 6,
    text: "あなたのパートナー、恋人環境について教えてください",
    type: 'single',
    options: [
      { text: "パートナー及び恋人でお互いに愛し合っている", points: -2, nextQuestion: 7 },
      { text: "恋人またはパートナーは何でも話せる関係である", points: -2, nextQuestion: 7 },
      { text: "パートナー及び恋人とは同棲しており関係性は最悪である", points: 5, nextQuestion: 7 },
      { text: "パートナー及び恋人とは同棲していないが関係性は最悪である", points: 5, nextQuestion: 7 },
      { text: "パートナー及び恋人に虐待されている", points: 7, nextQuestion: 7 },
      { text: "パートナー及び恋人は空気のような存在である", points: 0, nextQuestion: 7 },
      { text: "パートナー及び恋人を自ら虐待している", points: 10, nextQuestion: 7 },
      { text: "苦しい相談をできる人は誰もいない", points: 5, nextQuestion: 7 }
    ]
  },
  {
    id: 7,
    text: "命に関わることについて教えてください",
    type: 'single',
    options: [
      { text: "生きていて辛いこともあるけどなんとか幸せである", points: -4, nextQuestion: 8 },
      { text: "命とかについては深く考えたことはない", points: 0, nextQuestion: 8 },
      { text: "いつも心の中で消えたいと考えている", points: 7, nextQuestion: 8 },
      { text: "時々ふとこのまま消えたいと考えることがある", points: 4, nextQuestion: 8 },
      { text: "実際に未遂アクションを起こしたことがある", points: 10, nextQuestion: 8 }
    ]
  },
  {
    id: 8,
    text: "依存対象について教えてください",
    type: 'single',
    options: [
      { text: "何かに依存しているとは思わない", points: -2, nextQuestion: 9 },
      { text: "リストカット・ODをしている", points: 7, nextQuestion: 9 },
      { text: "ギャンブル依存である", points: 7, nextQuestion: 9 },
      { text: "アルコール依存である", points: 7, nextQuestion: 9 },
      { text: "Youtubeやゲーム・スマホに依存している", points: 4, nextQuestion: 9 },
      { text: "夜の街などに出掛けることに依存している", points: 5, nextQuestion: 9 },
      { text: "性に関わることに依存している", points: 5, nextQuestion: 9 },
      { text: "誰かをいじめることに依存している", points: 5, nextQuestion: 9 },
      { text: "恋愛することに依存している", points: 3, nextQuestion: 9 },
      { text: "上記以外に依存している", points: 4, nextQuestion: 9 }
    ]
  },
  {
    id: 9,
    text: "精神疾患について教えてください",
    type: 'single',
    options: [
      { text: "一度も心療内科・精神科に通院したことがない", points: -2, nextQuestion: 10 },
      { text: "心療内科・精神科に通院したことがある", points: 5, nextQuestion: 10 },
      { text: "心療内科・精神科で精神病名を診断されたことがある", points: 7, nextQuestion: 10 },
      { text: "現在も心療内科・精神科に通院し薬治療中である", points: 7, nextQuestion: 10 },
      { text: "一度も心療内科・精神科には通院していないが自分は病気だと思う", points: 5, nextQuestion: 10 },
      { text: "一度も自分が精神疾患だと思ったことがない", points: -4, nextQuestion: 10 }
    ]
  },
  {
    id: 10,
    text: "いじめ、虐待環境について教えてください",
    type: 'single',
    options: [
      { text: "現在暮らしているパートナー及び恋人から虐待されている", points: 7, nextQuestion: 11 },
      { text: "現在働いている職場でいじめに遭っている", points: 6, nextQuestion: 11 },
      { text: "家庭環境で虐待があり職場ではいじめに遭っている", points: 7, nextQuestion: 11 },
      { text: "家庭でも職場でもいじめと虐待はない", points: -2, nextQuestion: 11 },
      { text: "自らがパートナーを虐待している", points: 7, nextQuestion: 11 },
      { text: "平和に暮らしている", points: -2, nextQuestion: 11 }
    ]
  },
  {
    id: 11,
    text: "自分について教えてください",
    type: 'single',
    options: [
      { text: "いつも周囲に振り回されて自分の意見が無いと感じる", points: 7, nextQuestion: 12 },
      { text: "誰にも振り回されずに自分の意見はいつもあると感じる", points: -2, nextQuestion: 12 },
      { text: "どちらかわからない", points: 4, nextQuestion: 12 }
    ]
  },
  {
    id: 12,
    text: "今日の自分の自己肯定感を100点満点中で点数にしてください",
    type: 'input',
    nextQuestion: 'disclaimer'
  }
];

const getScoreMessage = (score: number) => {
  if (score >= 85) {
    return {
      message: "あなたは健全で高い自己肯定感を持っています。自分を大切にし、前向きに人生を歩んでいますね。",
      color: "text-green-700",
      bgColor: "bg-green-50",
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
    };
  } else if (score >= 70) {
    return {
      message: "全体的に健康的な自己肯定感を持っています。時々の迷いはありますが、基本的に自分を信じることができています。",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
    };
  } else if (score >= 50) {
    return {
      message: "一般的なレベルの自己肯定感です。時には自信を持てますが、改善の余地があります。自分の良いところにもっと目を向けてみましょう。",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
    };
  } else {
    return {
      message: "自己肯定感を高める機会があります。小さな成功体験を積み重ね、自分の良いところを見つける練習をしてみましょう。きっと変わります。",
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-700" />
    };
  }
};

// 質問の履歴を管理するための型
interface QuestionHistory {
  questionId: number;
  answerIndex?: number;
  inputValue?: string;
  score: number;
}

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [score, setScore] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [inputValue, setInputValue] = useState('');
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const [currentPath, setCurrentPath] = useState<'teen' | 'adult' | 'senior'>('teen');
  const [showSharePreview, setShowSharePreview] = useState(false);

  // 現在のパスに応じた質問セットを取得
  const getQuestions = () => {
    switch (currentPath) {
      case 'adult':
        return adultQuestions;
      case 'senior':
        return seniorQuestions;
      default:
        return teenQuestions;
    }
  };

  const questions = getQuestions();
  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  // スコアを再計算する関数
  const recalculateScore = (history: QuestionHistory[]) => {
    let newScore = 100;
    
    for (const historyItem of history) {
      const question = questions.find(q => q.id === historyItem.questionId);
      if (!question) continue;
      
      if (question.type === 'input' && historyItem.inputValue !== undefined) {
        const inputScore = parseInt(historyItem.inputValue);
        let pointsToDeduct = 0;
        if (inputScore >= 0 && inputScore <= 25) {
          pointsToDeduct = 10;
        } else if (inputScore >= 26 && inputScore <= 50) {
          pointsToDeduct = 4;
        } else if (inputScore >= 51 && inputScore <= 75) {
          pointsToDeduct = 0;
        } else if (inputScore >= 76 && inputScore <= 100) {
          pointsToDeduct = -2;
        }
        newScore = Math.max(0, newScore - pointsToDeduct);
      } else if (question.options && historyItem.answerIndex !== undefined) {
        const selectedOption = question.options[historyItem.answerIndex];
        newScore = Math.max(0, newScore - selectedOption.points);
      }
    }
    
    return newScore;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion || !currentQuestion.options) return;
    
    const selectedOption = currentQuestion.options[optionIndex];
    setSelectedAnswer(optionIndex);
    setIsAnimating(true);
    
    setTimeout(() => {
      // 履歴に追加
      const newHistoryItem: QuestionHistory = {
        questionId: currentQuestionId,
        answerIndex: optionIndex,
        score: Math.max(0, score - selectedOption.points)
      };
      
      const newHistory = [...questionHistory, newHistoryItem];
      setQuestionHistory(newHistory);
      
      // 回答を記録
      setAnswers(prev => ({...prev, [currentQuestionId]: optionIndex}));  

      sendAnswer(currentQuestionId, optionIndex).catch(console.error);
      
      // スコアを更新
      const newScore = Math.max(0, score - selectedOption.points);
      setScore(newScore);
      
      // 次の質問または終了処理
      if (selectedOption.nextQuestion === 'age_restriction') {
        setAgeRestricted(true);
      } else if (selectedOption.nextQuestion === 'adult_path') {
        setCurrentPath('adult');
        setCurrentQuestionId(3); // 大人向けの質問3から開始
        setSelectedAnswer(null);
      } else if (selectedOption.nextQuestion === 'teen_path') {
        setCurrentPath('teen');
        setCurrentQuestionId(3); // 10代向けの質問3から開始
        setSelectedAnswer(null);
      } else if (selectedOption.nextQuestion === 'senior_path') {
        setCurrentPath('senior');
        setCurrentQuestionId(3); // 60代以上向けの質問3から開始
        setSelectedAnswer(null);
      } else if (selectedOption.nextQuestion === 'end' || !selectedOption.nextQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestionId(selectedOption.nextQuestion);
        setSelectedAnswer(null);
      }
      setIsAnimating(false);
    }, 800);
  };

  const handleInputSubmit = () => {
    if (!currentQuestion || currentQuestion.type !== 'input') return;
    
    const inputScore = parseInt(inputValue);
    if (isNaN(inputScore) || inputScore < 0 || inputScore > 100) {
      alert('0から100の間の数字を入力してください');
      return;
    }
    
    setIsAnimating(true);
    
    setTimeout(() => {
      // スコア計算
      let pointsToDeduct = 0;
      if (inputScore >= 0 && inputScore <= 25) {
        pointsToDeduct = 10;
      } else if (inputScore >= 26 && inputScore <= 50) {
        pointsToDeduct = 4;
      } else if (inputScore >= 51 && inputScore <= 75) {
        pointsToDeduct = 0;
      } else if (inputScore >= 76 && inputScore <= 100) {
        pointsToDeduct = -2;
      }
      
      const newScore = Math.max(0, score - pointsToDeduct);
      
      // 履歴に追加
      const newHistoryItem: QuestionHistory = {
        questionId: currentQuestionId,
        inputValue: inputValue,
        score: newScore
      };
      
      const newHistory = [...questionHistory, newHistoryItem];
      setQuestionHistory(newHistory);
      
      // 回答を記録
      setAnswers(prev => ({...prev, [currentQuestionId]: inputScore}));

      sendAnswer(currentQuestionId, optionIndex).catch(console.error);
      
      setScore(newScore);
      
      // 次の質問または終了処理
      if (currentQuestion.nextQuestion === 'disclaimer') {
        setShowDisclaimer(true);
      } else if (currentQuestion.nextQuestion === 'end' || !currentQuestion.nextQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestionId(currentQuestion.nextQuestion);
        setInputValue('');
      }
      setIsAnimating(false);
    }, 800);
  };

  const handleGoBack = () => {
    if (questionHistory.length === 0) return;
    
    // 最後の履歴を削除
    const newHistory = questionHistory.slice(0, -1);
    setQuestionHistory(newHistory);
    
    // スコアを再計算
    const newScore = recalculateScore(newHistory);
    setScore(newScore);
    
    // 前の質問に戻る
    if (newHistory.length === 0) {
      setCurrentQuestionId(1);
      setSelectedAnswer(null);
      setInputValue('');
      setCurrentPath('teen');
    } else {
      const lastHistoryItem = newHistory[newHistory.length - 1];
      setCurrentQuestionId(lastHistoryItem.questionId);
      
      // 前の回答を復元
      const question = questions.find(q => q.id === lastHistoryItem.questionId);
      if (question?.type === 'input' && lastHistoryItem.inputValue !== undefined) {
        setInputValue(lastHistoryItem.inputValue);
        setSelectedAnswer(null);
      } else if (lastHistoryItem.answerIndex !== undefined) {
        setSelectedAnswer(lastHistoryItem.answerIndex);
        setInputValue('');
      }
    }
    
    // answersからも削除
    const updatedAnswers = {...answers};
    delete updatedAnswers[currentQuestionId];
    setAnswers(updatedAnswers);
  };

  const resetGame = () => {
    setCurrentQuestionId(1);
    setScore(100);
    setGameStarted(false);
    setShowExplanation(false);
    setGameFinished(false);
    setShowDisclaimer(false);
    setAgeRestricted(false);
    setSelectedAnswer(null);
    setIsAnimating(false);
    setAnswers({});
    setInputValue('');
    setQuestionHistory([]);
    setCurrentPath('teen');
    setShowSharePreview(false);
  };

  const startExplanation = () => {
    setShowExplanation(true);
  };

  const startQuestions = () => {
    setGameStarted(true);
    setShowExplanation(false);
  };

  const proceedToResults = () => {
    setShowDisclaimer(false);
    setGameFinished(true);
  };

  // SNSシェア機能
  const shareToTwitter = () => {
    const worthlessnessScore = 100 - score;
    const text = `自己肯定感スコアチェックの結果：\n自己肯定感スコア: ${score}点\n無価値感スコア: ${worthlessnessScore}点\n今日からかんじょうにっきを始めます\n\n#自己肯定感 #テープ式心理学 #かんじょうにっき #NAMIDAサポート協会`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToLine = () => {
    const worthlessnessScore = 100 - score;
    const text = `自己肯定感スコアチェックの結果：\n自己肯定感スコア: ${score}点\n無価値感スコア: ${worthlessnessScore}点\n今日からかんじょうにっきを始めます`;
    const url = window.location.href;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`;
    window.open(lineUrl, '_blank');
  };

  // 共有内容のプレビュー
  const getShareContent = () => {
    const worthlessnessScore = 100 - score;
    return {
      twitter: `自己肯定感スコアチェックの結果：\n自己肯定感スコア: ${score}点\n無価値感スコア: ${worthlessnessScore}点\n今日からかんじょうにっきを始めます\n\n#自己肯定感 #テープ式心理学 #かんじょうにっき #NAMIDAサポート協会\n\n${window.location.href}`,
      line: `自己肯定感スコアチェックの結果：\n自己肯定感スコア: ${score}点\n無価値感スコア: ${worthlessnessScore}点\n今日からかんじょうにっきを始めます\n\n${window.location.href}`
    };
  };

  // パス名を取得する関数
  const getPathName = () => {
    // 質問1と2では年齢パスを表示しない
    if (currentQuestionId <= 2) {
      return '';
    }
    
    switch (currentPath) {
      case 'adult':
        return '(20代～50代向け)';
      case 'senior':
        return '(60代以上向け)';
      default:
        return '(10代向け)';
    }
  };

  // 共有プレビュー画面
  if (showSharePreview) {
    const shareContent = getShareContent();
    
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-4 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-xs text-stone-500 font-light mb-2 sm:mb-3">
              一般社団法人NAMIDAサポート協会
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-blue-200">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-light text-stone-800 mb-2 sm:mb-4">
              共有内容プレビュー
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* X（Twitter）の共有内容 */}
            <div className="bg-black rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-white font-medium text-sm sm:text-base">X（Twitter）</span>
              </div>
              <div className="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <pre className="text-white text-xs sm:text-sm whitespace-pre-wrap font-light leading-relaxed">
                  {shareContent.twitter}
                </pre>
              </div>
            </div>
            
            {/* LINEの共有内容 */}
            <div className="bg-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 bg-white rounded text-green-600 flex items-center justify-center text-xs font-bold">
                  L
                </div>
                <span className="text-white font-medium text-sm sm:text-base">LINE</span>
              </div>
              <div className="bg-green-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <pre className="text-white text-xs sm:text-sm whitespace-pre-wrap font-light leading-relaxed">
                  {shareContent.line}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setShowSharePreview(false)}
              className="w-full bg-stone-200 text-stone-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-300 transition-all duration-300 text-sm sm:text-base"
            >
              戻る
            </button>
            <button
              onClick={shareToTwitter}
              className="w-full bg-black text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xで共有
            </button>
            <button
              onClick={shareToLine}
              className="w-full bg-green-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-green-700 transition-all duration-300 text-sm sm:text-base"
            >
              LINEで共有
            </button>
          </div>
        </div>
      </div>
    );
  }

  // スタート画面
  if (!showExplanation && !gameStarted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-xs text-stone-500 font-light mb-2 sm:mb-3">
              一般社団法人NAMIDAサポート協会
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-stone-200">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-stone-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-stone-800 mb-3 sm:mb-2 leading-tight">
              自己肯定感<br />
              スコアチェック
            </h1>
            <p className="text-stone-600 leading-relaxed font-light text-sm sm:text-base">
              質問に答えて、<br />
              あなたの自己肯定感レベルを<br />
              測定してみましょう
            </p>
          </div>
          
          <div className="bg-stone-100 rounded-xl sm:rounded-2xl p-4 mb-6 border border-stone-200">
            <div className="text-3xl sm:text-4xl font-light text-stone-800 mb-1">初期持ち点100点</div>
            <div className="text-xs sm:text-sm text-stone-600 mb-2 font-light">自己肯定感スコア100 = 無価値感スコア0</div>
            <div className="text-xs text-stone-500 font-light">スタート時のスコア</div>
          </div>
          
          <button
            onClick={startExplanation}
            className="w-full bg-green-200 text-green-800 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-green-300 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            計測を始める
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // 説明画面
  if (showExplanation && !gameStarted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-xs text-stone-500 font-light mb-2 sm:mb-3">
              一般社団法人NAMIDAサポート協会
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-stone-200">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-stone-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-light text-stone-800 mb-2 sm:mb-4">
              自己肯定感について
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6 text-stone-700 font-light leading-relaxed text-sm sm:text-base">
            <p>
              自己肯定感は自分自身の価値が肯定されている感覚を一般的に自己肯定感と呼びます。多くの人が自己肯定感が上がった下がったと言葉にしていますが、実際にどこを基準に上がったり下がったりしているのかをわかっていません。
            </p>
            
            <p>
              一般社団法人NAMIDAサポート協会が提唱するテープ式心理学では自己肯定感という感情を重視するのではなく、無価値感というネガティブな感情を重視する必要があると提唱しています。
            </p>
            
            <p>
              このアプリでは一般の方が普段から使用している自己肯定感をスコアにして見える化し後にご案内する「かんじょうにっき」と連携することで自己肯定感を育てていくことを目的としています。
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <p className="text-amber-800 font-medium mb-2 text-sm sm:text-base">重要なお知らせ</p>
              <p className="text-amber-700 text-sm sm:text-base">
                自己肯定感スコアで現れる数字はあくまでも見える化するために数字にしたものであり、あなたの人生においては無限大の自己肯定感があることを忘れないで下さい。
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <p className="text-blue-800 font-medium mb-2 text-sm sm:text-base">ご利用について</p>
              <p className="text-blue-700 text-sm sm:text-base">
                自己肯定感スコアチェックは後のかんじょうにっきに使用するものです。一度計測したら今後は計測する必要がありません。かんじょうにっきを始める人が最初に計測するためのものです。
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setShowExplanation(false)}
              className="w-full bg-stone-200 text-stone-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-300 transition-all duration-300 text-sm sm:text-base"
            >
              戻る
            </button>
            <button
              onClick={startQuestions}
              className="w-full bg-stone-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-700 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              質問を開始する
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 注意事項画面（質問12の後）
  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-xs text-stone-500 font-light mb-2 sm:mb-3">
              一般社団法人NAMIDAサポート協会
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-amber-200">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-light text-stone-800 mb-2 sm:mb-4">
              重要なお知らせ
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6 text-stone-700 font-light leading-relaxed text-sm sm:text-base">
            <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <p className="text-base sm:text-lg font-medium text-blue-800 mb-3 sm:mb-4 leading-tight">
                今から表示される自己肯定感スコアは<br />
                あなたの人生において何の意味も果たしません。
              </p>
              
              <p className="text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base">
                あくまでもこの後の「かんじょうにっき」で使用するだけの<br />
                点数だと認識していてください。
              </p>
              
              <p className="text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base">
                自己肯定感のようなポジティブな感情も<br />
                苦しみのようなネガティブな感情も<br />
                その人それぞれによって感じている感覚が異なります。
              </p>
              
              <p className="text-blue-700 text-sm sm:text-base">
                自己肯定感スコアが誰かと同じ点数だったとしても<br />
                全く同じではありません。
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <p className="text-amber-800 font-medium mb-2 text-sm sm:text-base">再度お伝えします</p>
              <p className="text-amber-700 text-sm sm:text-base">
                あくまでも、この後の「かんじょうにっき」で使用するだけの<br />
                点数だと認識するようにしてください。
              </p>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8">
            <button
              onClick={proceedToResults}
              className="w-full bg-stone-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-700 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              理解しました。結果を見る
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 年齢制限画面（10代以下）
  if (ageRestricted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-rose-200">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-medium text-stone-800 mb-3 sm:mb-4">
              申し訳ございません
            </h2>
            <p className="text-stone-700 leading-relaxed font-light mb-4 sm:mb-6 text-sm sm:text-base">
              自己肯定感スコアを計測出来ません。<br />
              またのご利用お待ちしております。
            </p>
            
            <div className="bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-rose-800 font-medium mb-2 text-sm sm:text-base">緊急時のサポート</p>
              <p className="text-rose-700 text-xs sm:text-sm leading-relaxed">
                万が一あなたがきけんな状態の場合は、<br />
                私たちに教えてください。
              </p>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => window.open('https://lin.ee/8L7r4Vn', '_blank')}
              className="w-full bg-green-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              LINEで相談する
            </button>
            
            <button
              onClick={resetGame}
              className="w-full bg-stone-200 text-stone-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-300 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              最初に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const result = getScoreMessage(score);
    const worthlessnessScore = 100 - score; // 無価値感スコアの計算
    
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-xs text-stone-500 font-light mb-2 sm:mb-3">
              一般社団法人NAMIDAサポート協会
            </div>
            <div className={`w-20 h-20 sm:w-24 sm:h-24 ${result.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-stone-200`}>
              {result.icon}
            </div>
            <h2 className="text-lg sm:text-2xl font-medium text-stone-800 mb-2">
              診断結果
            </h2>
          </div>
          
          {/* スコア表示を横並びに */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200">
              <div className="text-xl sm:text-2xl font-medium text-blue-800 mb-1">{score}点</div>
              <div className="text-xs sm:text-sm font-medium text-blue-700">
                自己肯定感スコア
              </div>
            </div>
            <div className="bg-rose-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-rose-200">
              <div className="text-xl sm:text-2xl font-medium text-rose-800 mb-1">{worthlessnessScore}点</div>
              <div className="text-xs sm:text-sm font-medium text-rose-700">
                無価値感スコア
              </div>
            </div>
          </div>
          
          <div className="bg-stone-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 border border-stone-200">
            <div className="text-stone-700 leading-relaxed font-light space-y-2 sm:space-y-3 text-sm sm:text-base">
              <p>
                自己肯定感スコアと無価値感スコアの<br />
                関係性に注目してください。
              </p>
              <p>
                自己肯定感スコアを高める方法は<br />
                無価値感スコアを下げることです。
              </p>
              <p className="font-medium text-stone-800">
                これから「かんじょうにっき」で<br />
                訓練していきましょう。
              </p>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => window.open('https://lin.ee/ohzcHDJ', '_blank')}
              className="w-full bg-green-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              かんじょうにっきを始める
            </button>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setShowSharePreview(true)}
                className="bg-blue-100 text-blue-700 font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl hover:bg-blue-200 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                プレビュー
              </button>
              <button
                onClick={shareToTwitter}
                className="bg-black text-white font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </button>
              <button
                onClick={shareToLine}
                className="bg-green-600 text-white font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                LINE
              </button>
            </div>
            
            <button
              onClick={resetGame}
              className="w-full bg-stone-200 text-stone-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-300 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 質問がない場合の表示
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-stone-200">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-stone-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-medium text-stone-800 mb-3 sm:mb-4">
              質問を準備中...
            </h2>
            <p className="text-stone-600 font-light text-sm sm:text-base">
              質問が設定されていません。<br />
              質問を追加してください。
            </p>
          </div>
          
          <button
            onClick={resetGame}
            className="w-full bg-stone-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-stone-700 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            TOPに戻る
          </button>
        </div>
      </div>
    );
  }

  // 質問画面
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200 p-4 sm:p-6 max-w-lg w-full">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            {questionHistory.length > 0 && (
              <button
                onClick={handleGoBack}
                disabled={isAnimating}
                className="mr-3 sm:mr-4 p-2 rounded-full hover:bg-stone-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
              </button>
            )}
            <div className="text-xs sm:text-sm text-stone-600 font-light">
              質問 {currentQuestionId} {getPathName()}
            </div>
          </div>
        </div>
        
        {/* 質問 */}
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <h2 className="text-lg sm:text-xl font-medium text-stone-800 mb-6 sm:mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>
          
          {/* 選択肢またはテキスト入力 */}
          {currentQuestion.type === 'input' ? (
            <div className="space-y-3 sm:space-y-4">
              <input
                type="number"
                min="0"
                max="100"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0〜100の数字を入力してください"
                className="w-full p-3 sm:p-4 text-center text-xl sm:text-2xl font-medium border border-stone-300 rounded-xl sm:rounded-2xl focus:outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                disabled={isAnimating}
              />
              <button
                onClick={handleInputSubmit}
                disabled={isAnimating || !inputValue}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  inputValue && !isAnimating
                    ? 'bg-stone-800 text-white hover:bg-stone-700'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                回答する
              </button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnimating}
                  className={`w-full p-3 sm:p-4 text-left rounded-xl sm:rounded-2xl transition-all duration-300 border ${
                    selectedAnswer === index
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 hover:border-stone-300'
                  } ${isAnimating ? 'pointer-events-none' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 ${
                      selectedAnswer === index ? 'bg-white' : 'bg-stone-300'
                    }`}></div>
                    <span className="font-light text-sm sm:text-base leading-relaxed">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
