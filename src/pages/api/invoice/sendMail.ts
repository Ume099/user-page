import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { InvoiceMailParams, ReqBody } from '@/lib/type/invoice';
import { __log } from '@/lib/util/log';

const sendEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const reqBody = req.body as ReqBody<InvoiceMailParams>;

  const data = reqBody.body;

  console.log(data);

  // 改行のエスケープシーケンス(\n)を <br> に置換
  // const htmlBody = data.message.replace(/\n/g, '<br>');

  // 送信用アカウントの設定（ここではGmail）
  const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_SENDER,
      // Googleアカウントでアプリパスワードを取得して入れる
      pass: process.env.MAIL_PASS,
    },
    secure: true,
  });

  // 管理人に送るお問い合わせメッセージ通知メール
  const toHostMailData: Options = {
    from: process.env.MAIL_SENDER,
    to: data.sendTo,
    replyTo: process.env.MAIL_SENDER,
    subject: `【コードアドベンチャー姪浜校】請求書発行のお知らせ(${data.year}年${data.month}月 分)`,
    html: `
      <p></p>
      <p>お世話になっております。コードアドベンチャー姪浜校です。</p>
      <br/>
      <p>${data.year}年${data.month}月の請求書発行のご連絡です。</p>
      <br/>
      <a href="alt-prime/invoice">発行された請求書はこちらからご確認いただけます。（ログインが必要です）</a>
      <br/>
      <p>引き続きよろしくお願いいたします。</p>
      <br/>
      <br/>
      <p>コードアドベンチャー姪浜校</p>
    `,
  };

  // 送信する
  try {
    await transporter.sendMail(toHostMailData);
  } catch (error) {
    __log('ERROR!!!!!!', { error });
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ success: true });
};

export default sendEmail;
