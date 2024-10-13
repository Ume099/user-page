import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import DatePicker from '@/components/common/parts/DatePicker';
import Input from '@/components/common/parts/Input';
import Select from '@/components/common/parts/Select';
import SettingHeading from '@/components/common/parts/SettingHeading';
import { InvoiceInput } from '@/lib/invoice';
import { toast } from 'react-toastify'; 
import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

export const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [error, setError] = useState<boolean>(false);

  // >>>>>>>>>>>NEW

  const [users, setUsers] = useState<UserData[]>([]);
  const [isFetchUser, setIsFetchUser] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InvoiceInput>();

  const postUserData = async () => {
    console.log('postUserData>>>>>>>>>>>>>>>>>');
    setIsLoading(true);
    try {
      setError(false);
      const response = await fetch('/api/invoice/postInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: 'test',
        }),
      });
    } catch (e) {
      setError(true);
      if (e instanceof FirebaseError) {
        toast.error(`エラーが発生しました。${String(e)}`);
      }
    } finally {
      if (error) {
        console.error("couldn't create account");
        return;
      }

      setIsLoading(false);
      // reset();
    }

    setError(false);
  };

  const onSubmit: SubmitHandler<InvoiceInput> = async (data) => {
    // if (!watch('givenName') || !watch('familyName')) {
    //   toast({ title: '必須事項が入力されていません。', status: 'error', position: 'bottom' });
    //   return; // 何もしない
    // }
    await postUserData();
  };
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>NEW

  // ユーザー一覧を取得する際の型など
  type UserData = {
    uid: string;
    name?: string;
    email?: string;
    displayName?: string;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<UserData[]>('/api/userActions/fetchUsers');
      setUsers(response.data);
      setIsFetchUser(true);
    } catch (error) {
      console.log(error);
    }
    console.log(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex justify-center">
      <ButtonOriginal onClick={() => fetchUsers()} label="test" />
      <div className="flex w-full flex-col justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          {users && (
            <Select<string>
              optionList={users.map((user) => user.displayName!)}
              label="名前"
              className="w-full"
              register={register('fullName')}
            />
          )}
          <DatePicker label="発行日" withDefaultValue register={register('date')} />
          <DatePicker label="お支払い期限" withDefaultValue register={register('dueDate')} />
          <p>授業開始日と退会日は記録用です。生徒削除は「生徒管理」ページから行えます。</p>
          <input className="rounded-lg border bg-primary px-3 py-2" type="submit" />
          {uid}

          <SettingHeading label="保護者の連絡先" />

          <Input label="郵便番号" className="w-full" register={register('placeName')} />

          <input className="rounded-lg border bg-primary px-3 py-2" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Page;
