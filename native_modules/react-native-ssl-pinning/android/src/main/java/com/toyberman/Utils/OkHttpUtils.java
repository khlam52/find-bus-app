package com.toyberman.Utils;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.toyberman.BuildConfig;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.ConnectionSpec;
import okhttp3.CookieJar;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import timber.log.Timber;

/**
 * Created by Max Toyberman on 2/11/18.
 */

public class OkHttpUtils {

    private static final String HEADERS_KEY = "headers";
    private static final String BODY_KEY = "body";
    private static final String METHOD_KEY = "method";
    private static final String FILE = "file";
    private static final HashMap<String, OkHttpClient> clientsByDomainAndTimeout = new HashMap<>();
    private static final HashMap<String, OkHttpClient> uploadClientByDomainAndTimeout = new HashMap<>();
    private static SSLContext sslContext;
    private static X509TrustManager trustManager;
    private static SSLSocketFactory sslSocketFactory;
    private static String content_type = "application/json; charset=utf-8";
    private static MediaType mediaType = MediaType.parse(content_type);
    private static int timeout = 60000;

    public static OkHttpClient getNewClient(ReactContext context, CookieJar cookieJar, String domainName, ReadableMap options){
        // add logging interceptor
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        String clientCertPinningMode = "none";
        if (options.hasKey("clientCertPinningMode")) {
            clientCertPinningMode = options.getString("clientCertPinningMode");
        }
        String clientCertName = "";
        if (options.hasKey("clientCertName")) {
            clientCertName = options.getString("clientCertName");
        }
        String clientCertPw = "";
        if (options.hasKey("clientCertPw")) {
            clientCertPw = options.getString("clientCertPw");
        }

        OkHttpUtils.initCertPinning(context, clientCertPinningMode, clientCertName, clientCertPw);

        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();

        clientBuilder
                .readTimeout(timeout, TimeUnit.MILLISECONDS)
                .writeTimeout(timeout, TimeUnit.MILLISECONDS)
                .connectTimeout(timeout, TimeUnit.MILLISECONDS);

        if (BuildConfig.DEBUG) {
            clientBuilder.addInterceptor(logging);
        }

        OkHttpClient client = null;
        if (options.hasKey("certPinningMode")){
            String certPinningMode = options.getString("certPinningMode");
            if (certPinningMode.equalsIgnoreCase("none")){
                client = OkHttpUtils.getUnsafeOkHttpClient(cookieJar, clientCertPinningMode);
            }
            else if (certPinningMode.equalsIgnoreCase("pinned")){
                client = clientBuilder
                        .cookieJar(cookieJar)
                        .connectionSpecs(Arrays.asList(ConnectionSpec.COMPATIBLE_TLS))
                        .sslSocketFactory(sslSocketFactory, trustManager)
                        .build();
            }
        }
        return client;
    }

    public static OkHttpClient buildOkHttpClient(ReactContext context, CookieJar cookieJar, String domainName, ReadableMap options) {
        if (options.hasKey("timeoutInterval")) {
            timeout = options.getInt("timeoutInterval");
        }

        boolean isFileUpload = false;
        if (options.hasKey("isFileUpload")) {
            isFileUpload = options.getBoolean("isFileUpload");
        }

        HashMap<String, OkHttpClient> clientList = isFileUpload ? uploadClientByDomainAndTimeout : clientsByDomainAndTimeout;

        if (!clientList.containsKey(domainName+timeout)) {
            OkHttpClient client = OkHttpUtils.getNewClient(context, cookieJar, domainName, options);
            clientList.put(domainName+timeout, client);
            return client;
        }
        return clientList.get(domainName+timeout);
    }

    public static Request buildRequest(Context context, ReadableMap options, String hostname) throws JSONException {
        Request.Builder requestBuilder = new Request.Builder();
        FormBody.Builder formBuilder = new FormBody.Builder();
        MultipartBody.Builder multipartBodyBuilder = new MultipartBody.Builder().setType(MultipartBody.FORM);
        multipartBodyBuilder.setType((MediaType.parse("multipart/form-data")));
        RequestBody body = null;

        String method = "GET";
        if (options.hasKey(HEADERS_KEY)) {
            setRequestHeaders(options, requestBuilder);
        }

        if (options.hasKey(METHOD_KEY)) {
            method = options.getString(METHOD_KEY);
        }

        if (options.hasKey(BODY_KEY)) {
            ReadableType bodyType = options.getType(BODY_KEY);
            switch (bodyType) {
                case String:
                    if (mediaType.toString().contains("x-www-form-urlencoded")){
                        try {
                            JSONObject jsonObject = new JSONObject(options.getString(BODY_KEY));
                            Iterator<?> iterator = jsonObject.keys();
                            while (iterator.hasNext()) {
                                Object key = iterator.next();
                                Object value = jsonObject.get(key.toString());
                                formBuilder.add(key.toString(), value.toString());
                            }
                            body = formBuilder.build();
                        }catch (JSONException err){
                            Timber.d("Error: " +  err.toString());
                        }
                    }
                    else{
                        body = RequestBody.create(options.getString(BODY_KEY), mediaType);
                    }
                    break;
                case Map:
                    ReadableMap bodyMap = options.getMap(BODY_KEY);
                    if (bodyMap.hasKey("formData")) {
                        ReadableMap formData = bodyMap.getMap("formData");

                        if (formData.hasKey("_parts")) {
                            ReadableArray parts = formData.getArray("_parts");
                            for (int i = 0; i < parts.size(); i++) {
                                ReadableArray part = parts.getArray(i);

                                if (part.getType(0) == ReadableType.String) {
                                    String key = part.getString(0);

                                    if (key.equals("file")) {

                                        ReadableMap fileData = part.getMap(1);

                                        Uri _uri = Uri.parse(fileData.getString("uri"));

                                        String type = fileData.getString("type");

                                        String fileName = fileData.getString("fileName");
                                        File file = null;
                                        try {
                                            file = getTempFile(context, _uri);
                                            multipartBodyBuilder.addFormDataPart(key, fileName, RequestBody.create(file, MediaType.parse(type)));
                                        } catch (IOException e) {
                                            e.printStackTrace();
                                        }
                                    } else {
                                        String value = part.getString(1);
                                        multipartBodyBuilder.addFormDataPart(key, value);
                                    }
                                }
                            }
                            body = multipartBodyBuilder.build();
                        }
                    }
                    break;
            }
        }
        return requestBuilder
                .url(hostname)
                .method(method, body)
                .build();
    }

