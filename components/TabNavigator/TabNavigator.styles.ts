import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#EAEAEA',
    height: 70,
    borderTopWidth: 0,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabButton: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  tabInactive: {
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderRadius: 25,
  },
  screenContainerFloating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
    zIndex: 5,
    backgroundColor: 'white',
  },
  floatingCartButton: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#1F2937', 
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 90,
    shadowColor: '#000000ff',
    elevation: 4,
  },
  cartIconImage: {
    width: 26,
    height: 26,
    tintColor: 'white',
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#d63031',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default styles;