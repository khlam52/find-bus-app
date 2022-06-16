
# react-native-common-util

## Getting started

`$ npm install react-native-common-util --save`

### Mostly automatic installation

`$ react-native link react-native-common-util`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-common-util` and add `RNCommonUtil.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCommonUtil.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNCommonUtilPackage;` to the imports at the top of the file
  - Add `new RNCommonUtilPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-common-util'
  	project(':react-native-common-util').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-common-util/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-common-util')
  	```


## Usage
```javascript
import RNCommonUtil from 'react-native-common-util';

// TODO: What to do with the module?
RNCommonUtil;
```
  