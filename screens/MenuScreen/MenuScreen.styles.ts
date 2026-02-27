import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cartIconImage: {
    width: 26,
    height: 26,
    tintColor: 'white',
  },
  addToCartButton: {
    backgroundColor: '#E76F51',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: -5,
    marginRight: -15,
  },
  menuItemContainerSelected: {
    backgroundColor: '#E9C46A60',
    borderRadius: 8,
  },
  menuItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  menuItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#888',
  },
  priceAndQuantity: {
    alignItems: 'center',
    minWidth: 100,
  },
  menuItemPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
    marginBottom: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  controlButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  controlText: {
    fontSize: 18,
    lineHeight: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E9C46A',
    backgroundColor: 'transparent',
    marginRight: 0,
  },
});

export default styles;