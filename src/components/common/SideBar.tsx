import Link from 'next/link';
import { useState } from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { linkList } from './Header';
import { IoHomeSharp } from 'react-icons/io5';

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    console.log('test');
    setIsOpen((prev) => !prev);
  };

  const handleClickClose = () => {
    console.log('test');
    setIsOpen(false);
  };

  return (
    <div className="md:w-40">
      <div className="md:hidden md:w-40">
        {!isOpen ? (
          <>
            {/* ホームボタン */}

            <Link href="/" className="fixed left-4 top-4 z-[9999] rounded-full bg-white">
              <IoHomeSharp className="scale-[200%]" />
            </Link>
          </>
        ) : (
          // ×
          <>
            <div className="fixed left-0 top-0 z-[2] h-screen w-screen bg-gray-800"></div>
            <div className="fixed z-[9999] mr-8 w-full">
              <div className="flex h-full w-full flex-col gap-y-4 overflow-y-scroll lg:w-[240px]">
                {linkList.map((link, key) => (
                  <li key={key} className="w-full list-none gap-y-2">
                    <Link
                      href={link.link}
                      className="flex h-24 !w-full items-center rounded-lg border-2 bg-gray-100 px-4 py-2 text-gray-800 transition duration-150 ease-in-out hover:underline focus:border-gray-800 focus:text-gray-400 focus:underline lg:h-full lg:w-auto lg:border-0 lg:border-gray-200  lg:bg-white lg:hover:no-underline lg:focus:no-underline"
                    >
                      <AiOutlineHome className="mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </div>
              {/* ホームボタン */}
              <Link href="/" className="fixed left-4 top-4 z-[9999] rounded-full bg-white">
                <AiFillHome className="scale-[200%]" />
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="hidden w-full md:inline-block">
        <div className="mr-8 flex w-full">
          <div className="h-full !w-full overflow-y-scroll lg:w-[240px]">
            {linkList.map((link, key) => (
              <li key={key} className="w-full list-none">
                <Link
                  onClick={() => handleClickClose()}
                  href={link.link}
                  className="flex h-full  w-full items-center rounded-lg border-0 border-gray-200 bg-white px-4  py-2 text-gray-800 transition duration-150 ease-in-out hover:no-underline focus:border-gray-800  focus:text-gray-400 focus:underline"
                >
                  <AiOutlineHome className="mr-2  w-full" />
                  {link.name}
                </Link>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
