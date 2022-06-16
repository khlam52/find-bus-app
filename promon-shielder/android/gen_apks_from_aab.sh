rm -f ../../app-build/shielded-app-uat.apks

java -jar Shielder.jar --config promon_config_android.xml ../../android/app/build/outputs/bundle/uat/app-uat.aab \
--keystore ../../android/app/forms_release.keystore --storepass Aa123456 \
--keyname forms --keypass Aa123456 \
--sigalg SHA256withRSA --digestalg SHA256 \
--dat Shielder.release.dat \
--output ../../app-build/shielded-app-uat.aab

bundletool build-apks --bundle=../../app-build/shielded-app-uat.aab \
--ks=../../android/app/forms_release.keystore \
--ks-pass=pass:Aa123456 \
--ks-key-alias=forms \
--key-pass=pass:Aa123456 \
--output=../../app-build/shielded-app-uat.apks

bundletool install-apks --apks=../../app-build/shielded-app-uat.apks