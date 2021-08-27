import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const Image = FastImage;
const {height} = Dimensions.get('window');
const imageSize = height * 0.18;

export const GettingCall = props => {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../../../../assets/images/cover.jpeg')}
        style={styles.image}
      /> */}
      <View style={styles.imageBlock}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{uri: props.photo}}
            resizeMode="cover"
            //onError={onImageError}
          />
        </View>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={props.join}
          style={{backgroundColor: 'green', marginRight: 30}}
          activeOpacity={0.5}>
          <Avatar
            rounded
            source={{
              uri:
                'https://cdn.icon-icons.com/icons2/2440/PNG/512/phone_call_icon_148513.png',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.hangup}
          style={{backgroundColor: 'red', marginLeft: 30}}
          activeOpacity={0.5}>
          <Avatar
            rounded
            source={{
              uri:
                'https://cdn.icon-icons.com/icons2/2440/PNG/512/phone_call_icon_148513.png',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
  },
  // image: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  // },
  btnContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBlock: {
    flex: 1,
    paddingTop: 50,
    //flexDirection: 'row',
    //width: '100%',
    //justifyContent: 'center',
    //alignItems: 'center',
    //marginBottom: 20,
  },
  imageContainer: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize,
    shadowColor: '#006',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    overflow: 'hidden',
  },
});
