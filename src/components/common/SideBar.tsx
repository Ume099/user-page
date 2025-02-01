import Link from 'next/link';
import { useState } from 'react';
import { TiThMenu } from 'react-icons/ti';
import { IoMdClose } from 'react-icons/io';
import { linkList } from '@/constant/link';

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickCloseOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <div className="md:w-40">
      <div className=" md:w-40">
        {/* メニュー */}
        <div
          className={`fixed top-0 z-[2] h-screen w-full bg-gray-800 opacity-70 duration-75 ${
            isOpen ? 'left-0' : '-left-[100%]'
          }`}
          onClick={(e) => handleClickCloseOpen(e)}
        ></div>
        <div
          className={`fixed z-[4] mr-8 h-full w-2/3 duration-75 ${
            isOpen ? 'left-0' : '-left-[100%]'
          }`}
        >
          <div className="flex h-full w-full flex-col overflow-y-scroll text-2xl lg:w-[240px]">
            {linkList.map((link, key) => (
              <li key={key} className="w-full list-none">
                <Link
                  href={link.link}
                  onClick={() => setIsOpen(false)} // クリック時にメニューを閉じる
                  className="flex h-24 items-center border-2 bg-gray-100 px-4 text-gray-900 transition duration-150 ease-in-out hover:underline focus:border-gray-800 focus:text-gray-400 focus:underline lg:h-full lg:w-auto lg:border-0 lg:border-gray-200 lg:bg-white lg:hover:no-underline lg:focus:no-underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </div>
        </div>
        {/* メニューボタン */}
        <div className="fixed left-0 top-0 z-[9999] m-4" onClick={handleClickOpen}>
          {isOpen ? <IoMdClose className="scale-[200%]" /> : <TiThMenu className="scale-[200%]" />}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
