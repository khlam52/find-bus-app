package com.toyberman;

import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.network.ForwardingCookieHandler;
import com.toyberman.Utils.OkHttpUtils;

import org.json.JSONException;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.net.ssl.SSLException;
import javax.net.ssl.SSLHandshakeException;

import okhttp3.Call;
import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.Headers;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import timber.log.Timber;

public class RNSslPinningModule extends ReactContextBaseJavaModule {

    private static final String RESPONSE_TYPE = "responseType";

    private final ReactApplicationContext reactContext;
    private final HashMap<String, List<Cookie>> cookieStore;
    private CookieJar cookieJar = null;
    private ForwardingCookieHandler cookieHandler;
    private OkHttpClient client;

    public RNSslPinningModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        cookieStore = new HashMap<>();
        cookieHandler = new ForwardingCookieHandler(reactContext);
        cookieJar = new CookieJar() {

            @Override
            public synchronized void saveFromResponse(HttpUrl url, List<Cookie> unmodifiableCookieList) {
                for (Cookie cookie : unmodifiableCookieList) {
                    setCookie(url, cookie);
                }
            }

            @Override
            public synchronized List<Cookie> loadForRequest(HttpUrl url) {
                List<Cookie> cookies = cookieStore.get(url.host());
                return cookies != null ? cookies : new ArrayList<Cookie>();
            }

            public void setCookie(HttpUrl url, Cookie cookie) {

                final String host = url.host();

                List<Cookie> cookieListForUrl = cookieStore.get(host);
                if (cookieListForUrl == null) {
                    cookieListForUrl = new ArrayList<Cookie>();
                    cookieStore.put(host, cookieListForUrl);
                }
                try {
                    putCookie(url, cookieListForUrl, cookie);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            private void putCookie(HttpUrl url, List<Cookie> storedCookieList, Cookie newCookie) throws URISyntaxException, IOException {

                Cookie oldCookie = null;
                Map<String, List<String>> cookieMap = new HashMap<>();

                for (Cookie storedCookie : storedCookieList) {

                    // create key for comparison
                    final String oldCookieKey = storedCookie.name() + storedCookie.path();
                    final String newCookieKey = newCookie.name() + newCookie.path();

                    if (oldCookieKey.equals(newCookieKey)) {
                        oldCookie = storedCookie;
                        break;
                    }
                }
                if (oldCookie != null) {
                    storedCookieList.remove(oldCookie);
                }
                storedCookieList.add(newCookie);

                cookieMap.put("Set-cookie", Collections.singletonList(newCookie.toString()));
                cookieHandler.put(url.uri(), cookieMap);
            }
        };

    }

    public static String getDomainName(String url) throws URISyntaxException {
        URI uri = new URI(url);
        String domain = uri.getHost();
        return domain.startsWith("www.") ? domain.substring(4) : domain;
    }


    @ReactMethod
    public void getCookies(String domain, final Promise promise) {
        try {
            WritableMap map = new WritableNativeMap();

            List<Cookie> cookies = cookieStore.get(getDomainName(domain));

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    map.putString(cookie.name(), cookie.value());
                }
            }

            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    @ReactMethod
    public void removeCookieByName(String cookieName, final Promise promise) {
        List<Cookie> cookies = null;

        for (String domain : cookieStore.keySet()) {
            List<Cookie> newCookiesList = new ArrayList<>();

            cookies = cookieStore.get(domain);
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (!cookie.name().equals(cookieName)) {
                        newCookiesList.add(cookie);
                    }
                }
                cookieStore.put(domain, newCookiesList);
            }
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void fetch(String hostname, final ReadableMap options, final Callback callback) {

        final WritableMap response = Arguments.createMap();

        String domainName;
        try {
            domainName = getDomainName(hostname);
        } catch (URISyntaxException e) {
            domainName = hostname;
        }
        client = OkHttpUtils.buildOkHttpClient(this.reactContext, cookieJar, domainName, options);

        try {
            Request request = OkHttpUtils.buildRequest(this.reactContext, options, hostname);

            client.newCall(request).enqueue(new okhttp3.Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    if (e != null){
                        String message = TextUtils.isEmpty(e.getMessage()) ? "e.getMessage() is null" : e.getMessage();
                        if (e.getCause() instanceof SSLException) {
                            response.putInt("status", -2);
                            response.putString("error", "TLS connection could not be established: " + message);
                            Timber.w("TLS connection could not be established" + message);
                        } else if (e.getCause() instanceof UnknownHostException) {
                            response.putInt("status", -3);
                            response.putString("error","Host could not be resolved: " + message);
                            Timber.w("Host could not be resolved: " + message);
                        } else if (e.getCause() instanceof SocketTimeoutException) {
                            response.putInt("status", -4);
                            response.putString("error","Request timed out: " + message);
                            Timber.w("Request timed out: " + message);
                        } else if (e.getCause() instanceof CertificateException) {
                            response.putInt("status", -5);
                            response.putString("error","CertificateException: " + message);
                            Timber.w("CertificateException: " + message);
                        }else {
                            response.putInt("status", -1);
                            response.putString("error","There was an error with the request: " + message);
                            Timber.w("Generic request error: " + message);
                        }
                    }
                    else{
                        String message = "e is null";
                        response.putInt("status", -1);
                        response.putString("error","There was an error with the request: " + message);
                        Timber.w("Generic request error: " + message);
                    }
                    callback.invoke(response, null);
                }

                @Override
                public void onResponse(Call call, Response okHttpResponse) throws IOException {
                    byte[] bytes = okHttpResponse.body().bytes();
                    String stringResponse = new String(bytes, "UTF-8");
                    String responseType = "";

                    //build response headers map
                    WritableMap headers = buildResponseHeaders(okHttpResponse);
                    //set response status code
                    response.putInt("status", okHttpResponse.code());
                    if (options.hasKey(RESPONSE_TYPE)) {
                        responseType = options.getString(RESPONSE_TYPE);
                    }
                    switch (responseType) {
                        case "base64":
                            String base64;
                            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                                base64 = android.util.Base64.encodeToString(bytes, android.util.Base64.DEFAULT);
                            } else {
                                base64 = Base64.getEncoder().encodeToString(bytes);
                            }
                            response.putString("data", base64);
                            break;
                        default:
                            response.putString("bodyString", stringResponse);
                            break;
                    }
                    response.putMap("headers", headers);

                    if (okHttpResponse.isSuccessful()) {
                        callback.invoke(null, response);
                    } else {
                        callback.invoke(response, null);
                    }
                }
            });


        } catch (JSONException e) {
            response.putInt("status", -1);
            response.putString("error", e.getMessage());
            Timber.e("An unexpected error occured: " + e.toString());
            callback.invoke(response, null);
        }

    }

    @NonNull
    private WritableMap buildResponseHeaders(Response okHttpResponse) {
        Headers responseHeaders = okHttpResponse.headers();
        Set<String> headerNames = responseHeaders.names();
        WritableMap headers = Arguments.createMap();
        for (String header : headerNames) {
            headers.putString(header, responseHeaders.get(header));
        }
        return headers;
    }

    @Override
    public String getName() {
        return "RNSslPinning";
    }

    @ReactMethod
    public void cancelAllUpload() {
        Timber.d("RNSslPinningModule -> cancelAllUpload");
        OkHttpUtils.cancelAllUpload();
    }

}
