import React from "react";
import DefaultDiv from "../DefaultDiv";

export default function MyCatBowl() {
  return (
    <DefaultDiv>
      <div className="flex flex-col h-full w-[950px] rounded-xl dark:bg-WebDarkBackground2">
        <h1 className="m-5 text-[2rem] font-bold dark:text-white">
          관할 냥그릇
        </h1>
      </div>
    </DefaultDiv>
  );
}
