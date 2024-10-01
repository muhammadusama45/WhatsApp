import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  mainview: {
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 2,
    alignItems: 'center',
  },
  image: {height: 50, width: 50, borderRadius: 25},

  view1: {flex: 1, justifyContent: 'center'},
  view2: {
    flex: 1,
    flexDirection: 'row',
  },
  text1: {flex: 1, paddingLeft: 5, fontSize: 20, fontWeight: 'bold'},
  text2: {
    width: 80,
    textAlign: 'center',
    //justifyContent:"flex-end"
  },
  view3: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text3: {
    flex: 1,
    paddingLeft: 5,
    fontSize: 20,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  view4: {
    width: 30,
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 500,
  },
  listContainer: {
    zIndex: 500,
    padding: 10,
  },
  mainView: {
    zIndex: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 10,
    shadowRadius: 5.5,
    shadowOpacity: 0.32,
  },
  row: {
    zIndex: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: 'grey',
  },
  messageText: {
    fontSize: 16,
    color: 'black',

    flex: 1,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
  },
  fab: {
    backgroundColor: 'blue',
    height: 60,
    width: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 90,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
