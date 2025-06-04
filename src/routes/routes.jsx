import { BaseLayout, SidebarLayout, LoginLayout } from '~/layouts';
import Overview from '~/pages/Drivers/Overview';
import Detail from '~/pages/Drivers/Detail';
import Trash from '~/pages/Drivers/Trash';
import List from '~/pages/Drivers/List';
import Edit from '~/pages/Drivers/Edit';
import Contact from '~/pages/Contact';
import Add from '~/pages/Drivers/Add';
import config from '~/config/Routes';
import Login from '~/pages/Login';

// Public routes
const publicRoutes = [
    {
        path: config.routes.contact,
        component: Contact,
        layout: BaseLayout,
    },
    {
        path: config.routes.add,
        component: Add,
        layout: BaseLayout,
    },
    {
        path: config.routes.detail,
        component: Detail,
        layout: SidebarLayout,
    },
    {
        path: config.routes.list,
        component: List,
        layout: BaseLayout,
    },
    {
        path: config.routes.overview,
        component: Overview,
        layout: BaseLayout,
    },
    {
        path: config.routes.trash,
        component: Trash,
        layout: BaseLayout,
    },
    {
        path: config.routes.edit,
        component: Edit,
        layout: BaseLayout,
    },
    {
        path: config.routes.login,
        component: Login,
        layout: LoginLayout,
    },
];

// Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
