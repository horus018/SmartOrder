import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  menuTitle: {
    fontSize: 35,
    fontWeight: '900',
    color: '#0B0F14',
  },
  menuSubtitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#264653',
  },
});

export default styles;