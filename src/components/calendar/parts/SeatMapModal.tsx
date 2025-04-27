import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { BookingStatus, BookingStatusObj } from '@/lib/SeatMap';
import { UidAndDName, UserData } from '@/lib/userSettings';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Props = {
  year: number;
  month: number;
  day: number;
  users: UidAndDName[];
};

// fetch済みのusersからuidを元にdisplayNameを取得する関数
const getDisplayNameFromUsers = (
  uid: string,
  users: { uid: string; displayName: string }[],
): string => {
  const found = users.find((item) => item.uid === uid);
  return found?.displayName ?? ''; // 見つかった場合は key1 を返し、見つからない場合は null を返す
};

// 関数コンポーネント
const SeatMapModal = (props: Props) => {
  const { year, month, day, users } = props;
  const [bookingStatus, setBookingStatus] = useState<BookingStatusObj | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const param = useSearchParams();
  const dateTime = param.get('dateTime') || '';

  const collectionNameInMemo = useMemo(() => 'openDay_' + year + '_' + month, [year, month]);

  // 座席表を取得するAPI
  const getOpenDayInfo = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.get<BookingStatus>('/api/booking/fetchSeatMap', {
        params: { collectionName: collectionNameInMemo, docId: 'day_' + day },
      });
      const item: BookingStatus = response.data;

      setBookingStatus({
        class1: item.class1.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class2: item.class2.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class3: item.class3.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class4: item.class4.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class5: item.class5.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class6: item.class6?.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
        class7: item.class7?.map((uid) => ({
          uid,
          displayName: getDisplayNameFromUsers(uid, users),
        })),
      });
    } catch (error) {
      console.log(error);
      setError('Failed to fetch seat map');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOpenDayInfo();
  }, [collectionNameInMemo, day]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        Seat Map for {year}/{month}/{day}
      </h1>
      <div>
        {bookingStatus ? (
          <div>
            {/* 座席表の描画部分 */}
            <p>Booking Status:</p>
            <div className="gap mb-2 flex gap-x-2">
              <p>class1: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class1.map((st, index) => (
                  <li
                    className="rounded-lg border bg-primary-light px-3 py-2"
                    key={`${st}_${index}`}
                  >
                    <Link target="_blank" href={`/teachingReport?uid=${st.uid}&dateTimeIndex=0`}>
                      {getDisplayNameFromUsers(st.uid, users) || st.uid}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class2: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class2.map((st, index) => (
                  <li
                    className="rounded-lg border bg-primary-light px-3 py-2"
                    key={`${st}_${index}`}
                  >
                    <Link target="_blank" href={`/teachingReport?uid=${st.uid}&dateTimeIndex=1`}>
                      {getDisplayNameFromUsers(st.uid, users) || st.uid}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class3: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class3.map((st, index) => (
                  <li
                    className="rounded-lg border bg-primary-light px-3 py-2"
                    key={`${st}_${index}`}
                  >
                    <Link target="_blank" href={`/teachingReport?uid=${st.uid}&dateTimeIndex=2`}>
                      {getDisplayNameFromUsers(st.uid, users) || st.uid}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class4: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class4.map((st, index) => (
                  <li
                    className="rounded-lg border bg-primary-light px-3 py-2"
                    key={`${st}_${index}`}
                  >
                    <Link target="_blank" href={`/teachingReport?uid=${st.uid}&dateTimeIndex=3`}>
                      {getDisplayNameFromUsers(st.uid, users) || st.uid}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class5: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class5.map((st, index) => (
                  <li
                    className="rounded-lg border bg-primary-light px-3 py-2"
                    key={`${st}_${index}`}
                  >
                    <Link target="_blank" href={`/teachingReport?uid=${st.uid}&dateTimeIndex=4`}>
                      {getDisplayNameFromUsers(st.uid, users) || st.uid}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class6: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class6?.map(
                  (st, index) =>
                    st.displayName !== '' && (
                      <li
                        className="rounded-lg border bg-primary-light px-3 py-2"
                        key={`${st}_${index}`}
                      >
                        <Link
                          target="_blank"
                          href={`/teachingReport?uid=${st.uid}&dateTimeIndex=5`}
                        >
                          {getDisplayNameFromUsers(st.uid, users) || st.uid}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
            <div className="gap mb-2 flex gap-x-2">
              <p>class7: </p>
              <ul className="gap flex gap-x-2">
                {bookingStatus.class7?.map(
                  (st, index) =>
                    st.displayName !== '' && (
                      <li
                        className="rounded-lg border bg-primary-light px-3 py-2"
                        key={`${st}_${index}`}
                      >
                        <Link
                          target="_blank"
                          href={`/teachingReport?uid=${st.uid}&dateTimeIndex=6`}
                        >
                          {getDisplayNameFromUsers(st.uid, users) || st.uid}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p>
            No booking status available.
            <button onClick={() => console.log(users)}>getOpenDayInfo</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SeatMapModal;
