
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(), 
    routes: [
        
        { path: "/", component: () => import("../components/Home.vue") },
        { path: "/Register", component: () => import("../components/Register.vue") },
        { path: "/SignIn", component: () => import("../components/SignIn.vue") },
        {path: "/Feed",
            component: () => import("../components/Feed.vue"),
            meta: {
                requiresAuth: true, 
            },
        },
    ],
});


const getCurrentUser = () => {
   
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(), 
            (user) => {
                removeListener();
                resolve(user);
            },
            (error) => {
                removeListener();
                reject(error); 
            }
        );
    });
};


router.beforeEach(async (to, from, next) => {
    
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        try {
            const user = await getCurrentUser();
            if (user) {
                next();
            } else {
                alert("You don't have access!");
                next("/SignIn");
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
            next("/SignIn");
        }
    } else {
        
        next();
    }
});

export default router;