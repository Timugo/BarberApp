# THIS APP IS BUILD WITH IONIC FRAMEWORK
- This app use Angular.js 
- This app use Capcitor compile to Works with Android, IOS, PWA and Electron deployments

# How to Update ionic version to the last: 

## for an angular app
- npm i @ionic/angular@latest --save

## for a react app
- npm i @ionic/react@latest --save
- npm i @ionic/react-router@latest --save
- npm i ionicons@latest --save

## for a stencil / vanilla JS app
- npm i @ionic/core@latest --save

# How to run app 

- ionic serve (development server)
- ionic serve --prod (production server)

# How to compile app

- ionic build (development build that is more heavy and takes development url)
- ionic build --prod (production server, compress respurces and use production url)

# CAPACITOR WORK FLOW

- ionic build
- npx cap copy
- npx cap open android/ios (open the android studio or xcode )

## update capacitor 

- npm install --save @capacitor/core @capacitor/cli

## PWA firebase work flow

- firebase login(if first deploy)
- ionic build --prod
- firebase deploy