package com.musicapp;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.BV.LinearGradient.LinearGradientPackage;
import com.tanguyantoine.react.MusicControl;
import com.brentvatne.react.ReactVideoPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.reactnativenavigation.RnnPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new LinearGradientPackage(),
            new MusicControl(),
            new ReactVideoPackage(),
            new RNSpinkitPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new BlurViewPackage(),
            new RnnPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
