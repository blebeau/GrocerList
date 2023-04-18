import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { db } from './firebase-config.js';
import {
  ref,
  onValue,
  push,
  remove
} from 'firebase/database';
import React, { useState, useEffect } from 'react';
import GroceryItem from './GroceryItem.js';


const App = () => {
  const [groceries, setGroceries] = useState({});
  const [presentGrocery, setPresentGrocery] = useState('');
  const [salelocation, setSaleLocation] = useState('');

  useEffect(() => {
    return onValue(ref(db, '/groceryItem'), querySnapShot => {
      let data = querySnapShot.val() || {};
      let groceryItems = { ...data };

      setGroceries(groceryItems);
    });
  }, []);

  function addItemToList() {
    push(ref(db, '/groceryItem'), {
      title: presentGrocery,
      saleLocation: salelocation,
      done: false
    });
    setPresentGrocery('');
    setSaleLocation('');
  }

  function clearGroceryList() {
    remove(ref(db, '/groceryItem'));
  }
  const groceryKeys = Object.keys(groceries);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <View>
        {groceryKeys.length > 0 ? (
          groceryKeys.map(key => (
            <GroceryItem
              key={key}
              id={key}
              groceryItem={groceries[key]}
            />
          ))
        ) : (
          <Text>No groceries on your list</Text>
        )}
      </View>

      <TextInput
        placeholder="New Grocery"
        value={presentGrocery}
        style={styles.textInput}
        onChangeText={text => {
          setPresentGrocery(text);
        }}
        onSubmitEditing={addItemToList}
      />
      <TextInput
        placeholder="Sale Location"
        value={salelocation}
        style={styles.textInput}
        onChangeText={text => {
          setSaleLocation(text);
        }}
      />

      <View>
        <View style={{ marginTop: 20 }}>
          <Button
            title="Add new grocery"
            onPress={addItemToList}
            color="green"
            disabled={presentGrocery == ''}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Button
            title="Clear Grocery List"
            onPress={clearGroceryList}
            color="red"
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12
  },
  contentContainerStyle: {
    padding: 50
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#afafaf',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
    fontSize: 20,
  },
});

export default App;
