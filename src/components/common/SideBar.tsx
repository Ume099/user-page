import Link from 'next/link';
import { useState } from 'react';
import { TiThMenu } from 'react-icons/ti';
import { IoMdClose } from 'react-icons/io';
import { linkList } from '@/constant/link';
import { getIcon } from '@/lib/util/getIcon';

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
      {/* メニュー */}
      {isOpen && (
        <div
          className="fixed -top-10 z-[2] h-screen w-full bg-gray-800 opacity-70 duration-75"
          onClick={(e) => handleClickCloseOpen(e)}
        />
      )}
      <div
        className={`fixed z-[4] mr-8 h-full w-1/3 bg-white duration-75 lg:w-1/4 ${
          isOpen ? 'left-0' : '-left-[100%]'
        }`}
      >
        <div className="flex h-full w-full flex-col space-y-1 overflow-y-scroll bg-white text-2xl lg:w-[240px]">
          {linkList.map((link, key) => (
            <li key={key} className="w-full list-none">
              <Link
                href={link.path}
                onClick={() => setIsOpen(false)} // クリック時にメニューを閉じる
                className="flex h-24 items-center space-x-2 border-2 border-b bg-gray-100 px-4 text-gray-900 transition duration-150 ease-in-out hover:underline focus:border-gray-800 focus:text-gray-400 focus:underline lg:h-full lg:w-auto lg:border-0 lg:border-gray-200 lg:bg-white lg:hover:no-underline lg:focus:no-underline"
              >
                <div className="flex w-10 justify-start">{getIcon(link.name)}</div>
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
  );
};

export default SideBar;
