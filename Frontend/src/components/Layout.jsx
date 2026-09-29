import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <header>
                <h2>Smart Task Manager</h2>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>&copy; 2025</p>
            </footer>
        </>
    );
};

export default Layout;
