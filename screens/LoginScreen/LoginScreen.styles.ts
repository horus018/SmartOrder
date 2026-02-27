import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 5, 
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 20, 
  },
  
  bottomContentWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  bottomContent: {
    width: '100%',
    paddingHorizontal: 20,
  },
  
  initialButtonsContainer: {
    width: '100%',
  },
  
  loginCard: {
    width: '100%',
    paddingHorizontal: 0,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 5,
    zIndex: 10,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  inputError: {
    borderColor: '#d63031',
    backgroundColor: '#FFEEEE',
  },
  errorText: {
    color: '#d63031',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  
  loginButton: {
    width: '100%',
    backgroundColor: '#DAB86E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientButton: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAB86E',
  },
  clientButtonText: {
    color: '#DAB86E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});

export default styles;