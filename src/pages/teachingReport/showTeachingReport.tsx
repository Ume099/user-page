import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';

type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

// データオブジェクトの型
type TeachingReport = {
  id: string;
  rikaido: string;
  classTime: string;
  createdAt: FirestoreTimestamp;
  studentUid: string;
  stage: string;
  studentName: string;
  writerUid: string;
  isRead: boolean;
  topic: string;
  detail: string;
  writer: string;
};

const DEFAULT_REPORT_OBJ: TeachingReport[] = [
  {
    id: '',
    rikaido: '',
    classTime: '',
    createdAt: { _seconds: 0, _nanoseconds: 0 },
    studentUid: '',
    stage: '',
    studentName: '',
    writerUid: '',
    isRead: false,
    topic: '',
    detail: '',
    writer: '',
  },
];

// fetcher関数を定義
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const ShowTeachingReport: NextPage = () => {
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);
  const [reportList, setReportList] = useState<TeachingReport[]>([]);

  // useSWRを使ってテンプレートデータをフェッチ
  const { data: reportObj = DEFAULT_REPORT_OBJ, error: templateError } = useSWR<TeachingReport[]>(
    userInfo.uid
      ? `/api/teachingReport/fetchTeachingReport?collectionName=teaching-report&studentUid=${userInfo.uid}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (reportObj && userInfo.uid) {
      const filteredReports = reportObj.filter(
        (report: TeachingReport) => report.studentUid === userInfo.uid,
      );
      setReportList(filteredReports);
      console.log('filteredReports', filteredReports);
    }
  }, [reportObj, userInfo.uid]);

  useEffect(() => {
    if (templateError) {
      toast.error('指導報告書のデータ取得に失敗しました。');
    }
  }, [templateError]);

  const getStarImage = (points: String): string => {
    switch (points) {
      case '1':
        return '/teachingReport/st1.png';
      case '2':
        return '/teachingReport/st2.png';
      case '3':
        return '/teachingReport/st3.png';
      case '4':
        return '/teachingReport/st4.png';
      case '5':
        return '/teachingReport/st5.png';
      case '6':
        return '/teachingReport/st6.png';
      case '7':
        return '/teachingReport/st7.png';
      case '8':
        return '/teachingReport/st8.png';
      case '9':
        return '/teachingReport/st9.png';
      case '10':
        return '/teachingReport/st10.png';
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        margin: '0 3rem',
        maxWidth: '64rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* ユーザーデータの表示 */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>指導報告書</h2>

        <div style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          {/* reportListの表示 */}
          {reportList.length > 0 ? (
            reportList.map((report) => (
              <div key={report.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>〇授業時間</p>
                <p style={{ marginBottom: '1rem' }}>{report.classTime || ''}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>〇理解度</p>
                <div style={{ marginBottom: '1rem' }}>
                  <Image src={getStarImage(report.rikaido)} alt="pt1" width={248} height={128} />
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>〇ステージ</p>
                <p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>{report.stage}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>〇内容</p>
                <p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>{report.topic}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>授業の詳細</p>
                <p style={{ marginBottom: '1rem' }}>{report.detail}</p>
              </div>
            ))
          ) : (
            <p>報告書はありません。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowTeachingReport;
