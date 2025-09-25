import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-400 h-[100vh]">
      <Outlet />
    </div>
  );
};

export default Layout;
