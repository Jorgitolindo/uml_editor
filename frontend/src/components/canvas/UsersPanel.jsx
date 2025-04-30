import React from "react";
import { User, Circle } from "react-feather";

const UsersPanel = ({ collaborators = [], currentUser }) => {
  return (
    <div className="flex items-center gap-2">
      {collaborators.map((email) => (
        <div
          key={email}
          className={`relative flex items-center px-3 py-1.5 rounded-full text-xs ${
            email === currentUser
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <Circle
            size={8}
            className={`absolute -top-0.5 -right-0.5 ${
              email === currentUser ? "text-blue-500" : "text-green-500"
            }`}
            fill="currentColor"
          />
          <User size={14} className="mr-2" />
          {email.split("@")[0]}
        </div>
      ))}
    </div>
  );
};

export default React.memo(UsersPanel);
