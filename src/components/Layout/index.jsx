import { Outlet, useLocation } from "react-router";
import ErrorBoundary from "../ErrorBoundary";
import { useWarmUpServer } from "../../hooks/useWarmUpServer";

const Layout = () => {
  const { pathname } = useLocation();
  useWarmUpServer();

  return (
    <div className="flex justify-center items-center p-4 ">
      <ErrorBoundary resetKey={pathname}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
