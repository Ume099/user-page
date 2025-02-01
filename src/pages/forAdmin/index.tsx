import Link from 'next/link';

const ADMIN_PAGES = [
  { link: '/booking/all', title: '予約' },
  { link: '/invoice/all', title: 'すべての領収書' },
  { link: '/invoice/create', title: '領収書作成' },
  { link: '/seatMap', title: '座席表' },
];

export const Page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <ul className="space-y-2 rounded-lg border px-4 py-6">
        {ADMIN_PAGES.map((page, idx) => (
          <li key={`${page.title}-${idx}`} className="flex w-40 justify-start">
            <Link href={page.link} className="underline">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
