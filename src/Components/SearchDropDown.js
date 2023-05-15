import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

export default function SearchDropDown(props) {
  const {dataSource} = props; //take data from parent
  return (
    //main container to position list over parent.
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <View style={styles.subContainer}>
        {
          //if search results matched it'll have some length.
          dataSource.length ? (
            //then show results
            dataSource.map((item,index) => {
              return (
                <View key={index} style={styles.itemView}>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              );
            })
          ) : (
            //if there were no results show no result text instead of empty view
            <View style={styles.noResultView}>
              <Text style={styles.noResultText}>No search items matched</Text>
            </View>
          )
        }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '6.2%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  subContainer: {
    backgroundColor: '#84DCC6',
    paddingTop: 10,
    marginHorizontal: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexWrap: 'wrap',

    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  itemView: {
    // marginHorizontal: '10%',
    backgroundColor: 'white',
    height: 30,
    width: '90%',
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 4,
  },
  itemText: {
    color: 'black',
    paddingHorizontal: 10,
  },
  noResultView: {
    alignSelf: 'center',
    // margin: 20,
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  noResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
