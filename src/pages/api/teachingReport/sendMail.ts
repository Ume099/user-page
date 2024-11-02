import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { TeachingReportMail, ReqBody } from '@/lib/type/teachingReport';
import { __log } from '@/lib/util/log';

const sendEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const reqBody = req.body as ReqBody<TeachingReportMail>;

  const data = req.body;

  // // 改行のエスケープシーケンス(\n)を <br> に置換
  // const mailBody = data.mailBody.replace(/\n/g, '<br>');

  // 送信用アカウントの設定（ここではGmail）
  const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_SENDER,
      // Googleアカウントのアプリパスワード
      pass: process.env.MAIL_PASS,
    },
    secure: true,
  });

  // 管理人に送るお問い合わせメッセージ通知メール
  const toHostMailData: Options = {
    from: process.env.MAIL_SENDER,
    to: data.sendTo,
    subject: `【プログラミングスクールプライム】指導報告書を公開しました。`,
    html: `
      <p>お世話になっております。</p>
      <p>プログラミングスクールプライム（コードアドベンチャー姪浜校）です。</p>
      <p>${data.year}年${data.month}月${data.day}日の指導報告書を公開いたしました。</p>
      <p>【ステージ】${data.stage}</p>
      <p>【内容】${data.topic}</p>
      <p>【詳細】${data.detail}</p>
      <p>詳細は<a href="https://www.alt-prime.com/teachingReport/showTeachingReport">https://www.alt-prime.com/teachingReport/showTeachingReport</a>よりご確認下さい。</p>
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
