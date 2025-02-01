import { NextPage } from 'next';

import Input from '@/components/common/parts/Input';
import Select from '@/components/common/parts/Select';
import TextArea from '@/components/common/parts/TextArea';
import {
  stageList,
  stageListAdvanced,
  TeachingReportTemplateInputType,
} from '@/lib/teachingReport';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ToggleSwitch from '@/components/common/parts/ToggleSwitch copy';
import { useEffect, useState } from 'react';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';

type NewVal = {
  stageName: string;
  topic: string;
  detail: string;
};

const CreateTemplate: NextPage = () => {
  const toast = useToast();
  const [isStageListForAd, setIsStageListForAd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeachingReportTemplateInputType>();

  // stageの値に応じてtopicを取得する関数

  const getTempleteObj = (stage: string, topic: string, detail: string): NewVal => {
    const obj = {
      stageName: stage,
      topic,
      detail,
    };
    return obj;
  };

  // テンプレを更新するAPI
  const updateTemplate = async (newVal: NewVal) => {
    try {
      const response = await fetch('/api/teachingReport/updateTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newVal, docId: `stage${watch('stage')}` }),
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIsAllFilled = (): boolean => {
    const isAllFilled: boolean = !!watch('stage') && !!watch('topic') && !!watch('detail');
    return isAllFilled;
  };
  const onSubmit = () => {
    if (!checkIsAllFilled()) {
      // 申し訳程度のバリデーション
      toast({ title: '入力されていないエリアがあります。', status: 'error', position: 'top' });
      return;
    }
    updateTemplate(getTempleteObj(watch('stage'), watch('topic'), watch('detail')));
    toast({ title: 'テンプレートを追加しました。', status: 'info', position: 'top' });
    reset();
  };
  useEffect(() => {
    console.log(watch('isForAd'));
    setIsStageListForAd(watch('isForAd') || false);
  }, [watch('isForAd')]);

  return (
    <AuthLimited>
      <div className="mx-12 mt-24 max-w-4xl items-center">
        {/* 報告するステージの選択ボタン */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2">
            <h2>応用編用?</h2>
            <input type="checkbox" {...register('isForAd')} />
          </div>
          <div>
            <p className="h-8">指導報告書のテンプレートを作成するステージを選択してください。</p>
            <Select<string>
              optionList={!isStageListForAd ? stageList : stageListAdvanced}
              className="w-full"
              register={register('stage')}
            />
          </div>
          <div className="mt-4 font-bold">指導報告書の内容</div>
          <div className="border p-2">
            <div>
              <div>
                <p>【今日のステージ】</p>
                <p>#{watch('stage')}</p>
              </div>
              <div>
                <Input label="【今日の授業内容】" register={register('topic')} />
              </div>
              <div>
                <TextArea label="【今日の授業の詳細】" register={register('detail')} />
              </div>
            </div>
          </div>
          <input
            type="submit"
            className="mt-4 rounded-lg border bg-primary p-2 font-bold text-white"
          />
        </form>
      </div>
    </AuthLimited>
  );
};

export default CreateTemplate;
