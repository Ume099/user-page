import { useEffect, useState } from 'react';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import {
  getUserDisplayName,
  getUserDisplayNameObject,
} from '@/lib/util/firebase/getUserDisplayName';

interface SeatMapData {
  id: string;
  data: {
    class1: string[];
    class2: string[];
    class3: string[];
    class4: string[];
    class5: string[];
  };
}

export default function SetOpenDays() {
  const [seatMap, setSeatMap] = useState<SeatMapData[]>([]);
  const [nameObjListSat, setNameObjListSat] = useState({
    class1: [{ uid: '', displayName: '' }],
    class2: [{ uid: '', displayName: '' }],
    class3: [{ uid: '', displayName: '' }],
    class4: [{ uid: '', displayName: '' }],
    class5: [{ uid: '', displayName: '' }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeatMap = async () => {
    console.log(nameObjListSat);
    try {
      const response = await fetch('/api/seatMap/fetchStandard');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: SeatMapData[] = await response.json();
      setSeatMap(data);
      console.log('data[0].data.class1', data[0].data);
      const class1 = await getUserDisplayNameObject(data[0].data.class1);
      const class2 = await getUserDisplayNameObject(data[0].data.class2);
      const class3 = await getUserDisplayNameObject(data[0].data.class3);
      const class4 = await getUserDisplayNameObject(data[0].data.class4);
      const class5 = await getUserDisplayNameObject(data[0].data.class5);
      setNameObjListSat({ class1, class2, class3, class4, class5 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatMap();
  }, []);

  return (
    <AuthLimited>
      <div className="h-screen p-4">
        <div className="flex items-center justify-center space-x-2">
          <ButtonOriginal
            label="test"
            onClick={() => console.log(nameObjListSat.class4[0])}
            className="rounded-lg border bg-primary-medium px-3 py-2"
          />
        </div>
        <div className="mt-2 flex justify-center">
          <ul className="grid grid-cols-2 space-x-2">
            {seatMap.map((seat, index) => (
              <li key={`${seat.id}-${index}`}>
                <p>{seat.id}</p>
                <ul>
                  {Object.entries(seat.data).map(([className, studentIds]) => (
                    <li key={className}>
                      <p className="font-bold">{className}</p> {/* クラス名を表示 */}
                      <ul>
                        {nameObjListSat.class1.map((aa, index) => (
                          <li key={index}>{aa.uid}aa</li>
                        ))}
                        {nameObjListSat.class2.map((aa, index) => (
                          <li key={index}>{aa.uid}</li>
                        ))}
                        {nameObjListSat.class3.map((aa, index) => (
                          <li key={index}>{aa.uid}</li>
                        ))}
                        {nameObjListSat.class4.map((aa, index) => (
                          <li key={index}>{aa.uid}</li>
                        ))}
                        {nameObjListSat.class5.map((aa, index) => (
                          <li key={index}>{aa.uid}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthLimited>
  );
}
