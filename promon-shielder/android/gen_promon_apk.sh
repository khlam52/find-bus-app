BUILD_TYPE=$1
APK_FILE_NAME=$2

rawWrappedApkName=wrapped-app-$BUILD_TYPE.apk
rawApkPath=../../android/app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk

java -jar Shielder.jar --config promon_config_android.xml $rawApkPath \
      --keystore ../../android/app/forms_release.keystore --storepass Aa123456 \
      --keyname forms --keypass Aa123456 \
      --sigalg SHA256withRSA --digestalg SHA256 \
      --dat Shielder.release.dat

mv ./$rawWrappedApkName ./$APK_FILE_NAME