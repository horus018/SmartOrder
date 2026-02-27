  import { StyleSheet } from 'react-native';
  
  const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#264653',
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  userIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9C46A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  tableNumber: {
    fontSize: 14,
    color: '#fff',
  },
  headerButton: {
    backgroundColor: '#E9C46A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;