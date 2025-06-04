import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';

import BackToTopButton from '~/components/UiComponents/BackToTopButton';
import { publicRoutes } from '~/routes';
import { BaseLayout } from '~/layouts';
import ToastContainer from '~/components/UiComponents/ToastMessage/ToastContainer';

function App() {
    return (
        <Router>
            <div className='App'>
                <ToastContainer />
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = BaseLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        const layoutProps = {};
                        if (Layout === BaseLayout && route.menuItems) {
                            layoutProps.menuItems = route.menuItems;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout {...layoutProps}>
                                        <Page />
                                        <BackToTopButton />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
