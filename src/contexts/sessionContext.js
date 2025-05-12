import { AsyncLocalStorage } from 'async_hooks';

export const sessionStorage = new AsyncLocalStorage();//creamos una nueva session por cada usuario

//creamos el contexto
export const sessionMiddleware = (req, res, next) => {
    sessionStorage.run({}, () => {
        next();
    });
};

//guardamos la informacion del usuario logueado
export const SetSessionUserInfo = (userData) => {
    const store = sessionStorage.getStore();

    if (store) {
        store.user = userData;
    }
}

//obtenemos la informacion del usuario logueado
export const GetSessionUserInfo = () => {
    const store = sessionStorage.getStore()

    return store ? store.user :  null;
}
