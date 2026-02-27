import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 70,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoImage: {
    width: 95,
    height: 95,
    marginBottom: 5,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },

  card: {
    width: '88%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },

  inputWrapper: {
    marginBottom: 15,
  },

  input: {
    height: 50,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  saveButton: {
    marginTop: 10,
    backgroundColor: '#DAB86E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default styles;