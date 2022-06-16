# App Icon Generation
Please note that app icon image for android should contain more space from center content. You can make a reference by app_icon_android.png & app_icon_ios.png which content is colored in orange.

## React-native-make

To generation icons assets:

## IOS

```bash
react-native set-icon --platform ios --path path-to-image
```

## Android

```bash
react-native set-icon --platform android --path path-to-image
```

`ic_launcher.png` and `ic_launcher.xml` will be generated, there is conflict for other project, we will rename:

`ic_launcher.png` to `icon.png` \
`ic_launcher.xml` to `icon.xml`
