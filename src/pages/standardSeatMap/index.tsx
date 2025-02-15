import { useEffect, useState } from 'react';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import {
  getDisplayNameByUid,
  getUserDisplayName,
  getUserDisplayNameObject,
} from '@/lib/util/firebase/getUserDisplayName';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { displaNameState } from '@/hooks/atom/displayNameList';
import axios from 'axios';
import useSWR from 'swr';
import { displayName } from '@/hooks/atom/models/types';
import { SeatMapData } from '@/types/seatMap';

// データフェッチ用の fetcher 関数
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function SetOpenDays() {
  const [seatMap, setSeatMap] = useState<SeatMapData[]>([]);
  const [displayName, setDisplayName] = useRecoilState(displaNameState);

  const {
    data: users,
    error: e,
    mutate,
  } = useSWR<displayName[]>('/api/userActions/fetchUsers', fetcher);

  useEffect(() => {
    if (users) {
      setDisplayName(users);
    } else {
      mutate();
    }
  }, [users]);

  const fetchSeatMap = async () => {
    try {
      const response = await fetch('/api/seatMap/fetchStandard'); // 規定の座席表を取得
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: SeatMapData[] = await response.json();
      setSeatMap(data);
      console.log(data); // ここまでは取れている
    } catch (err: any) {
    } finally {
    }
  };

  useEffect(() => {
    fetchSeatMap();
  }, []);

  const classNames = ['class1', 'class2', 'class3', 'class4', 'class5'] as const;

  return (
    <AuthLimited>
      <div className="p-4">
        <div className="mt-2 flex justify-center">
          <ul className="grid grid-cols-2">
            {seatMap.map((seat, index) => (
              <li key={`${seat.id}-${index}`}>
                <p>{seat.id === 'sat' ? '土曜' : '日曜'}</p>
                <ul className="">
                  {classNames.map((className) => (
                    <li key={className} className="h-32 w-24 border p-1">
                      <p className="font-bold">{seat.data[className].length > 0 && className}</p>
                      <ul>
                        {seat.data[className]?.map((user, idx) => (
                          <li key={idx}>{getDisplayNameByUid(displayName, user)}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center px-80">
          <h2 className="mt-4 text-center">userとuidの対応</h2>
          <ul className="mt-2">
            {displayName.map((n) => (
              <li className="">
                {n.uid}: {n.displayName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthLimited>
  );
}
