import Main from "_a/main";

export default {
    path: "/recom-point",
    name: "recom-point",
    component: Main,
    meta: {
        icon: "ios-aperture",
        title: "推荐点管理",
        showAlways: true,
        sort: 18
    },
    children: [
        {
            path: "point-list",
            name: "point-list",
            meta: {
              title: "推荐点管理"
            },
            component: () =>
              import("_o/components/recom-point/index.vue")
        },
    ]
};
