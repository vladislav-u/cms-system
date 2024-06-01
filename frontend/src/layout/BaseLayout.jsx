import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";

const BaseLayout = () => {
    return (
        <main className="page-wrapper">
            {/*left side*/}
            <Sidebar />
            {/*right side*/}
            <div className="content-wrapper">
                <Outlet />
            </div>
        </main>
    )
}

export default BaseLayout;