import {StyleSheet, Dimensions} from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#264653',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10, 
    paddingBottom: 50,
    alignItems: 'center',
  },
  backButtonTop: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  contentWrapper: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    maxWidth: 600,
  },
  cameraFrame: {
    width: '100%',
    maxWidth: width * 0.9,
    aspectRatio: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  scannerAreaFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerAreaBorder: {
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: '#264653',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerTextFallback: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  
  camera: {
    width: '100%',
    height: '100%',
  },
  scannerAreaOverlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: 'white',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10, 
  },
  scannerTextOverlay: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },

  permissionDeniedArea: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#264653',
    paddingHorizontal: 15,
    height: 55,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBlockColor: '#264653',
  },
  inputIcon: {
    marginLeft: 10,
    padding: 5,
  },
});

export default styles;