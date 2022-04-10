import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Dashboard from "../../app/components/dashboard";
import Navbar from "../../app/components/navbar";
import Sidebar from "../../app/components/sidebar";
import { useMoralisFunction } from "../../app/hooks/useMoralisFunction";

const Prelaunch: NextPage = () => {
  const { runMoralisFunction } = useMoralisFunction();
  const [member, setMember] = useState();
  const { user, isAuthenticated } = useMoralis();
  useEffect(() => {
    if (isAuthenticated) {
      runMoralisFunction("getMember", {}).then((res) => {
        console.log(res);
        setMember(res);
      });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Head>
        <title>Pre-Launch</title>
      </Head>
      <div className="h-full w-full flex overflow-hidden antialiased text-gray-800 bg-white">
        {/* Sidebar starts here */}
        <Sidebar />

        {/* Top Nav */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          {/* Section header */}
          <header
            aria-label="page caption"
            className="flex-none flex h-16 bg-gray-100 border-t px-4 items-center"
          >
            <h1 id="page-caption" className="font-semibold text-lg">
              Dashboard
            </h1>
          </header>
          {/* Other Content Comes here */}
          <Dashboard member={member} />
        </div>
      </div>
    </div>
  );
};

export default Prelaunch;
