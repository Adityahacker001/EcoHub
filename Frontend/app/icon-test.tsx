import React from "react";
import { Gavel, Clock } from "lucide-react";

const IconTest = () => {
  return (
    <div>
      <h1>Icon Test</h1>
      <div>
        <Gavel className="w-6 h-6 text-blue-500" />
        <Clock className="w-6 h-6 text-green-500" />
      </div>
    </div>
  );
};

export default IconTest;