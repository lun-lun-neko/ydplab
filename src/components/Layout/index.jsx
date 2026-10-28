import { Outlet, useLocation } from "react-router";
import ErrorBoundary from "../ErrorBoundary";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex justify-center items-center p-4 ">
      <ErrorBoundary resetKey={pathname}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
