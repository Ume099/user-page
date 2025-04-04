// react-hoook-formで管理するオブジェクトの型
export type TeachingReportTemplateInputType = {
  studentUid: string;
  date: Date;
  classTime: string;
  stage: string;
  topic: string;
  detail: string;
  behavior: string;
  rikaido: string;
  comment: string;
  isPublished: boolean;
  isOriginalStage: boolean;
  stageName?: string;
  isOriginalTopic: boolean;
  toopic?: string;
  isOriginalBehav: boolean;
  isForAd?: boolean;
};

export type TeachingReportTemplateInputPostType = {
  stage: string;
  topic: string;
  detail: string;
};

export const stageList: string[] = [
  '',
  '1-1',
  '1-2',
  '1-3',
  '1-4',
  '2-1',
  '2-2',
  '2-3',
  '2-4',
  '3-1',
  '3-2',
  '3-3',
  '3-4',
  '初級ドリル',
  '初級検定',
  '初級ＢＳ',
  '4-1',
  '4-2',
  '4-3',
  '4-4',
  '家をつくろう',
  '5-1',
  '5-2',
  '5-3',
  '5-4',
  '6-1',
  '6-2',
  '6-3',
  '6-4',
  '中級ドリル',
  '中級検定',
  '中級ＢＳ',
  '7-1',
  '7-2',
  '7-3',
  '7-4',
  'ミニゲーム-1',
  'ミニゲーム-2',
  'ミニゲーム-3',
  '8-1',
  '8-2',
  '8-3',
  '8-4',
  '討伐ゲーム-1',
  '討伐ゲーム-2',
  '討伐ゲーム-3',
  '9-1',
  '9-2',
  '9-3',
  '9-4',
  '上級ドリル',
  '上級検定',
  '上級エクストラステージ',
  '10-1',
  '10-2',
  '10-3',
  '10-4',
  '11-1',
  '11-2',
  '11-3',
  '11-4',
  '12-1',
  '12-2',
  '12-3',
  '12-4',
  '13-1',
  '13-2',
  '13-3',
  '13-4',
  '14-1',
  '14-2',
  '14-3',
  '14-4',
  '15-1',
  '15-2',
  '15-3',
  '15-4',
  '16-1',
  '16-2',
  '16-3',
  '16-4',
  '17-1',
  '17-2',
  '17-3',
  '17-4',
  '18-1',
  '18-2',
  '18-3',
  '18-4',
  '19-1',
  '19-2',
  '19-3',
  '19-4',
  '20-1',
  '20-2',
  '20-3',
  '20-4',
  '21-1',
  '21-2',
  '21-3',
  '21-4',
  '22-1',
  '22-2',
  '22-3',
  '22-4',
  '23-1',
  '23-2',
  '23-3',
  '23-4',
  '24-1',
  '24-2',
  '24-3',
  '24-4',
];

export const TIME_OPTION_LIST = [
  '10:00~11:00',
  '11:00~12:00',
  '13:00~14:00',
  '14:00~15:00',
  '15:00~16:00',
  '16:00~17:00',
  '17:00~18:00',
];

export const TIME_OBJ_LIST = [
  { value: TIME_OPTION_LIST[0], label: TIME_OPTION_LIST[0] },
  { value: TIME_OPTION_LIST[1], label: TIME_OPTION_LIST[1] },
  { value: TIME_OPTION_LIST[2], label: TIME_OPTION_LIST[2] },
  { value: TIME_OPTION_LIST[3], label: TIME_OPTION_LIST[3] },
  { value: TIME_OPTION_LIST[4], label: TIME_OPTION_LIST[4] },
  { value: TIME_OPTION_LIST[5], label: TIME_OPTION_LIST[5] },
];

export const RIKAIDO_OPTION_LIST = [
  'null',
  '10%',
  '20%',
  '30%',
  '40%',
  '50%',
  '60%',
  '70%',
  '80%',
  '90%',
  '100%',
];
export const RIKAIDO_OBJ_LIST = [
  { value: 'null', label: RIKAIDO_OPTION_LIST[0] },
  { value: '1', label: RIKAIDO_OPTION_LIST[1] },
  { value: '2', label: RIKAIDO_OPTION_LIST[2] },
  { value: '3', label: RIKAIDO_OPTION_LIST[3] },
  { value: '4', label: RIKAIDO_OPTION_LIST[4] },
  { value: '5', label: RIKAIDO_OPTION_LIST[5] },
  { value: '6', label: RIKAIDO_OPTION_LIST[6] },
  { value: '7', label: RIKAIDO_OPTION_LIST[7] },
  { value: '8', label: RIKAIDO_OPTION_LIST[8] },
  { value: '9', label: RIKAIDO_OPTION_LIST[9] },
  { value: '10', label: RIKAIDO_OPTION_LIST[10] },
];

export const stageListAdvanced: string[] = [
  '',
  'progate HTML CSS I',
  'progate HTML CSS II',
  'progate HTML CSS III',
  'progate Python I',
  'progate Python II',
  'progate Python III',
  'progate React I',
  'progate React II',
  'progate React III',
  'React ウェブアプリ開発',
  'Python 計算問題',
  '',
];
