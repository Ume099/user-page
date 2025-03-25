import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { __log } from '@/lib/util/log';
import { FormValues } from '@/lib/type/contact';

type ss = {
  email: string;
  firstChoice: string;
  secondChoice: string;
  studentName: string;
  studentKana: string;
  grade: string;
  phone: string;
  inquiry: string;
  agree: boolean;
};

const sendEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const data = req.body as FormValues;

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

  // 管理人とユーザーに送信するメールの設定
  const mailData: Options = {
    from: process.env.MAIL_SENDER,
    // フォーム回答のメールアドレスと en.prime1@gmail.com の両方に送信
    to: `${data.email}, en.prime1@gmail.com`,
    subject: `【コードアドベンチャー姪浜校】${data.studentName}様の体験会ご予定日について`,
    html: `
      <h3>この度は体験会へのご応募ありがとうございます。</h3>
      <p>プログラミングスクールプライム（コードアドベンチャー姪浜校）です。</p>
      <p>この度はお問い合わせいただき、誠にありがとうございます。</p>
      <p>以下の内容でコードアドベンチャー体験会のご応募を受け付けました。</p>
      <h3>・生徒氏名</h3>
      <p>${data.studentName}</p>
      <h3>・生徒氏名カナ</h3>
      <p>${data.studentKana}</p>
      <h3>・ご希望日程</h3>
      <p>【第一希望】</p>
      ${data.firstChoice}
      <p>【第二希望】</p>
      ${data.secondChoice}
      <h3>・お子様の学年</h3>
      <p>${data.grade}</p>
      <h3>・電話番号</h3>
      <p>${data.phone}</p>
      <h3>・ご要望</h3>
      <p>${data.inquiry || ''}</p>
      <p>※体験会の日程はまだ確定ではございません。24時間以内に担当者よりご連絡させていただきます。</p>
      <p>今しばらくお待ちくださいませ。</p>

      <p>変更をご希望の場合は<a href="https://www.alt-prime.com/ca_form">こちら</a>から再度ご回答ください。</p>
      <br/>
      <p>コードアドベンチャー姪浜校</p>
    `,
  };

  // メール送信処理
  try {
    await transporter.sendMail(mailData);
  } catch (error) {
    __log('ERROR!!!!!!', { error });
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ success: true });
};

export default sendEmail;