    public static File getTempFile(Context context, Uri uri) throws IOException {
        File file = File.createTempFile("media", null);
        InputStream inputStream = context.getContentResolver().openInputStream(uri);
        OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file));
        byte[] buffer = new byte[1024];
        int len;
        while ((len = inputStream.read(buffer)) != -1)
            outputStream.write(buffer, 0, len);
        inputStream.close();
        outputStream.close();
        return file;
    }

    private static void setRequestHeaders(ReadableMap options, Request.Builder requestBuilder) {
        ReadableMap map = options.getMap((HEADERS_KEY));
        //add headers to request
        Utilities.addHeadersFromMap(map, requestBuilder);
        if (map.hasKey("content-type")) {
            content_type = map.getString("content-type");
            mediaType = MediaType.parse(content_type);
        }
    }

    private static void initCertPinning(ReactContext context, String clientCertPinningMode, String clientCertName, String clientCertPw) {
        // SSLFactory
        try {
            if (sslContext == null) {

                // client
                KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
                if (clientCertPinningMode.equalsIgnoreCase("pinned")) {
                    KeyStore clietKeyStore = KeyStore.getInstance("PKCS12");
                    InputStream clientCertificateContent = context.getAssets().open("client_cert/" + clientCertName + ".p12");
                    clietKeyStore.load(clientCertificateContent, clientCertPw.toCharArray());

                    keyManagerFactory.init(clietKeyStore, clientCertPw.toCharArray());
                }

                sslContext = SSLContext.getInstance("TLS");
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                String keyStoreType = KeyStore.getDefaultType();
                KeyStore keyStore = KeyStore.getInstance(keyStoreType);
                keyStore.load(null, null);

                AssetManager assetManager = context.getAssets();
                String[] certs = assetManager.list("certs");
                for (int i = 0; i < certs.length; i++) {
                    InputStream caInput = context.getAssets().open("certs/" + certs[i]);
                    Certificate ca;
                    try {
                        ca = cf.generateCertificate(caInput);
                    } finally {
                        caInput.close();
                    }

                    keyStore.setCertificateEntry(certs[i], ca);
                }

                String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
                TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
                tmf.init(keyStore);

                TrustManager[] trustManagers = tmf.getTrustManagers();

                if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
                    throw new IllegalStateException("Unexpected default trust managers:"
                            + Arrays.toString(trustManagers));
                }
                trustManager = (X509TrustManager) trustManagers[0];
                if (clientCertPinningMode.equalsIgnoreCase("pinned")) {
                    sslContext.init(keyManagerFactory.getKeyManagers(), new TrustManager[]{trustManager}, null);
                } else {
                    sslContext.init(null, new TrustManager[] { trustManager }, null);
                }
                sslSocketFactory = sslContext.getSocketFactory();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static OkHttpClient getUnsafeOkHttpClient(CookieJar cookieJar, String clientCertPinningMode) {
        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain,
                                                       String authType) throws CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain,
                                                       String authType) throws CertificateException {
                        }

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }
                    }
            };

            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            return new OkHttpClient.Builder()
                    .readTimeout(timeout, TimeUnit.MILLISECONDS)
                    .writeTimeout(timeout, TimeUnit.MILLISECONDS)
                    .connectTimeout(timeout, TimeUnit.MILLISECONDS)
                    .connectionSpecs(Arrays.asList(ConnectionSpec.COMPATIBLE_TLS))
                    .sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0])
                    .cookieJar(cookieJar)
                    .hostnameVerifier(new HostnameVerifier() {
                        @Override
                        public boolean verify(String hostname, SSLSession session) {
                            return true;
                        }
                    }).build();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void cancelAllUpload(){
        Iterator iterator = uploadClientByDomainAndTimeout.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry aEntry = (Map.Entry) iterator.next();
            OkHttpClient aClient = (OkHttpClient) aEntry.getValue();
            if (aClient != null){
                aClient.dispatcher().cancelAll();
            }
        }
    }
}
