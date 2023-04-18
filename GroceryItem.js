import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import {
	ref,
	update
} from 'firebase/database';
import { db } from './firebase-config.js';

const GroceryItem = ({ groceryItem: { title, done, saleLocation }, id }) => {
	const [doneState, setDone] = useState(done);

	const onCheck = (isChecked) => {
		setDone(isChecked);
		update(ref(db, '/groceryItem'), {
			[id]: {
				title,
				done: !doneState,
				saleLocation
			},
		});
	};

	return (
		<View style={styles.groceryItem}>
			<Checkbox
				onValueChange={onCheck}
				value={doneState}
			/>
			<Text style={[styles.groceryText, { opacity: doneState ? 0.2 : 1 }]}>
				{title}{`  `}{saleLocation}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	groceryItem: {
		flexDirection: 'row',
		marginVertical: 10,
		alignItems: 'center',
	},
	groceryText: {
		paddingHorizontal: 5,
		fontSize: 16
	},
});

export default GroceryItem;