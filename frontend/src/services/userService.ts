import { get, post, put, remove } from './APIHelper';
import { getUserId } from '../utils/userUtil';

const getUserinfo = async () => {
    const userId = getUserId();
    try {
        const response: any = await get(`/user/${userId}`);
        console.log("getUserinfo response: ", response);
        return response;
    } catch (error) {
        console.log("getUserinfo error: ", error);
    }
}

const getDriverinfo = async (driverId: number) => {
    try {
        const response: any = await get(`/user/${driverId}`);
        console.log("getUserinfo response: ", response);
        return response;
    } catch (error) {
        console.log("getUserinfo error: ", error);
    }
}


export {
    getUserinfo,
    getDriverinfo
}