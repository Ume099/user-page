// src/lib/suspenseUtils.ts

import axios from 'axios';
import { OpenDayList } from '../date';

/**
 * 非同期関数 (Promise) をラップして
 * React 18 の Suspense に対応させるための utility
 */
export function wrapPromise<T>(promise: Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      error = err;
    },
  );

  return {
    read(): T {
      if (status === 'pending') {
        // まだ完了していない場合は Promise を throw して Suspense を発火させる
        throw suspender;
      } else if (status === 'error') {
        // エラーが発生した場合はエラーを throw
        throw error;
      } else {
        // 完了（success）していれば結果を返す
        return result;
      }
    },
  };
}

// 指定したコレクション名 (年や月で管理) の開校日データを取得する関数
export async function fetchOpenDays(collectionName: string): Promise<OpenDayList[]> {
  const response = await axios.get('/api/booking/fetchOpenDays', {
    params: { collectionName },
  });
  return response.data; // API レスポンスに合わせて適宜書き換えてください
}

/**
 * Suspenseで扱う用のリソースオブジェクトを生成
 */
export function createOpenDaysResource(collectionName: string) {
  return wrapPromise<OpenDayList[]>(fetchOpenDays(collectionName));
}
