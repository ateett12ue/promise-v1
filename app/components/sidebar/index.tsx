import Image from "next/image";
import React from "react";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <nav className="flex-none flex flex-col items-center text-center bg-violet-900 text-gray-400 border-r h-screen">
      <div className="h-16 flex items-center w-full">
        <Image
          alt=""
          className="h-6 w-6 mx-auto"
          width={50}
          height={50}
          src="/../../public/vercel.svg"
        />
      </div>

      <ul>
        <li>
          <a
            title="Home"
            href="#home"
            className="h-16 px-6 flex items-center text-white bg-teal-700 w-full"
          >
            <i className="mx-auto">
              <svg
                className="fill-current h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 6.453l9 8.375v9.172h-6v-6h-6v6h-6v-9.172l9-8.375zm12 5.695l-12-11.148-12 11.133 1.361 1.465 10.639-9.868 10.639 9.883 1.361-1.465z" />
              </svg>
            </i>
          </a>
        </li>
      </ul>

      <div className="mt-auto h-16 flex items-center w-full">
        <Image
          alt=""
          className="h-8 w-10 mx-auto"
          width={50}
          height={50}
          src="/../../public/vercel.svg"
        />
      </div>
    </nav>
  );
};

export default Sidebar;
