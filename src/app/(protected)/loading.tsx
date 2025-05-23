import React from "react";
import { MoonLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <MoonLoader color="#8E51FF" size={75} />
    </div>
  );
};

export default LoadingPage;
