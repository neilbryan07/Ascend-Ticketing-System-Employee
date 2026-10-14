import axios from 'axios';
import './axiosConfig';

export const APIServices = ( function () {

    function get({ url , payload = null }) {

        return axios.get( url , payload  )
            .then(res => res)
            .catch(error => error)
            .finally(function () {
                
            });
    }

    function post({ url, payload }) {
        return axios.post(url, payload)
            .then(res => res)
            .catch(error => [error, console.log(error)])
    }

    function put({ url, payload }) {
        return axios.put(url, payload)
            .then(res => res)
            .catch(error => error)
    }

    return {
        get: get,
        post: post,
        put: put,
    }

})();