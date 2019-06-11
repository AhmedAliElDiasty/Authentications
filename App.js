'use strict';

const FBSDK = require('react-native-fbsdk');

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
const { LoginButton, ShareDialog, AccessToken } = FBSDK;
import { GoogleSignin, GoogleSigninButton , statusCodes} from 'react-native-google-signin';

GoogleSignin.configure();

export default class HelloFacebook extends Component {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://www.facebook.com/',
    };

    this.state = {
      shareLinkContent,
    };
  }

  async shareLinkWithShareDialog() {
    const canShow = await ShareDialog.canShow(this.state.shareLinkContent);
    if (canShow) {
      try {
        const { isCancelled, postId } = await ShareDialog.show(
          this.state.shareLinkContent,
        );
        if (isCancelled) {
          Alert.alert('Share cancelled');
        } else {
          Alert.alert('Share success with postId: ' + postId);
        }
      } catch (error) {
        Alert.alert('Share fail with error: ' + error);
      }
    }
  }

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
      console.log('Success',userInfo);
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        console.log('other',error);
        // some other error happened
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        />
        <TouchableHighlight
          style={styles.share}
          onPress={this.shareLinkWithShareDialog.bind(this)}
        >
          <Text style={styles.shareText}>Share link with ShareDialog</Text>
        </TouchableHighlight>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});
