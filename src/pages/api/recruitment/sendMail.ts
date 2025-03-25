import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { __log } from '@/lib/util/log';

type FormValues = {
  email: string;
  fullName: string;
  phone: string;
  currentJob: string; // 追加：現在の職業
  subject: string;
  experience: string;
  motivation: string;
  interviewTime: string;
  agree: boolean;
};

const sendEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const data = req.body as FormValues;

  // 送信用アカウントの設定（Gmail を使用）
  const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASS,
    },
    secure: true,
  });

  // 応募者と担当者へ送信するメールの設定
  const mailData: Options = {
    from: process.env.MAIL_SENDER,
    to: `${data.email}, en.prime1+site@gmail.com`,
    subject: `【コードアドベンチャー 講師アルバイト応募】${data.fullName}様`,
    html: `
      <h3>講師アルバイト応募内容のご確認</h3>
      <p>この度は、コードアドベンチャー 講師アルバイトにご応募いただき、誠にありがとうございます。</p>
      <h4>応募内容</h4>
      <p><strong>氏名：</strong> ${data.fullName}</p>
      <p><strong>メールアドレス：</strong> ${data.email}</p>
      <p><strong>電話番号：</strong> ${data.phone}</p>
      <p><strong>現在の職業：</strong> ${data.currentJob}</p>
      <p><strong>将来的に上級コース（JavaScript）受講生への指導希望：</strong> ${data.subject}</p>
      <p><strong>アルバイト歴：</strong> ${data.experience || 'なし'}</p>
      <p><strong>プログラミングのご経験：</strong> ${data.motivation}</p>
      <p><strong>面接希望時間帯：</strong> ${data.interviewTime}</p>
      <hr/>
      <p>後ほど担当者よりご連絡いたしますので、しばらくお待ちください。</p>
      <p>※このメールは応募内容の確認のために自動送信されています。</p>
      <br/>
      <p>コードアドベンチャー</p>
    `,
  };

  try {
    await transporter.sendMail(mailData);
  } catch (error) {
    __log('ERROR!!!!!!', { error });
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ success: true });
};

export default sendEmail;
