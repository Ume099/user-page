import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { BookingChangeMailParam, ReqBody } from '@/lib/type/booking';
import { __log } from '@/lib/util/log';

const sendEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const data: BookingChangeMailParam = req.body;

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
    subject: `【プログラミングスクールプライム】${data.yearBefChange}年${data.monthBefChange}月${data.dateBefChange}日${data.classBefChange}の授業変更を承りました。`,
    html: `
      <p>お世話になっております。</p>
      <p>プログラミングスクールプライム（コードアドベンチャー姪浜校）です。</p>
      <p>
        ${data.yearBefChange}年${data.monthBefChange}月${data.dateBefChange}日${data.classBefChange}<br/>
        から<br/>
        ${data.yearAftChange}年${data.monthAftChange}月${data.dateAftChange}日${data.classAftChange}に変更しました。
      </p>
      <p><a href="alt-prime.com/booking">alt-prime.com/invoices</a>よりご確認下さい。</p>
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
