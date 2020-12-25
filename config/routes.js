export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        redirect: '/user/home',
      },
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
          {
            path: '/user/home',
            name: 'home',
            component: './Home',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            // authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/bid/bidrecord',
              }, // {
              //   path: '/welcome',
              //   name: 'welcome',
              //   icon: 'smile',
              //   component: './Welcome',
              // },
              // {
              //   path: '/admin',
              //   name: 'admin',
              //   icon: 'crown',
              //   component: './Admin',
              //   authority: ['admin'],
              //   routes: [
              //     {
              //       path: '/admin/sub-page',
              //       name: 'sub-page',
              //       icon: 'smile',
              //       component: './Welcome',
              //       authority: ['admin'],
              //     },
              //   ],
              // },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './ListTableList',
              // },
              {
                name: '招投标',
                icon: 'Form',
                path: '/bid',
                routes: [
                  {
                    name: '投标记录',
                    path: '/bid/bidrecord',
                    component: './BidRecord', // authority: ['admin'],
                  },
                  {
                    // name: '步骤1',
                    path: '/bid/bidrecord/step1',
                    component: './Step',
                  },
                  {
                    // name: '步骤2',
                    path: '/bid/bidrecord/step2',
                    component: './Step',
                  },
                  {
                    // name: '查看步骤1',
                    path: '/bid/bidrecord/step1Detail/:detailId',
                    component: './Step',
                  },
                  {
                    // name: '步骤1',
                    path: '/bid/bidrecord/step2Detail/:detailId',
                    component: './Step',
                  },
                ],
              },
  
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
