import { NativeModules } from 'react-native';
import Q from 'q'

const { RNSslPinning } = NativeModules;

const fetch = (url, obj, callback) => {
    let deferred = Q.defer();
    RNSslPinning.fetch(url, obj, (err, res) => {
        if (err && typeof err != 'object') {
            deferred.reject(err);
        }

        let data = err || res;

        data.json = function() {
            return Q.fcall(function() {
                return JSON.parse(data.bodyString);
            });
        };

        data.text = function() {
            return Q.fcall(function() {
                return data.bodyString;
            });
        };

        data.url = url;

        if (err) {
            deferred.reject(data);
        } else {
            deferred.resolve(data);
        }

        deferred.promise.nodeify(callback);
    });

    return deferred.promise;
};

const getCookies = (domain) => {
    if(domain) {
        return RNSslPinning.getCookies(domain);
    }

    return Promise.reject("Domain cannot be empty")
};

const removeCookieByName = (name) => {
    if(name) {
        return RNSslPinning.removeCookieByName(name);
    }

    return Promise.reject("Cookie Name cannot be empty")
};

const cancelAllUpload = () => {
    return RNSslPinning.cancelAllUpload();
};



export {
    fetch,
    getCookies,
    removeCookieByName,
    cancelAllUpload
}
