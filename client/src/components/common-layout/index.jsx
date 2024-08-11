import { Outlet } from "react-router-dom";

function CommonLayout() {
    return (
        <div>
            <h1>Common Content</h1>
            <Outlet />
        </div>
    );
}
export default CommonLayout;