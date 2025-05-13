import { Button, Input } from '@heroui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

type Params = {
  year: number;
  month: number;
  studentId: string;
};

type FormInput = {
  uid: string;
  displayName: string;
};

export const addStudentToSundayClass5 = async ({ year, month, studentId }: Params) => {
  try {
    const res = await axios.post('/api/userActions/addToClass', {
      year,
      month,
      studentId,
    });

    if (res.status === 200) {
      return { success: true, message: res.data.message };
    }
    return { success: false, message: res.data.message };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: 'An error occurred while updating Firestore.',
    };
  }
};

const registerToSeatMap = (uid: string) => {
  const now = new Date();
  const thisYear = now.getFullYear();
  for (let i = 1; i <= 12; i++) {
    addStudentToSundayClass5({ year: thisYear, month: i, studentId: uid });
  }
};

export const Page = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();

  const createTeachingReport = async (data: FormInput) => {
    try {
      const body = { ...data, email: `${data.uid}@tmail.com`, password: data.uid };
      // エンドポイントに POST リクエストを送信
      const response = await axios.post('/api/userActions/createUser', body);

      if (response.status === 201) {
        return { success: true, message: response.data.message };
      } else {
        reset();
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('Error while creating document:', error);
      return { success: false, message: 'An error occurred while creating the document.' };
    }
  };

  const onSubmit = async (data: FormInput) => {
    await createTeachingReport(data);
  };

  return (
    <div className="p-8">
      <form className="flex flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
        <Input variant="bordered" className="max-w-[300px] bg-gray-200" {...register('uid')}>
          UID
        </Input>
        <Input variant="bordered" {...register('displayName')}>
          displayName
        </Input>
        <Button type="submit">送信</Button>
      </form>

      <Button type="button" onPress={() => registerToSeatMap('mein0020')}>
        送信
      </Button>
    </div>
  );
};

export default Page;
