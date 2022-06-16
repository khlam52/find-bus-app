# Promon Android Shielder

## Version: Shield_Android.4.2.6.51719

## Usage

Promon script to shield:

```
java -jar Shielder.jar --config <config.xml> <input.apk> \
--keystore <keystore.jks> --storepass <password> \
--keyname <alias> --keypass <password> \
--sigalg SHA256withRSA --digestalg SHA256
```

Example to include promon shield for an apk:

```
$ java -jar Shielder.jar --config promon_config_android.xml ../../android/app/release/app-release.apk \
      --keystore ../../android/app/forms_release.keystore --storepass Aa123456 \
      --keyname forms --keypass Aa123456 \
      --sigalg SHA256withRSA --digestalg SHA256 \
      --dat Shielder.release.dat
```
