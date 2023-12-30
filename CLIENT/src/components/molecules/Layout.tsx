import { ReactElement, Fragment } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <Fragment>
      <div className="min-h-screen flex justify-between flex-col">
        <Nav />
        <main className="bg-[#111827] w-full text-black m-x-16 flex-1 ">
          {children}
        </main>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;
