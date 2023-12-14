const React = require('react-native');

const {StyleSheet} = React;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d3ffdd',
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    borderColor: '#e6e6e6',
    borderWidth: 1,
    borderRadius: 5,
    width: 300,
    margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    fontSize: 16,
    placeholderTextColor: '#8b8b8b',
  },
  loginButton1: {
    backgroundColor: '#3897f1',
    borderRadius: 10,
    height: 45,
    marginVertical: 10,
    width: 300,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
    text: {
      alignSelf: 'center',
      color: '#fff',
      fontWeight: '600',
    },
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // o 'contain'
  },
  registerButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: 350,
    alignItems: 'center',
  },
});
export default styles;
