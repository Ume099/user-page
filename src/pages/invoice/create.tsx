import DatePicker from '@/components/common/parts/DatePicker';
import InputRadio from '@/components/common/parts/InputRadio';
import Input from '@/components/React-Hook-Form/Input';
import Select from '@/components/React-Hook-Form/Select';
import Submit from '@/components/React-Hook-Form/Submit';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';
import {
  DETAIL_LIST,
  InvoiceInput,
  KOMOKU_LIST,
  PAMENT_OBJ_LIST as PAYMENT_OBJ_LIST,
} from '@/lib/invoice';
import { getUserEmail } from '@/lib/util/firebase/getUserEmail';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';

import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

export const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const [users, setUsers] = useState<UserData[]>([]);

  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<InvoiceInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    rules: { minLength: 1 },
    // 動的に増やすフィールドパスを指定する
  });

  const postInvoice = async (data: InvoiceInput) => {
    setIsLoading(true);
    const uid = uidSetter(data.fullName)?.uid;

    if (!uid) {
      console.log('uid is missing...');
      return;
    }
    const mail = getUserEmail(uid);
    if (!mail) {
      console.log('mail is missing...');
      return;
    }
    try {
      setError(false);
      await fetch('/api/invoice/postInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uidSetter(data.fullName)?.uid || '',
          mail,
          date: data.date.replaceAll('-', '_'),
          dueDate: data.dueDate.replaceAll('-', '_'),
          fullName: data.fullName,
          payment: data.payment,
          isChecked: false,
          isPublished: false,
          isPayed: ('uzxghkh6jkmi' !== uid) as Boolean, // 岡リヒトだけ初期false
          // 以下のようにしないと全部Stringになる
          items: data.items.map((item) => ({
            komoku: item.komoku,
            detail: item.detail,
            price: Number(item.price),
          })),
          totalPrice: data.totalPrice,
        }),
      });
    } catch (e) {
      setError(true);
      if (e instanceof FirebaseError) {
        toast({
          title: 'エラーが発生しました。' + String(e),
          status: 'error',
          position: 'top',
        });
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

  const uidSetter = (name: string) => {
    return users.find((user) => user.displayName === name);
  };

  const onSubmit: SubmitHandler<InvoiceInput> = async (data) => {
    data.items = [{ price: 10000, komoku: '授業料', detail: '通常コース' }]; // 数値固定

    data.totalPrice = data.items.reduce((sum, item) => Number(sum + item.price), 0) * 1.1;
    if (!data.totalPrice || !data.fullName) {
      toast({ title: '必須事項が入力されていません。', status: 'error', position: 'top-right' });
      return; // 何もしない
    }
    await postInvoice(data);
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getTotal = (numberList: number[]): number => {
    return numberList?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  };

  return (
    <AuthLimited>
      <div className="flex justify-center">
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
            <InputRadio
              label="支払方法"
              className="w-full"
              register={register('payment')}
              options={PAYMENT_OBJ_LIST}
            />
            <DatePicker label="発行日" withDefaultValue register={register('date')} />
            <DatePicker label="お支払い期限" withDefaultValue register={register('dueDate')} />
            <div className="grid grid-cols-3">
              <p>項目</p>
              <p>詳細</p>
              <p>値段</p>
            </div>
            {fields.map((field, index: number) => (
              <div className=" flex" key={field.id}>
                <div className="grid grid-cols-3 gap-x-2">
                  <Controller
                    name={`items.${index}.komoku`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Select<string> optionList={KOMOKU_LIST} {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name={`items.${index}.detail`}
                    control={control}
                    render={({ field }) => (
                      <div className="overflow-hidden">
                        <Select<string> optionList={DETAIL_LIST} {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <div className="overflow-hidden">
                        <Input label="" {...field} />
                      </div>
                    )}
                  />
                </div>

                <div className="flex items-start">
                  <button
                    className="p-2 text-lg font-bold text-error"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    ―
                  </button>
                </div>
              </div>
            ))}

            <button
              className="mb-8 text-4xl font-bold text-primary-dark"
              type="button"
              onClick={() => append({ komoku: '', price: 0, detail: '' })}
            >
              +
            </button>
            <Input
              value={getTotal(watch('items')?.map((item) => Number(item.price))) * 1.1 || ''}
              placeholder="合計金額"
              label="合計金額"
              className="w-full"
              register={register('totalPrice')}
            />
            <Submit variant="primary" loading={isLoading} />
          </form>
        </div>
      </div>
    </AuthLimited>
  );
};

export default Page;
