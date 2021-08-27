import {StyleSheet} from 'react-native';

const dynamicStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: 'white',
    },
    logoutContainer: {
      width: '70%',
      backgroundColor: '#ea60d6',
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
      justifyContent: 'center',
      height: 48,
    },
  });
};

export default dynamicStyles;
