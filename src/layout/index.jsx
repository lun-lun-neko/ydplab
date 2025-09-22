import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] bg-gray-600">
      <Outlet />
    </div>
  );
};

export default Layout;
