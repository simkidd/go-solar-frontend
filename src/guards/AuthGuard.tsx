import React from "react";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default AuthGuard;
