import Image from "next/image";
import React from "react";
import { useMoralis } from "react-moralis";
import { Blockie, ConnectButton } from "web3uikit";

type Props = {};

const Navbar = (props: Props) => {
  const { isAuthenticated, user, logout } = useMoralis();
  return (
    <nav
      aria-label="top bar"
      className="flex-none flex justify-between bg-white h-16"
    >
      <div className="font-semibold text-lg text-gray-700 py-4 px-3">
        Promise DAO
      </div>
      <ul aria-label="top bar right" className="px-8 flex items-center">
        {/* <li className="h-10 w-10 ml-3">
          <button className="h-full w-full rounded-full border focus:outline-none focus:shadow-outline">
            <Image
              alt=""
              className="h-full w-full rounded-full mx-auto"
              width={500}
              height={500}
              src="/../../public/vercel.svg"
            />
          </button>
        </li> */}

        {!isAuthenticated && (
          <ConnectButton
            chainId={137}
            signingMessage="Sign in to use our app"
          />
        )}

        {isAuthenticated && (
          <button onClick={() => logout()}>
            <Blockie seed={user?.get("ethAddress")} />
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
