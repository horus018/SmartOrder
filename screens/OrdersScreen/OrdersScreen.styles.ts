import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#D63031',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  modalOverlay: {
    flex: 1,
  },
  modalPositionWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalDropdown: {
    position: 'absolute',
    top: 110,
    right: 60,
    width: 130,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    zIndex: 100,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#333',
  },

  orderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: '#FFEB3B50',
    color: '#F9A825', 
  },
  statusDelivered: {
    backgroundColor: '#4CB58F50',
    color: '#2E7D32',
  },
  statusPaid: {
    backgroundColor: '#9575CD50',
    color: '#673AB7',
  },
});

export default styles;